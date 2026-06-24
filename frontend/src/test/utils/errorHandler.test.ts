import { describe, it, expect } from 'vitest'
import { obtenerMensajeError } from '../../utils/errorHandler'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

describe('errorHandler - obtenerMensajeError', () => {
  const crearAxiosError = (status: number, data: unknown) => {
    const response: AxiosResponse = {
      data,
      status,
      statusText: 'Error',
      headers: {},
      config: {} as InternalAxiosRequestConfig
    }
    return new AxiosError('Error', String(status), undefined, {}, response)
  }
  it('maneja errores de Axios con mensaje del backend', () => {
    const error = crearAxiosError(409, { message: 'El email ya esta en uso' })
    const resultado = obtenerMensajeError(error)
    
    expect(resultado.estado).toBe(409)
    expect(resultado.mensaje).toBe('El email ya esta en uso')
  })
  it('maneja errores de Axios sin mensaje del backend (fallback 400)', () => {
    const error = crearAxiosError(400, {})
    const resultado = obtenerMensajeError(error)
    
    expect(resultado.estado).toBe(400)
    expect(resultado.mensaje).toBe('Solicitud inválida')
  })
  it('maneja errores de Axios de servidor (500)', () => {
    const error = crearAxiosError(500, {})
    const resultado = obtenerMensajeError(error)
    
    expect(resultado.estado).toBe(500)
    expect(resultado.mensaje).toBe('Ocurrió un error al conectarse al backend. Intente nuevamente más tarde')
  })
  it('maneja errores nativos de JS', () => {
    const error = new Error('Error nativo de javascript')
    const resultado = obtenerMensajeError(error)
    
    expect(resultado.mensaje).toBe('Error nativo de javascript')
  })
  it('maneja errores desconocidos', () => {
    const resultado = obtenerMensajeError('String o tipo de dato inesperado')
    
    expect(resultado.mensaje).toBe('Ocurrió un error. Consulte al administrador del sistema')
  })
})