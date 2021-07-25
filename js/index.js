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
        return led.stopBlink()
      }
      e.keyCode ===  8 && this.handleBackspace()
      e.keyCode === 27 && this.handleEscape()
      e.keyCode === 32 && this.handleSpace()
    })

    return this
  }

  handleBackspace() {
    console.log('handleBackspace', this.timer.isClean)
    if (this.timer.isClean) {
      this.timer.rewind()
      led.print(this.timer.value.formatted)
    }
  }

  handleEscape() {
    this.focusedGrups?.reset()
  }

  handleSpace() {
    console.log('isClean', this.timer.isClean)
    //
    // Will be ignored if timer has been already initialized
    //
    this.timer.init([
      this.ledGroups[0].value,
      this.ledGroups[1].value,
      this.ledGroups[2].value
    ])
    this.timer.togglePlay()
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
