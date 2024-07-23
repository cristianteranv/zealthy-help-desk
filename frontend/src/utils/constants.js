export const STATUS = Object.freeze({
  NEW: 'new',
  IN_PROGRESS: 'in progress',
  DONE: 'done'
})

export const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';