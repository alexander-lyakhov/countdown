const delay = val => new Promise((resolve) => setTimeout(resolve, val))

class Controller {
  constructor(config = {}) {
    if (!config.timer) {
      throw new Error('class Controller: => no Timer defined')
    }
    this.timer = config.timer
    this.groups = []
    this.focusedGrups = null
    this.init()
  }

  init() {
    const _this = this

    this.ledGroups = [
      '.led__group-hh',
      '.led__group-mm',
      '.led__group-ss'
    ].map(selector => {
      return new IGroup({
        el: document.querySelector(selector),
        onChange(e) {
          this.ledGroup.print(e.printValue)
        },
        onGetFocus() {
          _this.focusedGrups = this
        },
        onLostFocus() {
          _this.focusedGrups = null
        }
      })
    })

    return this.bindEvents()
  }

  bindEvents() {
    document.body.addEventListener('keydown', e => {
      console.log(e)

      if (led.isBlinking) {
        this.timer.rewind()
        led.stopBlink().print(this.timer.printValue)
        return
      }
      e.keyCode === 8 && this.handleBackspace()
      e.keyCode === 27 && this.handleEscape()
      e.keyCode === 32 && this.handleSpace()
    })

    return this
  }

  handleBackspace() {
    this.timer.rewind()
    led.print(this.timer.printValue)

    return this
  }

  handleEscape() {
    if (this.focusedGrups) {
      return this.focusedGrups.reset()
    }

       this.ledGroups.map(g => g.reset())
       this.timer.reset()
       led.print(this.timer.printValue)

    return this
  }

  handleSpace() {
    !this.timer.isBusy && this.timer.init([
      this.ledGroups[0].value,
      this.ledGroups[1].value,
      this.ledGroups[2].value
    ])

    if (!this.timer.isClean) {
      this.timer.togglePlay()
    }

    return this
  }
}

const led = new Led({
  el: document.querySelector('.led')
})
led.print('00:00:00')

const timer = new Timer({
  onTick(time) {
    led.print(time.formatted)
  },
  onEnd() {
    console.log('!!! FINISH !!!')
    delay(500).then(() => led.startBlink())
  }
})

new Controller({timer})

//timer.init([0,0,2]).start()
