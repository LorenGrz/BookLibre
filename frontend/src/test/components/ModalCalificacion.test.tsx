import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModalCalificacion } from '../../components/libros/ModalCalificacion'

describe('ModalCalificacion', () => {
  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(
      <ModalCalificacion isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} tituloLibro="1984" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('el boton enviar esta deshabilitado al inicio (rating 0)', () => {
    render(<ModalCalificacion isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} tituloLibro="1984" />)
    expect(screen.getByText('Enviar Calificación')).toBeDisabled()
  })

  it('habilita el boton al seleccionar una estrella y llama onSubmit al clickear', () => {
    const mockSubmit = vi.fn()
    render(<ModalCalificacion isOpen={true} onClose={vi.fn()} onSubmit={mockSubmit} tituloLibro="1984" />)

    const stars = screen.getAllByText('★')
    fireEvent.click(stars[4]) // Click en la quinta estrella (5 estrellas)

    const btn = screen.getByText('Enviar Calificación')
    expect(btn).not.toBeDisabled()

    const textarea = screen.getByPlaceholderText('Cuéntanos qué te pareció el libro...')
    fireEvent.change(textarea, { target: { value: 'Obra maestra' } })

    fireEvent.click(btn)
    expect(mockSubmit).toHaveBeenCalledWith(5, 'Obra maestra')
  })
})