class IGroup {
  #value = 0
  #sensitivity = 1

  constructor(config) {
    this.el = config.el
    this.events = {
      onChange: config.onChange,
      onGetFocus: config.onGetFocus,
      onLostFocus: config.onLostFocus
    }
    this.init()
  }

  init() {
    this.ledGroup = new Led({
      el: this.el,
      keepChildNodes: true
    })

    return this.bindEvents()
  }

  bindEvents() {
    this.el.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();

      const direction = e.wheelDelta;

      Math.abs(direction) === 120 ?
        direction > 0 ? this.changeValue(this.#sensitivity):this.changeValue(-this.#sensitivity):
        direction < 0 ? this.changeValue(this.#sensitivity):this.changeValue(-this.#sensitivity);
    })

    this.el.addEventListener('mouseenter', e => {
      this.el.classList.add('no-transition')
      this.events.onGetFocus?.call(this)
    })

    this.el.addEventListener('mouseleave', e => {
      if (e.target === this.el) {
        this.el.classList.remove('no-transition')
        this.events.onLostFocus?.call(this)
      }
    })

    return this
  }

  changeValue(dir) {
    let val = this.#value + dir

    if (val >= 60) val = 0
    if (val < 0) val = 59

    this.#value  = val

    this.events.onChange?.call(this, {value: this.value, printValue: this.printValue})

    return this
  }

  reset() {
    this.#value = 0
    this.events.onChange?.call(this, {value: this.value, printValue: this.printValue})

    return this
  }

  get value() {
    return Math.floor(this.#value)
  }

  get printValue() {
    return this.value < 10 ? `0${this.value}` : `${this.value}`
  }
}
