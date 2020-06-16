
const { v1: uuid } = require('uuid')

const API = require('../index.js')
const { autoLogin } = require('../src/middleware')
const ENDPOINTS = require('../config/endpoints')

test('API is created correctly', () => {
  const { APIConfig, api } = createAPI()
  expect(api.baseURL).toBe(APIConfig.baseURL)
  expect(api.credentials.email).toBe(APIConfig.credentials.email)
  expect(api.credentials.password).toBe(APIConfig.credentials.password)
  expect(api._base.baseURL).toBe(APIConfig.baseURL)
})

test('API createRequest should add extra info to config', () => {
  const { APIConfig, api } = createAPI()
  const request = api.createRequest({})
  expect(request.api).toBe(api)
  expect(request.token).toBe(undefined)
})

test('login with api credentials', loginTest(null))

test('login with other credentials', loginTest({ email: uuid(), password: uuid() }))

test('outbreaks should call correct endpoint with autologin', async () => {
  const get = jest.fn().mockReturnValue([])
  const base = { get }
  const { APIConfig, api } = createAPI(base)
  
  const response = await api.outbreaks()

  expect(response).toStrictEqual([])
  expect(get).toHaveBeenCalledWith(ENDPOINTS.OUTBREAKS.OUTBREAKS, {
    api,
    token: undefined,
    middleware: [ autoLogin ]
  })
})

function loginTest (credentials) {
  return async () => {
    const loginResponse = { id: uuid(), ttl: 600 }
    const post = jest.fn().mockReturnValue(loginResponse)
    const base = { post }
    const date = Date.now()
    const { APIConfig, api } = createAPI(base, {
      now: () => date
    }, credentials)

    const request = {
      body: credentials != null ? credentials : APIConfig.credentials,
      api,
      token: undefined
    }

    const response = await api.login()

    expect(post).toHaveBeenCalledWith(ENDPOINTS.USERS.LOGIN, request)
    expect(response).toBe(loginResponse)
    expect(api.token).toStrictEqual({
      value: loginResponse.id,
      ttl: loginResponse.ttl,
      lastRefresh: date
    })
  }
}

function createAPI (base, _Date, credentials) {
  const APIConfig = {
    baseURL: uuid(),
    credentials: { email: uuid(), password: uuid() }
  }

  if (base != null) {
    APIConfig._base = base
  }

  if (_Date != null) {
    APIConfig._Date = _Date
  }

  if (credentials != null) {
    APIConfig.credentials = credentials
  }

  const api = new API(APIConfig)
  
  return { APIConfig, api }
}

