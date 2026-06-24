export type HomeGenreFilterKey =
    | 'cienciaFiccion'
    | 'drama'
    | 'autoayuda'
    | 'romance'
    | 'disenio'
    | 'literaturaClasica'

export type HomeFiltersState = Record<HomeGenreFilterKey, boolean> & {
    isbn?: string
    prestadoPor?: string
    paginasMin?: number
    paginasMax?: number
    fechaDesde?: string
    fechaHasta?: string
}

export const INITIAL_HOME_FILTERS: HomeFiltersState = {
    cienciaFiccion: false,
    drama: false,
    autoayuda: false,
    romance: false,
    disenio: false,
    literaturaClasica: false,
}

export const HOME_GENRES: { key: HomeGenreFilterKey; label: string; emoji: string }[] = [
    { key: 'cienciaFiccion', label: 'Ciencia Ficción', emoji: '🚀' },
    { key: 'drama', label: 'Drama', emoji: '🎭' },
    { key: 'autoayuda', label: 'Autoayuda', emoji: '✨' },
    { key: 'romance', label: 'Romance', emoji: '💫' },
    { key: 'disenio', label: 'Diseño', emoji: '🎨' },
    { key: 'literaturaClasica', label: 'Clásica', emoji: '📜' },
]

const HOME_GENRE_BACKEND_VALUES: Record<HomeGenreFilterKey, string> = {
    cienciaFiccion: 'CIENCIA_FICCION',
    drama: 'DRAMA',
    autoayuda: 'AUTOAYUDA',
    romance: 'ROMANCE',
    disenio: 'DISENO',
    literaturaClasica: 'LITERATURA_CLASICA',
}

export const buildSelectedGenreParam = (filters: HomeFiltersState): string =>
    HOME_GENRES
        .filter(({ key }) => filters[key])
        .map(({ key }) => HOME_GENRE_BACKEND_VALUES[key])
        .join(',')

export const hasActiveHomeFilters = (filters: HomeFiltersState): boolean =>
    Object.values(filters).some((value) => value !== false && value !== undefined && value !== '' && value !== 0)

export const normalizeNumberFilter = (value: string): number | undefined => {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}
