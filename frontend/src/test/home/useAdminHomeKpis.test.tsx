import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adminService } from '../../services/adminService'
import { useAdminHomeKpis } from '../../hooks/useAdminHomeKpis'

vi.mock('../../services/adminService', () => ({
    adminService: {
        obtenerResumenKpisHome: vi.fn(),
    },
}))

const mockedAdminService = vi.mocked(adminService)

const adminKpiSummary = {
    conversionPromedio: 0.25,
    libroMasClickeado: { titulo: 'Rayuela', clicks: 20 },
    mejorTipoCalificado: {
        tipoLibro: 'Coleccionable',
        promedioCalificacion: 4.8,
    },
    tiposEvaluados: 2,
}

const createDeferred = <T,>() => {
    let resolve: (value: T) => void = () => undefined
    let reject: (reason?: unknown) => void = () => undefined
    const promise = new Promise<T>((promiseResolve, promiseReject) => {
        resolve = promiseResolve
        reject = promiseReject
    })

    return { promise, resolve, reject }
}

describe('useAdminHomeKpis', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('non-admin does not call service and leaves state neutral', async () => {
        const { result } = renderHook(() => useAdminHomeKpis({ esAdmin: false }))

        await act(async () => {
            await result.current.loadAdminKpis()
        })

        expect(mockedAdminService.obtenerResumenKpisHome).not.toHaveBeenCalled()
        expect(result.current.adminKpis).toBeNull()
        expect(result.current.loadingAdminKpis).toBe(false)
        expect(result.current.errorAdminKpis).toBe('')
    })

    it('admin success calls service and stores result', async () => {
        mockedAdminService.obtenerResumenKpisHome.mockResolvedValueOnce(adminKpiSummary)
        const { result } = renderHook(() => useAdminHomeKpis({ esAdmin: true }))

        await act(async () => {
            await result.current.loadAdminKpis()
        })

        expect(mockedAdminService.obtenerResumenKpisHome).toHaveBeenCalledTimes(1)
        expect(result.current.adminKpis).toEqual(adminKpiSummary)
        expect(result.current.loadingAdminKpis).toBe(false)
        expect(result.current.errorAdminKpis).toBe('')
    })

    it('admin failure stores user-facing error and loading false', async () => {
        const deferred = createDeferred<typeof adminKpiSummary>()
        mockedAdminService.obtenerResumenKpisHome.mockReturnValueOnce(deferred.promise)
        const { result } = renderHook(() => useAdminHomeKpis({ esAdmin: true }))

        act(() => {
            void result.current.loadAdminKpis()
        })

        expect(result.current.loadingAdminKpis).toBe(true)
        expect(result.current.errorAdminKpis).toBe('')

        await act(async () => {
            deferred.reject(new Error('Network Error'))
            await expect(deferred.promise).rejects.toThrow('Network Error')
        })

        expect(result.current.errorAdminKpis).toBe('No se pudieron cargar los KPIs')
        expect(result.current.loadingAdminKpis).toBe(false)
    })
})
