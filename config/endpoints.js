
module.exports = {
  USERS: {
    LOGIN: () => '/users/login'
  },
  OUTBREAKS: {
    OUTBREAKS: () => '/outbreaks',
    CREATE_OUTBREAK: () => '/outbreaks',
    DELETE_OUTBREAK: (id) => `/outbreaks/${id}`
  }
}

