class Timer {
  constructor(config = {}) {
    this.seconds = 0
    this.interval = null

    this.onTick = config.onTick
    this.onEnd = config.onEnd
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

    return this
  }

  start() {
    if (this.interval) {
      return this.stop()
    }

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

      !this.seconds && this.finish()

    }, 100)

    return this.stop
  }

  stop() {
    console.log('stop !!!')

    clearInterval(this.interval)
    this.interval = null

    return this.start
  }

  finish() {
    this.stop()
    this.onEnd?.call(this)

    return this
  }
}
