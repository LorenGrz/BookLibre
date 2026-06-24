import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UsuarioData } from '../../classes/usuario'

vi.mock('../../services/apiClient', () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
}))
import { apiClient } from '../../services/apiClient'
const mockedApiClient = vi.mocked(apiClient, true)

// Importar después del mock
import { usuarioService } from '../../services/usuarioService'

const usuarioDataMock: UsuarioData = {
  id: 1,
  nombre: 'Juan Pérez',
  desc: 'desc',
  email: 'juan@mail.com',
  celular: '123',
  ciudad: 'Rosario',
  tipoUsuario: 'Lector',
  bibliokarmas: 10,
  reservados: 0,
  leidos: 0,
  esAdmin: false,
}

const usuarioUpdateResponseMock = {
  usuario: usuarioDataMock,
}

describe('usuarioService — obtenerUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('llama al endpoint correcto y devuelve el data', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: usuarioDataMock } as any)

    const result = await usuarioService.obtenerUsuario(1)

    expect(mockedApiClient.get).toHaveBeenCalledWith('/usuarios/1')
    expect(result).toEqual(usuarioDataMock)
  })

  it('propaga el error si axios falla', async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(usuarioService.obtenerUsuario(1)).rejects.toThrow('Unauthorized')
  })
})

describe('usuarioService — actualizarUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('envía el payload correcto (UsuarioUpdateRequest)', async () => {
    const usuarioActualizado: UsuarioData = { ...usuarioDataMock, nombre: 'Juan 2' }
    const updateResponse = {
      usuario: usuarioActualizado,
    }

    mockedApiClient.put.mockResolvedValueOnce({ data: updateResponse } as any)

    const result = await usuarioService.actualizarUsuario(usuarioActualizado)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      '/usuarios/1',
      expect.objectContaining({
        nombre: 'Juan 2',
        desc: 'desc',
        email: 'juan@mail.com',
        celular: '123',
        ciudad: 'Rosario',
        tipoUsuario: 'Lector',
        imagenUrl: null,
      })
    )

    expect(result).toEqual(usuarioActualizado)
    expect(localStorage.getItem('nombreUsuario')).toBe('Juan 2')
  })

  it('propaga el error si axios falla', async () => {
    mockedApiClient.put.mockRejectedValueOnce(new Error('Forbidden'))

    await expect(
      usuarioService.actualizarUsuario(usuarioDataMock)
    ).rejects.toThrow('Forbidden')
  })

  it('normaliza imagenUrl a null y omite campos internos', async () => {
    mockedApiClient.put.mockResolvedValueOnce({ data: usuarioUpdateResponseMock } as any)
    const usuarioConCamposInternos = {
      ...usuarioDataMock,
      imagenUrl: undefined,
      errors: { email: 'duplicado' },
    } as unknown as UsuarioData & { errors: Record<string, string> }

    await usuarioService.actualizarUsuario(usuarioConCamposInternos)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      '/usuarios/1',
      expect.objectContaining({
        imagenUrl: null,
      })
    )
    expect(mockedApiClient.put.mock.calls[0][1]).not.toHaveProperty('errors')
  })
})
