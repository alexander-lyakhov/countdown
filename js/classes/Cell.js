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
