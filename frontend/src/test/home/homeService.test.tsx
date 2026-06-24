import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse } from 'axios'
import type { LibroHome } from '../../models/libroModel'

vi.mock('../../services/apiClient', () => ({
  apiClient: { get: vi.fn() },
}))
import { apiClient } from '../../services/apiClient'
const mockedApiClient = vi.mocked(apiClient, true)

import { homeService } from '../../services/homeService'
import { INITIAL_HOME_FILTERS } from '../../models/homeFilters'
import type { HomeFiltersState } from '../../models/homeFilters'

type SearchResponse = {
    content: LibroHome[]
    page: number
    totalPages: number
}

const libroHomeMock: LibroHome = {
    id: 1,
    imagenUrl: 'https://example.com/cover.jpg',
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

const responseMock = {
    data: {
        content: [libroHomeMock],
        page: 0,
        totalPages: 1,
    }
} as AxiosResponse<SearchResponse>

describe('HomeService - search', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('llama al endpoint correcto', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)

        expect(mockedApiClient.get).toHaveBeenCalledWith(
            '/libros/home',
            expect.any(Object)
        )
    })

    it('retorna el contenido de la respuesta correctamente', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        const result = await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)

        expect(result.content).toHaveLength(1)
        expect(result.content[0].titulo).toBe('Clean Code')
        expect(result.totalPages).toBe(1)
    })

    it('no incluye usuarioId en los params cuando es null', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params).not.toHaveProperty('usuarioId')
    })

    it('incluye usuarioId en los params cuando está presente', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, 42)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.usuarioId).toBe(42)
    })

    it('incluye sortBy en los params', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null, 'autor')

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.sortBy).toBe('autor')
    })

    it('usa titulo como sortBy por defecto', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.sortBy).toBe('titulo')
    })

    it('mapea los géneros seleccionados correctamente', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        const filtersConGenero: HomeFiltersState = {
            ...INITIAL_HOME_FILTERS,
            drama: true,
            romance: true,
        }

        await homeService.search('', filtersConGenero, 0, 6, null)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.generos).toContain('DRAMA')
        expect(params.generos).toContain('ROMANCE')
    })

    it('envía generos vacío cuando no hay géneros seleccionados', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.generos).toBe('')
    })

    it('no incluye paginasMin en params cuando no está definido', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        await homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.paginasMin).toBeUndefined()
    })

    it('incluye paginasMin y paginasMax cuando están definidos', async () => {
        mockedApiClient.get.mockResolvedValueOnce(responseMock)

        const filtersConPaginas: HomeFiltersState = {
            ...INITIAL_HOME_FILTERS,
            paginasMin: 100,
            paginasMax: 500,
        }

        await homeService.search('', filtersConPaginas, 0, 6, null)

        const params = mockedApiClient.get.mock.calls[0][1]?.params
        expect(params.paginasMin).toBe(100)
        expect(params.paginasMax).toBe(500)
    })

    it('lanza el error si axios falla', async () => {
        mockedApiClient.get.mockRejectedValueOnce(new Error('Network Error'))

        await expect(
            homeService.search('', INITIAL_HOME_FILTERS, 0, 6, null)
        ).rejects.toThrow('Network Error')
    })
})
