
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
  }

  createRequest (config) {
    config.api = this
    config.token = this.token
    return config
  }

  // user and passoword
  async login (credentials = {}) {
    const email = credentials.email || this.credentials.email
    const password = credentials.password || this.credentials.password
    const request = this.createRequest({
      body: { email, password }
    })

    const response = await this._base.post(ENDPOINTS.USERS.LOGIN, request)
    this.token = {
      value: response.id,
      ttl: response.ttl,
      lastRefresh: Date.now()
    }
    return response
  }

  outbreaks () {
    const request = this.createRequest({
      middleware: [autoLogin]
    })
    return this._base.get(ENDPOINTS.OUTBREAKS.OUTBREAKS, request)
  }
}

