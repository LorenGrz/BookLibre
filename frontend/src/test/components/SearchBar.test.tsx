import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../../components/ui/SearchBar'

describe('SearchBar', () => {
  it('renderiza correctamente con su placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Buscar libro..." />)
    expect(screen.getByPlaceholderText('Buscar libro...')).toBeInTheDocument()
  })
  it('llama a onSearch al hacer click en el boton Buscar', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} placeholder="Buscar..." />)
    
    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(input, { target: { value: 'Orwell' } })
    
    const boton = screen.getByText('Buscar')
    fireEvent.click(boton)

    expect(mockOnSearch).toHaveBeenCalledWith('Orwell')
  })
  it('llama a onSearch al presionar la tecla Enter', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} placeholder="Buscar..." />)
    
    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(input, { target: { value: 'Dune' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(mockOnSearch).toHaveBeenCalledWith('Dune')
  })
})