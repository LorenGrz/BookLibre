import { adminService } from "../services/adminService"
import { ConsultaCard } from "../components/ui/ConsultaCard"
import { LibroAgregadoItem, ReservaConfirmadaItem } from "../components/ui/FeedActividadItem"
import type { UsuarioReservasDevueltasResponse, ReservaAnualUsuarioResponse, TopUsuariosResponse } from "../models/usuarioModel"
import { TIPO_LABEL, type CantidadColeccionablesResponse, type PromedioCalificacionPorTipoResponse, type SaludCatalogoResponse, type TasaConversionLibroResponse, type FeedActividadResponse, type LibroAgregadoResponse, type ReservaConfirmadaResponse } from "../models/libroModel"
import { useState, type ReactNode } from "react"

// Mapa de renderizado a nivel de módulo: no se recrea en cada render
const EVENTO_RENDERERS: Record<string, (item: FeedActividadResponse) => ReactNode> = {
    LIBRO_AGREGADO:     (item) => <LibroAgregadoItem     item={item as LibroAgregadoResponse} />,
    RESERVA_CONFIRMADA: (item) => <ReservaConfirmadaItem item={item as ReservaConfirmadaResponse} />,
}

export const ConsultasAdmin = () => {
    const [usuariosConDevoluciones, setUsuariosConDevoluciones] = useState<UsuarioReservasDevueltasResponse[]>([])
    const [loadingDevoluciones, setLoadingDevoluciones] = useState(false)
    const [errorDevoluciones, setErrorDevoluciones] = useState("")
    //
    const [usuariosConReservas, setUsuariosConReservas] = useState<UsuarioReservasDevueltasResponse[]>([])
    const [cantidadReservas, setCantidadReservas] = useState(3)
    const [loadingReservas, setLoadingReservas] = useState(false)
    const [errorReservas, setErrorReservas] = useState("")
    //
    const [usuarioId, setUsuarioId] = useState(1)
    const [reservasAnuales, setReservasAnuales] = useState<ReservaAnualUsuarioResponse[]>([])
    const [loadingAnuales, setLoadingAnuales] = useState(false)
    const [errorAnuales, setErrorAnuales] = useState("")
    //
    const [loadingColeccionables, setLoadingColeccionables] = useState(false)
    const [errorColeccionables, setErrorColeccionables] = useState("")
    const [cantidadColeccionables, setCantidadColeccionables] = useState<CantidadColeccionablesResponse | null>(null)
    //
    const [librosCumplidas, setLibrosCumplidas] = useState<any[]>([])
    const [loadingCumplidas, setLoadingCumplidas] = useState(false)
    const [errorCumplidas, setErrorCumplidas] = useState("")
    //
    const [librosMejores, setLibrosMejores] = useState<any[]>([])
    const [loadingMejores, setLoadingMejores] = useState(false)
    const [errorMejores, setErrorMejores] = useState("")
    //
    const [librosReservasActivas, setLibrosReservasActivas] = useState<any[]>([])
    const [loadingReservasActivas, setLoadingReservasActivas] = useState(false)
    const [errorReservasActivas, setErrorReservasActivas] = useState("")
    //
    const [tasaConversion, setTasaConversion] = useState<TasaConversionLibroResponse[]>([])
    const [loadingTasaConversion, setLoadingTasaConversion] = useState(false)
    const [errorTasaConversion, setErrorTasaConversion] = useState("")
    //
    const [analisisCalificaciones, setAnalisisCalificaciones] = useState<PromedioCalificacionPorTipoResponse[]>([])
    const [loadingAnalisisCalificaciones, setLoadingAnalisisCalificaciones] = useState(false)
    const [errorAnalisisCalificaciones, setErrorAnalisisCalificaciones] = useState("")
    //
    const [saludCatalogo, setSaludCatalogo] = useState<SaludCatalogoResponse | null>(null)
    const [loadingSaludCatalogo, setLoadingSaludCatalogo] = useState(false)
    const [errorSaludCatalogo, setErrorSaludCatalogo] = useState("")
    //
    const [topUsuarios, setTopUsuarios] = useState<TopUsuariosResponse[]>([])
    const [loadingTopUsuarios, setLoadingTopUsuarios] = useState(false)
    const [errorTopUsuarios, setErrorTopUsuarios] = useState("")
    //
    const [feedActividad, setFeedActividad] = useState<FeedActividadResponse[]>([])
    const [loadingFeedActividad, setLoadingFeedActividad] = useState(false)
    const [errorFeedActividad, setErrorFeedActividad] = useState("")

    const consultarUsuariosConDevoluciones = async () => {
        try {
            setLoadingDevoluciones(true)
            setErrorDevoluciones("")

            const data =
                await adminService.obtenerUsuariosConMasDe2Devoluciones()
            setUsuariosConDevoluciones(data)

        } catch {
            setErrorDevoluciones(
                "No se pudo realizar la consulta"
            )
        } finally {
            setLoadingDevoluciones(false)
        }
    }

    const consultarUsuariosConMasReservas = async () => {
        try {
            setLoadingReservas(true)
            setErrorReservas("")

            const data =
                await adminService.obtenerUsuariosConMasDeNReservas(
                    cantidadReservas
                )
            setUsuariosConReservas(data)

        } catch {
            setErrorReservas(
                "No se pudo realizar la consulta"
            )
        } finally {
            setLoadingReservas(false)
        }
    }

    const consultarReservasAnuales = async () => {
        try {
            setLoadingAnuales(true)
            setErrorAnuales("")

            const data =
                await adminService.obtenerReservasAnualesUsuario(usuarioId)
            setReservasAnuales(data)

        } catch {
            setErrorAnuales(
                "No se pudo realizar la consulta"
            )
        } finally {
            setLoadingAnuales(false)
        }
    }

    const consultarLibrosColeccionables = async () => {
        try {
            setLoadingColeccionables(true)
            setErrorColeccionables("")

            const data = await adminService.obtenerLibrosColeccionables()

            setCantidadColeccionables(data)
        } catch {
            setErrorColeccionables("No se pudo realizar la consulta")
        } finally {
            setLoadingColeccionables(false)
        }
    }

    const consultarLibrosCumplidas = async () => {
        try {
            setLoadingCumplidas(true)
            setErrorCumplidas("")

            const data = await adminService.obtenerLibrosConReservasCumplidas()
            setLibrosCumplidas(data)
        } catch {
            setErrorCumplidas("No se pudo realizar la consulta")
        } finally {
            setLoadingCumplidas(false)
        }
    }

    const consultarLibrosMejores = async () => {
        try {
            setLoadingMejores(true)
            setErrorMejores("")

            const data = await adminService.obtenerLibrosMejorCalificados()
            setLibrosMejores(data)
        } catch {
            setErrorMejores("No se pudo realizar la consulta")
        } finally {
            setLoadingMejores(false)
        }
    }

    const consultarLibrosReservasActivas = async () => {
        try {
            setLoadingReservasActivas(true)
            setErrorReservasActivas("")

            const data = await adminService.obtenerLibrosConReservasActivas(3)
            setLibrosReservasActivas(data)
        } catch {
            setErrorReservasActivas("No se pudo realizar la consulta")
        } finally {
            setLoadingReservasActivas(false)
        }
    }

    const consultarTasaConversion = async () => {
        try {
            setLoadingTasaConversion(true)
            setErrorTasaConversion("")

            const data = await adminService.obtenerTasaConversion()
            setTasaConversion(data)
        } catch {
            setErrorTasaConversion("No se pudo realizar la consulta")
        } finally {
            setLoadingTasaConversion(false)
        }
    }

    const consultarAnalisisCalificaciones = async () => {
        try {
            setLoadingAnalisisCalificaciones(true)
            setErrorAnalisisCalificaciones("")

            const data = await adminService.obtenerAnalisisCalificaciones()
            setAnalisisCalificaciones(data)
        } catch {
            setErrorAnalisisCalificaciones("No se pudo realizar la consulta")
        } finally {
            setLoadingAnalisisCalificaciones(false)
        }
    }

    const consultarSaludCatalogo = async () => {
        try {
            setLoadingSaludCatalogo(true)
            setErrorSaludCatalogo("")

            const data = await adminService.obtenerSaludCatalogo()
            setSaludCatalogo(data)
        } catch {
            setErrorSaludCatalogo("No se pudo realizar la consulta")
        } finally {
            setLoadingSaludCatalogo(false)
        }
    }

    const consultarTopUsuarios = async () => {
        try {
            setLoadingTopUsuarios(true)
            setErrorTopUsuarios("")

            const data = await adminService.obtenerTopUsuarios()
            setTopUsuarios(data)
        } catch {
            setErrorTopUsuarios("No se pudo realizar la consulta")
        } finally {
            setLoadingTopUsuarios(false)
        }
    }

    const consultarFeedActividad = async () => {
        try {
            setLoadingFeedActividad(true)
            setErrorFeedActividad("")
            const data = await adminService.obtenerFeedActividad()
            setFeedActividad(data)
        } catch {
            setErrorFeedActividad("No se pudo realizar la consulta")
        } finally {
            setLoadingFeedActividad(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pt-20 animate-in fade-in duration-300 pt-25 pb-15">
            <ConsultaCard
                titulo="Usuarios con más de 2 reservas hechas"
                descripcion=""

                loading={loadingDevoluciones}
                error={errorDevoluciones}

                onConsultar={consultarUsuariosConDevoluciones}

                resultados={usuariosConDevoluciones}

                renderResultado={(usuario) => (
                    <div className="flex justify-between items-center">
                        <span className="font-medium">
                            {usuario.usuarioNombre}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            {usuario.cantidadReservas} devoluciones
                        </span>
                    </div>
                )}
            />
            <ConsultaCard
                titulo="Usuarios con más de N reservas hechas"
                descripcion="Búsqueda bajo parámetro."

                loading={loadingReservas}
                error={errorReservas}

                onConsultar={consultarUsuariosConMasReservas}

                resultados={usuariosConReservas}

                renderResultado={(usuario) => (
                    <div className="flex justify-between items-center">
                        <span className="font-medium">
                            {usuario.usuarioNombre}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            {usuario.cantidadReservas} reservas
                        </span>
                    </div>
                )}
            >

                <input
                    type="number"
                    value={cantidadReservas}
                    min={1}
                    onChange={(e) =>
                        setCantidadReservas(Number(e.target.value))
                    }
                    className="w-32 px-3 py-2 rounded-xl border border-accent/20 bg-background text-on-surface outline-none focus:ring-2 focus:ring-primary-light/30" />

            </ConsultaCard>
            <ConsultaCard
                titulo="Reservas anuales"
                descripcion="Muestra las reservas históricas por ID de ssuario."

                loading={loadingAnuales}
                error={errorAnuales}

                onConsultar={consultarReservasAnuales}

                resultados={reservasAnuales}

                renderResultado={(reserva) => (
                    <div className="flex flex-col gap-1">

                        <span className="font-semibold">
                            {reserva.libroTitulo}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            {reserva.libroAutor}
                        </span>

                        <span className="text-xs text-on-surface-variant">
                            {reserva.fechaDesde} → {reserva.fechaHasta}
                        </span>

                    </div>
                )}
            >

                <input
                    type="number"
                    value={usuarioId}
                    min={1}
                    onChange={(e) =>
                        setUsuarioId(Number(e.target.value))
                    }
                    className="w-32 px-3 py-2 rounded-xl border border-accent/20 bg-background"
                />

            </ConsultaCard>

            <ConsultaCard<CantidadColeccionablesResponse>
                titulo="Cantidad de libros 'Coleccionables'"
                descripcion=""
                loading={loadingColeccionables}
                error={errorColeccionables}
                onConsultar={consultarLibrosColeccionables}
                resultados={cantidadColeccionables ? [cantidadColeccionables] : []}
                renderResultado={(resultado) => (
                    <div>
                        Cantidad: {resultado.cantidad}
                    </div>
                )}
            />

            <ConsultaCard
                titulo="Libros con todas las reservas cumplidas"
                descripcion="Muestra los libros cuyas reservas ya han sido cumplidas."
                loading={loadingCumplidas}
                error={errorCumplidas}
                onConsultar={consultarLibrosCumplidas}
                resultados={librosCumplidas}
                renderResultado={(libro) => (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                            {libro.titulo}
                        </span>
                        <span className="text-sm text-on-surface-variant">
                            {libro.autor}
                        </span>
                    </div>
                )}
            />

            <ConsultaCard
                titulo="Libros Destacados"
                descripcion="Saber qué libros tienen más de 4 puntos de calificación."
                loading={loadingMejores}
                error={errorMejores}
                onConsultar={consultarLibrosMejores}
                resultados={librosMejores}
                renderResultado={(libro) => (
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {libro.titulo}
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                {libro.autor}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                            ⭐ {libro.calificacion}
                        </div>
                    </div>
                )}
            />

            <ConsultaCard
                titulo="Libros con Reservas Activas"
                descripcion="Saber qué libros tienen al menos 3 reservas activas."
                loading={loadingReservasActivas}
                error={errorReservasActivas}
                onConsultar={consultarLibrosReservasActivas}
                resultados={librosReservasActivas}
                renderResultado={(libro) => (
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {libro.titulo}
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                {libro.autor}
                            </span>
                        </div>
                    </div>
                )}
            />

            <ConsultaCard<TasaConversionLibroResponse>
                titulo="Tasa de Conversión (Clicks vs. Reservas) [GraphQL]"
                descripcion="Muestra el top 5 de libros más clickeados en Redis y su tasa de conversión basada en reservas en PostgreSQL."
                loading={loadingTasaConversion}
                error={errorTasaConversion}
                onConsultar={consultarTasaConversion}
                resultados={tasaConversion}
                mensajeVacio="No hay libros clickeados"
                renderResultado={(res) => (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-semibold">{res.titulo}</span>
                            <span className="text-sm font-bold text-accent">
                                {(res.tasaConversion * 100).toFixed(1)}% tasa
                            </span>
                        </div>
                        <div className="flex gap-4 text-xs text-on-surface-variant">
                            <span>Clicks: {res.clicks}</span>
                            <span>Reservas: {res.reservas}</span>
                        </div>
                    </div>
                )}
            />

            <ConsultaCard<PromedioCalificacionPorTipoResponse>
                titulo="Análisis de Calificaciones [GraphQL]"
                descripcion="Promedio de calificación agrupado por tipo de libro, excluyendo libros sin reseñas."
                loading={loadingAnalisisCalificaciones}
                error={errorAnalisisCalificaciones}
                onConsultar={consultarAnalisisCalificaciones}
                resultados={analisisCalificaciones}
                mensajeVacio="No hay libros calificados"
                renderResultado={(res) => (
                    <div className="flex justify-between items-center gap-4">
                        <span className="font-semibold">{TIPO_LABEL[res.tipoLibro] ?? res.tipoLibro}</span>
                        <span className="text-sm font-bold text-accent">
                            {res.promedioCalificacion.toFixed(2)}
                        </span>
                    </div>
                )}
            />

            <ConsultaCard<SaludCatalogoResponse>
                titulo="Estado de Salud del Catálogo [GraphQL]"
                descripcion="Clasifica los libros activos en buckets disjuntos según el estado de sus reservas: las cuatro cantidades suman el total."
                loading={loadingSaludCatalogo}
                error={errorSaludCatalogo}
                onConsultar={consultarSaludCatalogo}
                resultados={saludCatalogo ? [saludCatalogo] : []}
                mensajeVacio="Sin datos del catálogo"
                renderResultado={(res) => (
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-semibold">Total de libros activos</span>
                            <span className="text-sm font-bold text-accent">{res.total}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Prestados (reserva vigente hoy)</span>
                            <span className="font-bold">{res.prestados}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Disponibles, nunca reservados</span>
                            <span className="font-bold">{res.disponiblesNuncaReservados}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Disponibles, reservados a futuro</span>
                            <span className="font-bold">{res.disponiblesReservadosAFuturo}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Disponibles, devueltos</span>
                            <span className="font-bold">{res.disponiblesDevueltos}</span>
                        </div>
                    </div>
                )}
            />

            <ConsultaCard<FeedActividadResponse>
                titulo="Feed de Actividad Reciente [GraphQL]"
                descripcion="Top 5 de los últimos libros dados de alta y reservas confirmadas, ordenados por fecha."
                loading={loadingFeedActividad}
                error={errorFeedActividad}
                onConsultar={consultarFeedActividad}
                resultados={feedActividad}
                mensajeVacio="No hay actividad reciente"
                renderResultado={(evento) => EVENTO_RENDERERS[evento.tipoEvento]?.(evento)}
            />

            <ConsultaCard<TopUsuariosResponse>
                titulo="Top 5 Usuarios por Bibliokarma [GraphQL]"
                descripcion="Ranking de usuarios con mayor bibliokarma"
                loading={loadingTopUsuarios}
                error={errorTopUsuarios}
                onConsultar={consultarTopUsuarios}
                resultados={topUsuarios}
                mensajeVacio="No hay usuarios en el ranking"
                renderResultado={(usuario) => (
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {usuario.nombre}
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                ID: {usuario.id}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 font-bold text-accent">
                            ⭐ {usuario.bibliokarma} BK
                        </div>
                    </div>
                )}
            />
        </div >
    )
}
