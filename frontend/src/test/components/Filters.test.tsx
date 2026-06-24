import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { Filters } from '../../components/home/Filters'
import {
  INITIAL_HOME_FILTERS,
  type HomeFiltersState,
} from '../../models/homeFilters'

type TestFiltersProps = {
  initialFilters?: HomeFiltersState
  onApplyFilters?: (filters: HomeFiltersState) => void
}

const TestFilters = ({
  initialFilters = INITIAL_HOME_FILTERS,
  onApplyFilters = vi.fn(),
}: TestFiltersProps) => {
  const [filters, setFilters] = useState(initialFilters)

  return (
    <Filters
      filters={filters}
      onChangeFilters={setFilters}
      onApplyFilters={onApplyFilters}
    />
  )
}

describe('Filters', () => {
  it('renderiza las opciones de genero', () => {
    render(
      <Filters
        filters={INITIAL_HOME_FILTERS}
        onChangeFilters={vi.fn()}
        onApplyFilters={vi.fn()}
      />
    )
    expect(screen.getByText('Ciencia Ficción')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })
  it('muestra error de validacion si paginasMin es mayor a paginasMax', () => {
    const mockApply = vi.fn()
    render(<TestFilters onApplyFilters={mockApply} />)

    const minInput = screen.getByPlaceholderText('Min')
    const maxInput = screen.getByPlaceholderText('Max')

    fireEvent.change(minInput, { target: { value: '500' } })
    fireEvent.change(maxInput, { target: { value: '100' } })

    fireEvent.click(screen.getByText('Aplicar filtros'))

    expect(screen.getByText('El mínimo debe ser menor al máximo')).toBeInTheDocument()
    expect(mockApply).not.toHaveBeenCalled()
  })
  it('llama a onApplyFilters con los datos actualizados cuando no hay errores', () => {
    const mockApply = vi.fn()
    render(<TestFilters onApplyFilters={mockApply} />)

    // Simulamos un click en la etiqueta de Drama
    const dramaButton = screen.getByText('Drama')
    fireEvent.click(dramaButton)

    fireEvent.click(screen.getByText('Aplicar filtros'))

    expect(mockApply).toHaveBeenCalledWith(expect.objectContaining({
      drama: true,
      cienciaFiccion: false
    }))
  })
  it('refleja el reset controlado al recibir filtros iniciales', () => {
    const activeFilters = {
      ...INITIAL_HOME_FILTERS,
      drama: true,
      isbn: '978-0132350884',
    }
    const { rerender } = render(
      <Filters
        filters={activeFilters}
        onChangeFilters={vi.fn()}
        onApplyFilters={vi.fn()}
      />
    )

    expect(screen.getByPlaceholderText('ISBN')).toHaveValue('978-0132350884')
    expect(screen.getByRole('button', { name: /Drama/ })).toHaveClass('bg-primary/15')

    rerender(
      <Filters
        filters={INITIAL_HOME_FILTERS}
        onChangeFilters={vi.fn()}
        onApplyFilters={vi.fn()}
      />
    )

    expect(screen.getByPlaceholderText('ISBN')).toHaveValue('')
    expect(screen.getByRole('button', { name: /Drama/ })).not.toHaveClass('bg-primary/15')
  })
})
