import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Paginacion } from '../../components/ui/Paginacion'

describe('Paginacion', () => {
  it('no renderiza nada si hay 1 sola pagina', () => {
    const { container } = render(
      <Paginacion pagina={1} totalPaginas={1} alCambiar={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza los botones correctos segun el total de paginas', () => {
    render(<Paginacion pagina={2} totalPaginas={3} alCambiar={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('llama a alCambiar al hacer click en un numero de pagina', () => {
    const mockAlCambiar = vi.fn()
    render(<Paginacion pagina={1} totalPaginas={3} alCambiar={mockAlCambiar} />)

    fireEvent.click(screen.getByText('2'))
    expect(mockAlCambiar).toHaveBeenCalledWith(2)
  })

  it('deshabilita el boton anterior en la primera pagina', () => {
    render(<Paginacion pagina={1} totalPaginas={3} alCambiar={vi.fn()} />)
    const botones = screen.getAllByRole('button')
    expect(botones[0]).toBeDisabled()
  })

  it('deshabilita el boton siguiente en la ultima pagina', () => {
    render(<Paginacion pagina={3} totalPaginas={3} alCambiar={vi.fn()} />)
    const botones = screen.getAllByRole('button')
    expect(botones[botones.length - 1]).toBeDisabled()
  })
})