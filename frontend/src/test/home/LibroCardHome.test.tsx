import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LibroCardHome } from '../../components/home/LibroCardHome'
import type { EstadoLibro, LibroHome } from '../../models/libroModel'

const libroBase: LibroHome = {
    id: 1,
    imagenUrl: '',
    genero: 'DRAMA',
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    calificacion: 4.5,
    isbn: '978-0132350884',
    idioma: 'ESPANOL',
    tipo: 'Comun',
    bibliokarma: 150,
    estado: 'EXCELENTE',
    duenio: 'ana',
}

const renderLibroCard = (estado: EstadoLibro) => render(
    <MemoryRouter>
        <LibroCardHome {...libroBase} estado={estado} />
    </MemoryRouter>
)

describe('LibroCardHome', () => {
    it.each([
        ['EXCELENTE', 'Excelente', 'text-success'],
        ['REGULAR', 'Regular', 'text-warning'],
        ['MALO', 'Malo', 'text-danger'],
    ] as const)('muestra el estado %s con su color correspondiente', (estado, label, className) => {
        renderLibroCard(estado)

        expect(screen.getByText(label)).toHaveClass(className)
    })
})
