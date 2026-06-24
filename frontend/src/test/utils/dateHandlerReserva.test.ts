import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { calcularDiferenciaDias, obtenerFechaHoy, formatearFechaVisual } from '../../utils/dateHandlerReserva'

describe('dateHandlerReserva', () => {
  describe('calcularDiferenciaDias', () => {
    it('calcula la diferencia correcta entre dos fechas', () => {
      expect(calcularDiferenciaDias('2026-03-01', '2026-03-10')).toBe(10)
    })
    it('retorna 0 si falta alguna fecha', () => {
      expect(calcularDiferenciaDias('', '2026-03-10')).toBe(0)
      expect(calcularDiferenciaDias('2026-03-01', '')).toBe(0)
    })
    it('retorna 0 si la fecha hasta es anterior a la fecha desde', () => {
      expect(calcularDiferenciaDias('2026-03-10', '2026-03-01')).toBe(0)
    })
  })
  describe('obtenerFechaHoy', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-03-26T15:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })
    it('devuelve la fecha de hoy en formato YYYY-MM-DD ajustada al timezone local', () => {
      const hoy = obtenerFechaHoy()
      expect(typeof hoy).toBe('string')
      expect(hoy.length).toBe(10)
    })
  })
  describe('formatearFechaVisual', () => {
    it('formatea la fecha a string legible', () => {
      const resultado = formatearFechaVisual('2026-03-26')
      expect(resultado).toContain('26')
      expect(resultado).toContain('mar')
      expect(resultado).toContain('2026')
    })

    it('retorna un guion si la fecha esta vacia', () => {
      expect(formatearFechaVisual('')).toBe('-')
    })
  })
})