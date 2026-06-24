const BASE = import.meta.env.VITE_API_URL
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (typeof BASE === 'string' && BASE !== '' ? BASE : '/api')

const AUTH_PREFIX = import.meta.env.VITE_AUTH_PATH ?? ''
export const AUTH_PATH = (path: string) =>
  AUTH_PREFIX ? `/${AUTH_PREFIX}/${path}` : `/${path}`
