
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

test('getLocations should call correct endpoint with authlogin', async () => {
  const get = jest.fn().mockReturnValue([])
  const base = { get }
  const { api } = createAPI(base)

  const response = await api.getLocations()

  expect(response).toStrictEqual([])
  expect(get).toHaveBeenCalledWith(ENDPOINTS.LOCATIONS.LOCATIONS(), {
    api,
    token: undefined,
    middleware: [ autoLogin ]
  })
})

test('createLocation should send location with autologin', async () => {
  const responseValue = uuid()
  const post = jest.fn().mockReturnValue(responseValue)
  const base = { post }
  const { api } = createAPI(base)
  const body = uuid()

  const response = await api.createLocation(body)

  expect(response).toBe(responseValue)
  expect(post).toHaveBeenCalledWith(ENDPOINTS.LOCATIONS.CREATE_LOCATION(), {
    api,
    token: undefined,
    middleware: [ autoLogin ],
    body
  })
})

test('deleteLocation should call correct endpoint with autologin', async () => {
  const id = uuid()
  const responseValue = uuid()
  const delete_ = jest.fn().mockReturnValue(responseValue)
  const base = { delete: delete_ }
  const { api } = createAPI(base)
  
  const response = await api.deleteLocation(id)

  expect(response).toBe(responseValue)
  expect(delete_).toHaveBeenCalledWith(ENDPOINTS.LOCATIONS.DELETE_LOCATION(id), {
    api,
    token: undefined,
    middleware: [ autoLogin ]
  })
})

test('getOutbreaks should call correct endpoint with autologin', async () => {
  const get = jest.fn().mockReturnValue([])
  const base = { get }
  const { api } = createAPI(base)
  
  const response = await api.getOutbreaks()

  expect(response).toStrictEqual([])
  expect(get).toHaveBeenCalledWith(ENDPOINTS.OUTBREAKS.OUTBREAKS(), {
    api,
    token: undefined,
    middleware: [ autoLogin ]
  })
})

test('createOutbreak should send outbreak with autologin', async () => {
  const returnValue = uuid()
  const post = jest.fn().mockReturnValue(returnValue)
  const base = { post }
  const { api } = createAPI(base)
  const body = uuid()

  const response = await api.createOutbreak(body)

  expect(response).toBe(returnValue)
  expect(post).toHaveBeenCalledWith(ENDPOINTS.OUTBREAKS.CREATE_OUTBREAK(), {
    api,
    token: undefined,
    middleware: [ autoLogin ],
    body
  })
})

test('deleteOutbreak should call correct endpoint with autologin', async () => {
  const returnValue = uuid()
  const delete_ = jest.fn().mockReturnValue(returnValue)
  const base = { delete: delete_ }
  const { api } = createAPI(base)
  const id = uuid()

  const response = await api.deleteOutbreak(id)

  expect(response).toBe(returnValue)
  expect(delete_).toHaveBeenCalledWith(ENDPOINTS.OUTBREAKS.DELETE_OUTBREAK(id), {
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

    expect(post).toHaveBeenCalledWith(ENDPOINTS.USERS.LOGIN(), request)
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

