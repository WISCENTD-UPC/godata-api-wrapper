
// Thrid-party libraries
const fetch = require('node-fetch')

// Project modules
const Base = require('./src/base')
const { autoLogin } = require('./src/middleware')
const ENDPOINTS = require('./config/endpoints')

module.exports = class {
  constructor (opts = {}) {
    this.baseURL = opts.baseURL || ''
    this.credentials = opts.credentials || {}
    this.fetch = opts.fetch || fetch
    this._base = opts._base || new Base({ baseURL: this.baseURL, fetch: this.fetch })
    this._Date = opts._Date || Date
  }

  createRequest (config) {
    config.api = this
    config.token = this.token
    return config
  }

  async login (credentials = {}) {
    const email = credentials.email || this.credentials.email
    const password = credentials.password || this.credentials.password
    const request = this.createRequest({
      body: { email, password }
    })

    const response = await this._base.post(ENDPOINTS.USERS.LOGIN(), request)
    this.token = {
      value: response.id,
      ttl: response.ttl,
      lastRefresh: this._Date.now()
    }
    return response
  }

  getLocations () {
    const request = this.createRequest({
      middleware: [ autoLogin ]
    })
    return this._base.get(ENDPOINTS.LOCATIONS.LOCATIONS(), request)
  }

  createLocation (body) {
    const request = this.createRequest({
      middleware: [ autoLogin ],
      body
    })
    return this._base.post(ENDPOINTS.LOCATIONS.CREATE_LOCATION(), request)
  }

  deleteLocation (id) {
    const request = this.createRequest({
      middleware: [ autoLogin ]
    })
    return this._base.delete(ENDPOINTS.LOCATIONS.DELETE_LOCATION(id), request)
  }

  getOutbreaks () {
    const request = this.createRequest({
      middleware: [ autoLogin ]
    })
    return this._base.get(ENDPOINTS.OUTBREAKS.OUTBREAKS(), request)
  }

  createOutbreak (body) {
    const request = this.createRequest({
      middleware: [ autoLogin ],
      body
    })
    return this._base.post(ENDPOINTS.OUTBREAKS.CREATE_OUTBREAK(), request)
  }

  deleteOutbreak (id) {
    const request = this.createRequest({
      middleware: [ autoLogin ]
    })
    return this._base.delete(ENDPOINTS.OUTBREAKS.DELETE_OUTBREAK(id), request)
  }
}

