import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { GestionMisLibros } from '../../components/perfil/GestionMisLibros'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import { POR_PAGINA_MIS_LIBROS } from '../../utils/misLibros/gestionMisLibros'

const TOTAL_LIBROS = POR_PAGINA_MIS_LIBROS + 1

const librosMock: LibroUsuarioItemDTO[] = Array.from({ length: TOTAL_LIBROS }, (_, i) => ({
  id: i + 1,
  titulo: `Libro ${i + 1}`,
  autor: `Autor ${i + 1}`,
  genero: 'DRAMA',
  disponible: i !== TOTAL_LIBROS - 1,
  fechaAgregado: `2024-03-${String(i + 1).padStart(2, '0')}`,
}))

const renderGestion = () =>
  render(
    <MemoryRouter>
      <GestionMisLibros libros={librosMock} onAgregar={vi.fn()} onEliminar={vi.fn()} />
    </MemoryRouter>
  )

describe('GestionMisLibros', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('aplica delay de 150ms al cambiar tab', () => {
    renderGestion()

    expect(screen.getByText((txt) => txt.includes(`de ${TOTAL_LIBROS} libros`))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Prestados' }))

    expect(screen.getByText((txt) => txt.includes(`de ${TOTAL_LIBROS} libros`))).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText((txt) => txt.includes('de 1 libros'))).toBeInTheDocument()
  }, 10000)

  it('aplica delay de 150ms al cambiar página', () => {
    renderGestion()

    expect(screen.getByText((txt) => txt.includes(`de ${TOTAL_LIBROS} libros`))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '2' }))

    expect(screen.getByText((txt) => txt.includes(`de ${TOTAL_LIBROS} libros`))).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText((txt) => txt.includes(`${TOTAL_LIBROS}–${TOTAL_LIBROS}`))).toBeInTheDocument()
  }, 10000)
})
