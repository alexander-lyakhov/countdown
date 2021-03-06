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

    return this
  }

  startBlink() {
    this.blinkInterval = setInterval(() => this.el.classList.toggle('on'), 500)
    return this
  }

  stopBlink() {
    this.el.classList.remove('on')
    this.el.classList.add('on')

    clearTimeout(this.blinkInterval)
    this.blinkInterval = null

    return this
  }

  get isBlinking() {
    return !!this.blinkInterval
  }
}
