class Timer {
  static STATUS = {
    CLEAN: 0,
    READY: 1,
    BUSY: 2,
  }

  #value
  #status

  constructor(config = {}) {
    this.seconds = 0
    this.interval = null

    this.onTick = config.onTick
    this.onEnd = config.onEnd

    this.#status = Timer.STATUS.CLEAN
  }

  init(time = [0,0,0]) {
    //
    // No inits if timer is charged
    //
    if (this.seconds) return this

    this.time = {
      h: time[0],
      m: time[1],
      s: time[2],
    }

    const [h, m, s] = time
    this.seconds = h * 3600 + m * 60 + s

    console.log(this.time, this.seconds)

    this.computeCurrentTime(this.seconds)

    this.#status = Timer.STATUS.READY

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

    console.log(this.time, h, m, s, this.seconds)

    return this
  }

  togglePlay() {
    return !this.interval ? this.start() : this.stop()
  }

  start() {
    this.interval = setInterval(() => {
      this.seconds = +(this.seconds - .1).toFixed(1)
      const seconds = Math.ceil(this.seconds)

      this.computeCurrentTime(seconds)

      this.onTick?.call(this, this.#value)

      !this.seconds && this.finish()

    }, 100)

    this.#status === Timer.STATUS.BUSY

    return this
  }

  stop() {
    console.log('stop !!!')

    clearInterval(this.interval)
    this.interval = null

    return this
  }

  finish() {
    this.stop()
    this.onEnd?.call(this)
    this.#status = Timer.STATUS.CLEAN

    return this
  }

  rewind() {
    this.#status = Timer.STATUS.READY

    return this.init(
      Object.values(this.time)
    )
  }

  get value() {
    return this.#value
  }

  get status() {
    return this.#status
  }

  get isClean() {
    return this.#status === Timer.STATUS.CLEAN
  }

  get isReady() {
    return this.#status === Timer.STATUS.READY
  }

  get isBusy() {
    return this.#status === Timer.STATUS.BUSY
  }
}
