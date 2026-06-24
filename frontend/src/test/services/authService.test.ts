import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { apiClient } from '../../services/apiClient'
import { authService } from '../../services/AuthService'

vi.mock('../../services/apiClient')
const mockedApiClient = vi.mocked(apiClient, true)

const usuarioMock = {
  id: 1,
  nombre: 'Juan Pérez',
  email: 'juan@mail.com',
  desc: '',
  celular: '',
  ciudad: '',
  tipoUsuario: 'Lector',
  bibliokarmas: 0,
  esAdmin: false,
}

describe('AuthService - login', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('guarda idUsuario en localStorage tras login exitoso', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { success: true, message: 'Login exitoso', usuario: usuarioMock }
    })

    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(localStorage.getItem('idUsuario')).toBe('1')
  })

  it('guarda nombreUsuario en localStorage tras login exitoso', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { success: true, message: 'Login exitoso', usuario: usuarioMock }
    })

    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(localStorage.getItem('nombreUsuario')).toBe('Juan Pérez')
  })

  it('guarda esAdmin en localStorage tras login exitoso', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { success: true, message: 'Login exitoso', usuario: { ...usuarioMock, esAdmin: true } }
    })

    await authService.login({ email: 'admin@booklibre.com', password: 'admin123' })

    expect(localStorage.getItem('esAdmin')).toBe('true')
  })

  it('retorna los datos del response correctamente', async () => {
    const responseMock = { success: true, message: 'Login exitoso', usuario: usuarioMock }
    mockedApiClient.post.mockResolvedValueOnce({ data: responseMock })

    const result = await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(result).toEqual(responseMock)
  })

  it('no guarda nada en localStorage si success es false', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { success: false, message: 'Credenciales inválidas', usuario: null }
    })

    await authService.login({ email: 'juan@mail.com', password: 'wrong' })

    expect(localStorage.getItem('idUsuario')).toBeNull()
    expect(localStorage.getItem('nombreUsuario')).toBeNull()
  })

  it('lanza el error si axios falla', async () => {
    mockedApiClient.post.mockRejectedValueOnce(new Error('Network Error'))

    await expect(
      authService.login({ email: 'juan@mail.com', password: '123' })
    ).rejects.toThrow('Network Error')
  })

  it('llama al endpoint correcto', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { success: true, usuario: usuarioMock }
    })

    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      { email: 'juan@mail.com', password: '123' }
    )
  })
})

describe('AuthService - registro', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('retorna el response del servidor', async () => {
    const responseMock = { success: true, message: 'Registro exitoso', usuario: usuarioMock }
    mockedApiClient.post.mockResolvedValueOnce({ data: responseMock })

    const result = await authService.registro({
      nombre: 'Juan',
      email: 'juan@mail.com',
      password: '123456',
    })

    expect(result).toEqual(responseMock)
  })

  it('guarda idUsuario en localStorage al registrarse', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: { success: true, usuario: usuarioMock }
    })

    await authService.registro({
      nombre: 'Juan',
      email: 'juan@mail.com',
      password: '123456',
    })

    expect(localStorage.getItem('idUsuario')).toBe('1')
  })

  it('llama al endpoint correcto', async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: { success: true } })

    await authService.registro({
      nombre: 'Juan', email: 'juan@mail.com',
      password: '123456',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('/register'),
      expect.objectContaining({ email: 'juan@mail.com' })
    )
  })
})

describe('AuthService - logout', () => {

  it('llama al logout API de forma asyncrona y limpia el storage', async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: {} })
    localStorage.setItem('idUsuario', '1')
    await authService.logout()
    expect(mockedApiClient.post).toHaveBeenCalledWith(expect.stringContaining('/logout'))
    expect(localStorage.getItem('idUsuario')).toBeNull()
  })

  it('no falla si localStorage ya estaba vacío', async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: {} })
    await expect(authService.logout()).resolves.not.toThrow()
  })
})

describe('AuthService - helpers de sesión', () => {

  beforeEach(() => localStorage.clear())

  it('obtenerIdUsuarioActual retorna el id si existe', () => {
    localStorage.setItem('idUsuario', '42')
    expect(authService.obtenerIdUsuarioActual()).toBe(42)
  })

  it('obtenerIdUsuarioActual retorna null si no hay sesión', () => {
    expect(authService.obtenerIdUsuarioActual()).toBeNull()
  })

  it('obtenerNombreUsuarioActual retorna el nombre si existe', () => {
    localStorage.setItem('nombreUsuario', 'Ana')
    expect(authService.obtenerNombreUsuarioActual()).toBe('Ana')
  })

  it('obtenerNombreUsuarioActual retorna null si no hay sesión', () => {
    expect(authService.obtenerNombreUsuarioActual()).toBeNull()
  })

  it('estaAutenticado retorna true si hay id en localStorage', () => {
    localStorage.setItem('idUsuario', '1')
    expect(authService.estaAutenticado()).toBe(true)
  })

  it('estaAutenticado retorna false si no hay id en localStorage', () => {
    expect(authService.estaAutenticado()).toBe(false)
  })
})

describe('AuthService - manejarError', () => {

  it('retorna el mensaje del backend si hay response con message', () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: { message: 'Usuario o contraseña incorrectos' } },
      request: undefined,
    }
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    const mensaje = authService.manejarError(axiosError)
    expect(mensaje).toBe('Usuario o contraseña incorrectos')
  })

  it('retorna mensaje de red si no hay response pero sí request', () => {
    const axiosError = {
      isAxiosError: true,
      response: undefined,
      request: {},
    }
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    const mensaje = authService.manejarError(axiosError)
    expect(mensaje).toBe('No se pudo conectar con el servidor. Intentá más tarde.')
  })

  it('retorna mensaje genérico para errores desconocidos', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(false)
    const mensaje = authService.manejarError(new Error('algo raro'))
    expect(mensaje).toBe('Ocurrió un error inesperado.')
  })
})
