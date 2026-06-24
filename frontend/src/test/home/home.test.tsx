import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from '../../pages/Home'
import { homeService } from '../../services/homeService'
import { authService } from '../../services/AuthService'
import { adminService } from '../../services/adminService'

vi.mock('../../services/homeService', () => ({
    homeService: {
        search: vi.fn(),
        getPopulares: vi.fn(),
    }
}))

vi.mock('../../services/AuthService', () => ({
    authService: {
        obtenerIdUsuarioActual: vi.fn(),
        obtenerTipoUsuarioActual: vi.fn(),
    }
}))

vi.mock('../../services/adminService', () => ({
    adminService: {
        obtenerResumenKpisHome: vi.fn(),
    }
}))

const mockedHomeService = vi.mocked(homeService)
const mockedAuthService = vi.mocked(authService)
const mockedAdminService = vi.mocked(adminService)

const librosMock = [
    {
        id: 1,
        imagenUrl: '',
        genero: 'DRAMA' as const,
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        calificacion: 4.5,
        isbn: '978-0132350884',
        idioma: 'ESPANOL' as const,
        tipo: 'Comun' as const,
        bibliokarma: 150,
        estado: 'EXCELENTE' as const,
        duenio: 'Ana García',
    }
]

const responseMock = (libros = librosMock, totalPages = 1) => ({
    content: libros,
    page: 0,
    totalPages,
})

const emptyAdminKpiSummary = {
    conversionPromedio: 0,
    libroMasClickeado: null,
    mejorTipoCalificado: null,
    tiposEvaluados: 0,
}

const renderHome = () =>
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    )

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAuthService.obtenerIdUsuarioActual.mockReturnValue(null)
        mockedAuthService.obtenerTipoUsuarioActual.mockReturnValue('Lector')
        mockedAdminService.obtenerResumenKpisHome.mockResolvedValue(emptyAdminKpiSummary)
        vi.useFakeTimers()
    })

    afterEach(async () => {
        await act(async () => {
            vi.runAllTimers()
        })
        vi.useRealTimers()
    })

    it('muestra el spinner mientras carga', () => {
        mockedHomeService.getPopulares.mockReturnValue(new Promise(() => {}))
        renderHome()
        expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })

    it('muestra los libros cuando la respuesta es exitosa', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('libros-grid')).toBeInTheDocument()
        expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })

    it('muestra el estado vacío cuando no hay libros', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock([]))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('muestra el ErrorCard cuando el service falla', async () => {
        mockedHomeService.getPopulares.mockRejectedValueOnce(new Error('Network Error'))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('error-card')).toBeInTheDocument()
    })

    it('llama al service de populares al montar el componente', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedHomeService.getPopulares).toHaveBeenCalledTimes(1)
    })

    it('muestra el cartel de libros populares y oculta el paginado en la carga inicial', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock(librosMock, 3))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByText('Libros más populares')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Ver más' })).toBeInTheDocument()
        expect(screen.queryByText(/Pág\./)).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument()
    })

    it('al hacer click en Ver más carga el catálogo desde Mongo y habilita el paginado', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock(librosMock, 3))
        mockedHomeService.search.mockResolvedValueOnce(responseMock(librosMock, 3))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        fireEvent.click(screen.getByRole('button', { name: 'Ver más' }))

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            '', expect.anything(), 0, 10, null, 'titulo'
        )
        expect(screen.queryByText('Libros más populares')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Ver más' })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Ver populares' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Clean Code/ })).not.toHaveClass('border-primary/60')
        expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    })

    it('al hacer click en Ver populares vuelve al ranking y oculta el paginado', async () => {
        mockedHomeService.getPopulares
            .mockResolvedValueOnce(responseMock(librosMock, 3))
            .mockResolvedValueOnce(responseMock(librosMock, 1))
        mockedHomeService.search.mockResolvedValueOnce(responseMock(librosMock, 3))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        fireEvent.click(screen.getByRole('button', { name: 'Ver más' }))

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        fireEvent.click(screen.getByRole('button', { name: 'Ver populares' }))

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedHomeService.getPopulares).toHaveBeenCalledTimes(2)
        expect(screen.getByText('Libros más populares')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Ver más' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Ver populares' })).not.toBeInTheDocument()
        expect(screen.queryByText(/Pág\./)).not.toBeInTheDocument()
    })

    it('diferencia los libros populares con borde dorado', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock(librosMock, 3))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByRole('link', { name: /Clean Code/ })).toHaveClass('border-2', 'border-primary/80')
    })

    it('no carga ni muestra KPIs de admin para usuarios no administradores', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedAdminService.obtenerResumenKpisHome).not.toHaveBeenCalled()
        expect(screen.queryByTestId('admin-kpi-header')).not.toBeInTheDocument()
    })

    it('carga y muestra los KPIs de admin para usuarios administradores', async () => {
        mockedAuthService.obtenerTipoUsuarioActual.mockReturnValue('ADMIN')
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        mockedAdminService.obtenerResumenKpisHome.mockResolvedValueOnce({
            conversionPromedio: 0.25,
            libroMasClickeado: { titulo: 'Rayuela', clicks: 20 },
            mejorTipoCalificado: {
                tipoLibro: 'Coleccionable',
                promedioCalificacion: 4.8,
            },
            tiposEvaluados: 2,
        })

        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedAdminService.obtenerResumenKpisHome).toHaveBeenCalledTimes(1)
        expect(screen.getByTestId('admin-kpi-header')).toBeInTheDocument()
        expect(screen.getByText('25.0%')).toBeInTheDocument()
        expect(screen.getByText('Rayuela')).toBeInTheDocument()
        expect(screen.getByText('Coleccionable')).toBeInTheDocument()
    })

    it('llama al service de search con el nuevo sort al cambiar el SortBy', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        mockedHomeService.search.mockResolvedValueOnce(responseMock())

        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('sort-select')).toBeInTheDocument()

        fireEvent.change(screen.getByTestId('sort-select'), {
            target: { value: 'autor' }
        })

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedHomeService.search).toHaveBeenCalledTimes(1)
        expect(mockedHomeService.search).toHaveBeenLastCalledWith(
            '', expect.anything(), 0, 10, null, 'autor'
        )
    })
})
