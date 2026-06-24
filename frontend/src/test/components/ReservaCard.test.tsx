import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReservaCard } from '../../components/detalleLibros/ReservaCard'
import { Libro } from '../../classes/Libro'
import { reservaService } from '../../services/reservaService'

vi.mock('../../services/reservaService')

describe('ReservaCard', () => {
  const mockLibro = new Libro({
    id: 1,
    titulo: 'Dune',
    reservas: []
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deshabilita el boton de confirmar si faltan fechas', () => {
    render(
      <ReservaCard
        libro={mockLibro}
        usuarioId={2}
        onReservaExitosa={vi.fn()}
        fechaDesde=""
        setFechaDesde={vi.fn()}
        fechaHasta=""
        setFechaHasta={vi.fn()}
      />
    )
    expect(screen.getByText('Confirmar Reserva ✓')).toBeDisabled()
  })

  it('llama al servicio al confirmar la reserva', async () => {
    vi.mocked(reservaService.crearReserva).mockResolvedValueOnce({})
    const mockOnSuccess = vi.fn()

    render(
      <ReservaCard
        libro={mockLibro}
        usuarioId={2}
        onReservaExitosa={mockOnSuccess}
        fechaDesde="2026-04-01"
        setFechaDesde={vi.fn()}
        fechaHasta="2026-04-10"
        setFechaHasta={vi.fn()}
      />
    )

    const boton = screen.getByText('Confirmar Reserva ✓')
    expect(boton).not.toBeDisabled()
    
    fireEvent.click(boton)

    expect(screen.getByText('Procesando...')).toBeInTheDocument()

    await waitFor(() => {
      expect(reservaService.crearReserva).toHaveBeenCalledWith({
        libroId: 1,
        usuarioId: 2,
        fechaDesde: '2026-04-01',
        fechaHasta: '2026-04-10'
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})