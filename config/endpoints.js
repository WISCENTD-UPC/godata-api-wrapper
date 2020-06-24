
module.exports = {
  USERS: {
    LOGIN: () => '/users/login'
  },
  LOCATIONS: {
    LOCATIONS: () => '/locations',
    CREATE_LOCATION: () => '/locations',
    DELETE_LOCATION: (id) => `/locations/${id}`
  },
  OUTBREAKS: {
    OUTBREAKS: () => '/outbreaks',
    CREATE_OUTBREAK: () => '/outbreaks',
    DELETE_OUTBREAK: (id) => `/outbreaks/${id}`
  }
}

