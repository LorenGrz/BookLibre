import axios from 'axios'
import { API_BASE_URL } from '../env'
import { toast } from 'react-toastify'
import { HttpStatusCodes } from '../constants/http'
import { tokenService } from './tokenService'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // Permite el envío y recepción de cookies HttpOnly
})

// Envía el token en el header para mobile (iOS Safari bloquea cookies SameSite=None cross-origin)
apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    
    // Si la request falla con 401 y no es una request de refresh que ya fue reintentada
    if (error.response?.status === HttpStatusCodes.UNAUTHORIZED && !originalRequest._retry) {
      // No intentar refrescar si el error 401 viene del login (credenciales incorrectas)
      if (originalRequest.url?.includes('/login')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      
      try {
        // Intentar refrescar la sesión
        await axios.post(`${API_BASE_URL}/refresh`, {}, { withCredentials: true })
        // Si fue exitoso, reintentar la request original
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Si el refresh falla, desloguear
        tokenService.clearAll()
        window.location.href = `${import.meta.env.BASE_URL}login`
        return Promise.reject(refreshError)
      }
    } else if (error.response?.status === HttpStatusCodes.FORBIDDEN) {
      toast.error('No tenés permisos para realizar esta acción.')
    }
    
    return Promise.reject(error)
  },
)
