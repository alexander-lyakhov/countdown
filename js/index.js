const delay = val => new Promise((resolve) => setTimeout(resolve, val))

class Cell {
  static charset = {
    '0': [14, 17, 19, 21, 25, 17, 14],
    '1': [ 4, 12,  4,  4,  4,  4,  4],
    '2': [14,  1,  1, 14, 16, 16, 14],
    '3': [14, 17,  1,  6,  1, 17, 14],
    '4': [ 2,  6, 10, 18, 31,  2,  2],
    '5': [14, 16, 16, 14,  1,  1, 14],
    '6': [14, 16, 16, 30, 17, 17, 14],
    '7': [14,  1,  1,  1,  1,  1,  1],
    '8': [14, 17, 17, 14, 17, 17, 14],
    '9': [14, 17, 17, 15,  1,  1, 14],
    ':': [ 0,  0,  4,  0,  4,  0,  0],
    '-': [ 0,  0,  0, 14,  0,  0,  0],
    ' ': [ 0,  0,  0,  0,  0,  0,  0]
  };

  constructor(config = {}) {
    if (!config.el) {
      throw new Error('class Cell: => Element is not defined !!! --')
    }

    this.el = config.el
    this.keepChildNodes = config.keepChildNodes || false

    this.value = ''
    this.init(config)
  }

  init() {
    if (!this.keepChildNodes) {
      for (let i = 0; i < 35; i++) {
        let div = document.createElement('div')
        div.className = 'led-indicator__pixel'
        this.el.appendChild(div)
      }
    }

    return this
  }

  render(val = ' ') {
    const charset = Cell.charset

    if (this.value !== val.toString()) {
      this.value = val.toString()

      for (let line = 0; line < 7; line++) {

        let byte = charset[val][line]
        let pixel = this.el.childNodes[line * 5 + 4]

        for (let i = 0; i < 5; i++) {
          pixel.classList.toggle('active', byte & 1)
          pixel = pixel.previousSibling;
          byte >>= 1;
        }
      }
    }

    return this
  }
}

class Led {
  constructor(config) {
    if (!config.el) {
      throw new Error('class Led: => Element is not defined !!! --')
    }

    this.el = config.el
    this.keepChildNodes = config.keepChildNodes || false

    this.cells = []
    this.init()
  }

  init() {
    this.el.querySelectorAll('.led-indicator').forEach(el =>
      this.cells.push(new Cell({el, keepChildNodes: this.keepChildNodes}))
    )

    console.log(this.cells)

    return this
  }

  print(_val = '00:00:00') {
    const val = _val.toString()
    const chars = val.split('').reverse()
    const cells = [...this.cells].reverse()

    chars.forEach((c, i) => cells[i]?.render(c))
  }

  blink(isBlinking = true) {
    this.blinkInterval = setInterval(() => this.el.classList.toggle('on'), 500)
  }
}

class Timer {
  constructor(time = [0,0,0], events = {}) {
    this.seconds = 0
    this.interval = null

    this.time = {
      h: time[0],
      m: time[1],
      s: time[2],
    }

    this.onTick = events.onTick
    this.onEnd = events.onEnd

    this.init()
  }

  init() {
    const {h, m, s} = this.time
    this.seconds = h * 3600 + m * 60 + s
    console.log(this.time, this.seconds)
  }

  start() {
    this.interval = setInterval(() => {
      this.seconds = +(this.seconds - .1).toFixed(1)
      const seconds = Math.ceil(this.seconds)

      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds - h * 3600) / 60)
      const s = Math.ceil(seconds - h * 3600 - m * 60)

      const hh = h < 10? `0${h}` : `${h}`
      const mm = m < 10? `0${m}` : `${m}`
      const ss = s < 10? `0${s}` : `${s}`

      console.log(this.time, h, m, s, this.seconds)

      this.onTick?.call(this, {
        h, m, s, seconds, formatted: `${hh}:${mm}:${ss}`
      })

      !this.seconds && this.stop()

    }, 100)

    return this
  }

  stop() {
    console.log('stop !!!')

    clearInterval(this.interval)
    this.interval = null

    this.onEnd?.call(this)

    return this
  }
}

class IGroup {
  constructor(config) {
    this.el = config.el
    this.onChange = config.onChange

    this.groupValue = 0
    this.sensitivity = 1
    this.init()

    console.log(this.el)
  }

  init() {
    this.ledGroup = new Led({
      el: this.el,
      keepChildNodes: true
    })

    this.el.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();

      const direction = e.wheelDelta;

      Math.abs(direction) === 120 ?
        direction > 0 ? this.changeValue(this.sensitivity):this.changeValue(-this.sensitivity):
        direction < 0 ? this.changeValue(this.sensitivity):this.changeValue(-this.sensitivity);
    })

    this.el.addEventListener('mouseenter', e => {
      this.el.classList.add('no-transition')
    })

    this.el.addEventListener('mouseleave', e => {
      e.target === this.el && this.el.classList.remove('no-transition')
    })

    this.el.addEventListener('keydown', e => {
      console.log(e)
    })

    return this
  }

  changeValue(dir) {
    let val = this.groupValue + dir

    if (val >= 60) val = 0
    if (val < 0) val = 59

    this.groupValue  = val

    this.onChange({value: this.value, printValue: this.printValue})

    return this
  }

  get value() {
    return Math.floor(this.groupValue)
  }

  get printValue() {
    return this.value < 10 ? `0${this.value}` : `${this.value}`
  }
}

const led = new Led({
  el: document.querySelector('.led')
})
led.print('00:00:00')

const groupHH = new IGroup({
  el: document.querySelector('.led__group-hh'),
  onChange(e) {
    this.ledGroup.print(e.printValue)
  }
})

const timer = new Timer([0,0,2], {
  onTick(time) {
    led.print(time.formatted)
  },
  onEnd() {
    console.log('!!! FINISH !!!')
    delay(1000).then(() => led.blink())
  }
})

//timer.start()
