
const API = require('./src')

const api = new API({
  baseURL: 'http://localhost:8000/api',
  credentials: {
    email: 'admin@who.int',
    password: 'secretsecret'
  }
})

async function main () {
  //console.log(await api.login())
  console.log(await api.outbreaks())
}

main()

