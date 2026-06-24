import { describe, expect, it } from 'vitest'

import {
    HOME_GENRES,
    INITIAL_HOME_FILTERS,
    buildSelectedGenreParam,
    hasActiveHomeFilters,
    normalizeNumberFilter,
} from '../../models/homeFilters'

describe('homeFilters', () => {
    it('treats initial filters as inactive', () => {
        expect(hasActiveHomeFilters(INITIAL_HOME_FILTERS)).toBe(false)
    })

    it('treats a boolean filter as active', () => {
        expect(hasActiveHomeFilters({ ...INITIAL_HOME_FILTERS, drama: true })).toBe(true)
    })

    it('treats a text filter as active', () => {
        expect(hasActiveHomeFilters({ ...INITIAL_HOME_FILTERS, isbn: '978-0132350884' })).toBe(true)
    })

    it('ignores empty strings and 0 values', () => {
        expect(hasActiveHomeFilters({
            ...INITIAL_HOME_FILTERS,
            isbn: '',
            prestadoPor: '',
            paginasMin: 0,
            paginasMax: 0,
            fechaDesde: '',
            fechaHasta: '',
        })).toBe(false)
    })

    it('maps selected genres to backend format', () => {
        const selected = {
            ...INITIAL_HOME_FILTERS,
            cienciaFiccion: true,
            romance: true,
        }

        expect(buildSelectedGenreParam(selected)).toBe('CIENCIA_FICCION,ROMANCE')
    })

    it('preserves labels and emojis for home genres', () => {
        expect(HOME_GENRES).toEqual([
            { key: 'cienciaFiccion', label: 'Ciencia Ficción', emoji: '🚀' },
            { key: 'drama', label: 'Drama', emoji: '🎭' },
            { key: 'autoayuda', label: 'Autoayuda', emoji: '✨' },
            { key: 'romance', label: 'Romance', emoji: '💫' },
            { key: 'disenio', label: 'Diseño', emoji: '🎨' },
            { key: 'literaturaClasica', label: 'Clásica', emoji: '📜' },
        ])
    })

    it.each([
        ['', undefined],
        ['abc', undefined],
        ['0', undefined],
        ['25', 25],
    ])('normalizes %s to %s', (value, expected) => {
        expect(normalizeNumberFilter(value)).toBe(expected)
    })
})
