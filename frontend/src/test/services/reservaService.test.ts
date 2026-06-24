import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reservaService } from '../../services/reservaService'

vi.mock('../../services/apiClient', () => ({
  apiClient: { post: vi.fn() },
}))
import { apiClient } from '../../services/apiClient'
const mockedApiClient = vi.mocked(apiClient, true)

describe('reservaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('llama al endpoint de reservas con el DTO correcto', async () => {
    const dtoMock = {
      libroId: 1,
      usuarioId: 2,
      fechaDesde: '2026-04-01',
      fechaHasta: '2026-04-10'
    }
    
    mockedApiClient.post.mockResolvedValueOnce({ data: { success: true } } as any)

    await reservaService.crearReserva(dtoMock)

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/reservas/crear',
      {
        ...dtoMock,
        fechaDesde: "2026-04-01T00:00:00",
        fechaHasta: "2026-04-10T00:00:00",
      }
    )
  })
  it('propaga el error si axios falla', async () => {
    mockedApiClient.post.mockRejectedValueOnce(new Error('Conflicto de reserva'))

    await expect(
      reservaService.crearReserva({ libroId: 1, usuarioId: 2, fechaDesde: '', fechaHasta: '' })
    ).rejects.toThrow('Conflicto de reserva')
  })
})