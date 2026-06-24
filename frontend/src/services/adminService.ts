import type { AdminKpiResumenResponse, CantidadColeccionablesResponse, FeedActividadResponse, PromedioCalificacionPorTipoResponse, SaludCatalogoResponse, TasaConversionLibroResponse } from "../models/libroModel"
import type { ReservaAnualUsuarioResponse, UsuarioReservasDevueltasResponse, TopUsuariosResponse } from "../models/usuarioModel"
import { apiClient } from "./apiClient"

export const adminService = {
    async obtenerUsuariosConMasDe2Devoluciones(): Promise<UsuarioReservasDevueltasResponse[]> {
        const res = await apiClient.get(
            `/reservas/usuarios-con-devoluciones`
        )
        return res.data
    },

    async obtenerUsuariosConMasDeNReservas(minReservas: number): Promise<UsuarioReservasDevueltasResponse[]> {
        const res = await apiClient.get(
            `/reservas/usuarios-con-mas-de-n-reservas`, { params: { minReservas }, }
        )
        return res.data
    },

    async obtenerReservasAnualesUsuario(id: number): Promise<ReservaAnualUsuarioResponse[]> {
        const res = await apiClient.get<ReservaAnualUsuarioResponse[]>(
            `/usuarios/${id}/reservas/anuales`
        )

        return res.data
    },

    async obtenerLibrosConReservasCumplidas(): Promise<any[]> {
        const res = await apiClient.get(
            `/libros/reservas-cumplidas`
        )
        return res.data
    },

    async obtenerLibrosColeccionables(): Promise<CantidadColeccionablesResponse> {
        const res = await apiClient.get(
            `/libros/coleccionables/count`
        )
        return res.data
    },

    async obtenerLibrosMejorCalificados(): Promise<any[]> {
        const res = await apiClient.get(
            `/libros/mejor-calificados`
        )
        return res.data
    },

    async obtenerLibrosConReservasActivas(minReservas: number = 3): Promise<any[]> {
        const res = await apiClient.get(
            `/libros/reservas-activas`, { params: { minReservas } }
        )
        return res.data
    },

    async obtenerTasaConversion(): Promise<TasaConversionLibroResponse[]> {
        const query = `
            query {
                tasaConversion {
                    libroId
                    titulo
                    clicks
                    reservas
                    tasaConversion
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        return res.data.data.tasaConversion
    },

    async obtenerAnalisisCalificaciones(): Promise<PromedioCalificacionPorTipoResponse[]> {
        const query = `
            query {
                analisisCalificaciones {
                    tipoLibro
                    promedioCalificacion
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        return res.data.data.analisisCalificaciones
    },

    async obtenerSaludCatalogo(): Promise<SaludCatalogoResponse> {
        const query = `
            query {
                saludCatalogo {
                    total
                    prestados
                    disponiblesNuncaReservados
                    disponiblesReservadosAFuturo
                    disponiblesDevueltos
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        return res.data.data.saludCatalogo
    },

    async obtenerResumenKpisHome(): Promise<AdminKpiResumenResponse> {
        const query = `
            query {
                tasaConversion {
                    libroId
                    titulo
                    clicks
                    reservas
                    tasaConversion
                }
                analisisCalificaciones {
                    tipoLibro
                    promedioCalificacion
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        const tasaConversion = res.data.data.tasaConversion as TasaConversionLibroResponse[]
        const analisisCalificaciones = res.data.data.analisisCalificaciones as PromedioCalificacionPorTipoResponse[]

        const conversionPromedio = tasaConversion.length > 0
            ? tasaConversion.reduce((total, libro) => total + libro.tasaConversion, 0) / tasaConversion.length
            : 0
        const libroMasClickeado = tasaConversion.length > 0
            ? {
                titulo: tasaConversion[0].titulo,
                clicks: tasaConversion[0].clicks,
            }
            : null
        const mejorTipoCalificado = analisisCalificaciones.length > 0
            ? analisisCalificaciones.reduce((mejor, tipo) =>
                tipo.promedioCalificacion > mejor.promedioCalificacion ? tipo : mejor
            )
            : null

        return {
            conversionPromedio,
            libroMasClickeado,
            mejorTipoCalificado,
            tiposEvaluados: analisisCalificaciones.length,
        }
    },

    async obtenerTopUsuarios(): Promise<TopUsuariosResponse[]> {
        const query = `
        query {
            topBibliokarmas {
                id
                nombre
                bibliokarma
            }
        }
    `
        const res = await apiClient.post('/graphql', { query })
        return res.data.data.topBibliokarmas
    },

    async obtenerFeedActividad(): Promise<FeedActividadResponse[]> {
        const query = `
            query {
                feedActividad {
                    __typename
                    fecha
                    tipoEvento
                    ... on LibroAgregado {
                        libroId
                        titulo
                        autor
                        duenioNombre
                    }
                    ... on ReservaConfirmada {
                        reservaId
                        libroId
                        libroTitulo
                        usuarioId
                        usuarioNombre
                    }
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        return res.data.data.feedActividad
    },
}
