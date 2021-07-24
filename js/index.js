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
      e.keyCode === 27 && this.focusedGrups?.reset()

      if (e.keyCode === 32) {
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
    })

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
    delay(1000).then(() => led.blink())
  }
})

new Controller({timer})

//timer.init([0,0,2]).start()
