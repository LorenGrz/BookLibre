import type { LibroHome } from '../models/libroModel'
import { INITIAL_HOME_FILTERS, buildSelectedGenreParam, type HomeFiltersState } from '../models/homeFilters'
import { apiClient } from './apiClient'

interface SearchResponse {
    content: LibroHome[]
    page: number
    totalPages: number
}

class HomeService {
    async search(
        query: string = '',
        filters: HomeFiltersState = INITIAL_HOME_FILTERS,
        page: number = 0,
        size: number = 6,
        usuarioId: number | null,
        sortBy: string = 'titulo'
    ): Promise<SearchResponse> {
        const generos = buildSelectedGenreParam(filters)

        const response = await apiClient.get<SearchResponse>(`/libros/home`, {
            params: {
                query, generos, page, size, 
                ...(usuarioId !== null && {usuarioId}),
                paginasMin: filters.paginasMin || undefined,
                paginasMax: filters.paginasMax || undefined,
                fechaDesde: filters.fechaDesde || undefined,
                fechaHasta: filters.fechaHasta || undefined,
                isbn: filters.isbn || undefined,
                prestadoPor: filters.prestadoPor || undefined,
                sortBy
            }
        })
        return response.data
    }

    async getPopulares(usuarioId: number | null): Promise<SearchResponse> {
        const response = await apiClient.get<SearchResponse>(`/libros/populares`, {
            params: {
                ...(usuarioId !== null && {usuarioId})
            }
        })
        return response.data
    }
}

export const homeService = new HomeService()
