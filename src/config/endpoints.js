
export default {
  USERS: {
    LOGIN: () => '/users/login',
    USERS: () => '/users',
    PATCH_USER: (userID) => `/users/${userID}`
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
  },
  CASES: {
    OUTBREAK_CASES: (outbreakID) => `/outbreaks/${outbreakID}/cases`,
    OUTBREAK_CASE: (outbreakID, caseID) => `/outbreaks/${outbreakID}/cases/${caseID}`,
    CREATE_OUTBREAK_CASE: (outbreakID) => `/outbreaks/${outbreakID}/cases`,
    DELETE_OUTBREAK_CASE: (outbreakID, caseID) => `/outbreaks/${outbreakID}/cases/${caseID}`,
    CASE_CONTACTS: (outbreakID, caseID) => `/outbreaks/${outbreakID}/cases/${caseID}/relationships/contacts`,
    CREATE_CONTACT: (outbreakID, caseID) => `/outbreaks/${outbreakID}/cases/${caseID}/contacts`,
    CASE_RELATIONSHIPS: (outbreakID, caseID) => `/outbreaks/${outbreakID}/cases/${caseID}/relationships`,
    CREATE_RELATIONSHIP: (outbreakID, caseID) => `/outbreaks/${outbreakID}/cases/${caseID}/relationships`
  },
  REFERENCE_DATA: {
    REFERENCE_DATA: () => '/reference-data',
    CREATE_REFERENCE_DATA: () => '/reference-data',
    DELETE_REFERENCE_DATA: (id) => `/reference-data/${id}`
  }
}

