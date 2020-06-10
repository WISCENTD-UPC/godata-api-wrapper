
const FormData = require('form-data')

const fetch = require('node-fetch')

const ENDPOINTS = require('../config/endpoints')

module.exports = class {
  constructor (opts = {}) {
    this.baseURL = opts.baseURL || ''
    this.credentials = opts.credentials || {}
    this.fetch = opts.fetch || fetch
    this._base = opts._base || new Base({ baseURL: this.baseURL, fetch: this.fetch })
  }

  // user and passoword
  async login (credentials = {}) {
    const email = credentials.email || this.credentials.email
    const password = credentials.password || this.credentials.password
    const body = { email, password }

    const response = await this._base.post(ENDPOINTS.USERS.LOGIN, body)
    this.token = response.id
    console.log(this.token)
    return response
  }
}

class Base {
  constructor (opts = {}) {
    this.baseURL = opts.baseURL || ''
    this.fetch = opts.fetch || fetch
  }

  url (path) {
    return `${this.baseURL}${path}`
  }

  async get (path, query = {}) {
    const token = this.token
    const headers = {
      'Accept': 'application/json'
    }
    if (token != null) {
      headers['Authorization'] = `bearer ${token}`
    }
    const response = await this.fetch(this.url(`${path}?${QueryString.stringify(query)}`), {
      credentials: 'include',
      headers
    })
    return response.json()
  }

  async _bodyVerbs (method = 'POST', path, body = {}, headers = {}) {
    const token = this.token
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    }
    if (token != null) {
      headersConfig['Authorization'] = `bearer ${token}`
    }
    if (headers['Content-Type'] === null) {
      delete headersConfig['Content-Type']
    }
    const response = await this.fetch(this.url(path), {
      method,
      headers: headersConfig,
      credentials: 'include',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
    return response.json()
  }

  _complexBodyVerbs (method, path, body = {}, headers = {}) {
    // middleware between post, put.. and _bodyVerbs to implement CSRF
    // in the future if needed
    return this._bodyVerbs(method, path, body, headers)
  }

  post (path, body = {}, headers = {}) {
    return this._complexBodyVerbs('POST', path, body, headers)
  }

  put (path, body = {}, headers = {}) {
    return this._complexBodyVerbs('PUT', path, body, headers)
  }

  delete (path, body = {}, headers = {}) {
    return this._complexBodyVerbs('DELETE', path, body, headers)
  }
}

class QueryString {
  static decodeURIComponent (...args) {
    decode = window != null && window.decodeURIComponent != null
      ? window.decodeURIComponent
      : _ => _
    return decode(...args)
  }

  static stringify (obj = {}) {
    return Object.keys(obj)
      .map(_ => ({ key: _, value: obj[_] }))
      .filter(_ => _.value != null)
      .reduce((str, value) => {
        return `${str}${value.key}=${value.value}&`
      }, '')
  }

  static parse (str) {
    return str.split('&')
      .map((prop) => {
        const parsed = prop.split('=')
        return {
          key: parsed[0],
          value: QueryString.decodeURIComponent(parsed[1] || '')
        }
      })
      .filter(_ => _.key != null && _.key !== '')
      .reduce((obj, value) => {
        obj[value.key] = value.value
        return obj
      }, {})
  }
}

