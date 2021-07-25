class Timer {
  #seconds = 0
  #value = null
  #interval = null
  #bof = true
  #eof = true

  constructor(config = {}) {
    this.onTick = config.onTick
    this.onEnd = config.onEnd

    this.init()
  }

  init(time = [0,0,0]) {
    this.time = {
      h: time[0],
      m: time[1],
      s: time[2],
    }

    const [h, m, s] = time

    this.#seconds = h * 3600 + m * 60 + s
    this.computeCurrentTime(this.#seconds)

    this.#bof = true
    this.#eof = this.#seconds === 0

    return this
  }

  computeCurrentTime(seconds = 0) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds - h * 3600) / 60)
    const s = Math.ceil(seconds - h * 3600 - m * 60)

    const hh = h < 10? `0${h}` : `${h}`
    const mm = m < 10? `0${m}` : `${m}`
    const ss = s < 10? `0${s}` : `${s}`

    this.#value = {h, m, s, seconds, formatted: `${hh}:${mm}:${ss}`}

    //console.log(this.time, h, m, s, this.#seconds)

    return this
  }

  togglePlay() {
    this.#bof = false
    this.#eof = false

    return !this.#interval ? this.start() : this.stop()
  }

  start() {
    this.#interval = setInterval(() => {
      this.#seconds = +(this.#seconds - .1).toFixed(1)
      const seconds = Math.ceil(this.#seconds)

      this.computeCurrentTime(seconds)

      this.onTick?.call(this, this.#value)

      !this.#seconds && this.finish()

    }, 100)

    return this
  }

  stop() {
    console.log('stop !!!')

    clearInterval(this.#interval)
    this.#interval = null

    return this
  }

  finish() {
    this.stop()

    this.#bof = true
    this.#eof = true

    this.onEnd?.call(this)

    return this
  }

  rewind() {
    this.stop()

    this.#bof = true
    this.#eof = this.#seconds === 0

    return this.init(
      Object.values(this.time)
    )
  }

  reset() {
    return this.stop().init([0,0,0])
  }

  get printValue() {
    return this.#value.formatted
  }

  get isClean() {
    return this.#bof && this.#eof
  }

  get isReady() {
    return this.#bof && !this.#eof
  }

  get isBusy() {
    return !this.#bof && !this.#eof
  }

  get bof() {
    return this.#bof
  }

  get eof() {
    return this.#eof
  }
}
