
module.exports = class QueryString {
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

