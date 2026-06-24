import { useNavigate, useOutletContext } from "react-router-dom"
import { libroService } from "../services/libroService"
import type { ClickLogDTO } from "../models/libroModel"
import { useEffect, useMemo, useState } from "react"
import type { ContextoPerfilUsuario } from "../layouts/PerfilUsuarioLayout"
import { Usuario } from "../classes/usuario"
import { PerfilResumen } from "../components/perfil/PerfilResumen"
import { MisDatosCard } from "../components/perfil/MisDatosCard"
import { EstadisticaCard } from "../components/perfil/EstadisticaCard"
import { GestionMisLibros } from "../components/perfil/GestionMisLibros"
import { HistorialClicksCard } from "../components/perfil/HistorialClicksCard"
import { ModalEditarPerfil } from "../components/perfil/ModalEditarPerfil"
import { usuarioService } from "../services/usuarioService"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../utils/errorHandler"
import { useAuthContext } from "../utils/hooks"
import { useGestionMisLibros } from "../utils/misLibros/useGestionMisLibros"

export const PerfilUsuario = () => {
  const { usuario, setUsuario } = useOutletContext<ContextoPerfilUsuario>()
  const { setUsuarioContext } = useAuthContext()
  const navigate = useNavigate()
  const [clicks, setClicks] = useState<ClickLogDTO[]>([])
  const [cargandoClicks, setCargandoClicks] = useState(false)
  const [errorClicks, setErrorClicks] = useState<string | null>(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

  const clicksPorLibro = useMemo(() => {
    const mapa = new Map<number, number>()
    for (const click of clicks) {
      mapa.set(click.libroId, (mapa.get(click.libroId) ?? 0) + 1)
    }
    return mapa
  }, [clicks])

  const libroMasClickeado = useMemo(() => {
    if (clicks.length === 0) return null

    const acumulado = new Map<
      number,
      { libroId: number; libroTitulo: string; total: number }
    >()

    for (const click of clicks) {
      const actual = acumulado.get(click.libroId)
      acumulado.set(click.libroId, {
        libroId: click.libroId,
        libroTitulo: click.libroTitulo,
        total: (actual?.total ?? 0) + 1,
      })
    }

    return [...acumulado.values()].sort((a, b) => b.total - a.total)[0] ?? null
  }, [clicks])

  const esSoloLector = usuario.tipoUsuario === "Lector"
  const esSoloPublicador = usuario.tipoUsuario === "Publicador"
  const esAdmin = usuario.tipoUsuario === "ADMIN"

  const gestionLibros = useGestionMisLibros({ usuarioId: usuario.id, enabled: !esSoloLector && !esAdmin })

  const cargarClicks = async () => {
    if (usuario.tipoUsuario === "Lector" || usuario.tipoUsuario === "ADMIN") {
      setClicks([])
      setErrorClicks(null)
      setCargandoClicks(false)
      return
    }

    setCargandoClicks(true)
    setErrorClicks(null)
    try {
      const response = await usuarioService.obtenerClicksDePublicador(usuario.id)
      setClicks(response)
    } catch (e: unknown) {
      setClicks([])
      const err = obtenerMensajeError(e)
      setErrorClicks(err.mensaje || "No se pudo cargar el historial de clicks.")
    } finally {
      setCargandoClicks(false)
    }
  }

  useEffect(() => {
    let activa = true

    const cargarClicksSegunTipo = async () => {
      if (usuario.tipoUsuario === "Lector" || usuario.tipoUsuario === "ADMIN") {
        if (!activa) return
        setClicks([])
        setErrorClicks(null)
        setCargandoClicks(false)
        return
      }

      if (!activa) return
      setCargandoClicks(true)
      setErrorClicks(null)
      try {
        const response = await usuarioService.obtenerClicksDePublicador(
          usuario.id,
        )
        if (!activa) return
        setClicks(response)
      } catch (e: unknown) {
        if (!activa) return
        setClicks([])
        const err = obtenerMensajeError(e)
        setErrorClicks(
          err.mensaje || "No se pudo cargar el historial de clicks.",
        )
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!activa) return
        setCargandoClicks(false)
      }
    }

    void cargarClicksSegunTipo()

    return () => {
      activa = false
    }
  }, [usuario.id, usuario.tipoUsuario])

  const guardarDesdeModal = async (u: Usuario) => {
    try {
      const data = await usuarioService.actualizarUsuario(u)
      const imagenUrl =
        data.imagenUrl != null ? data.imagenUrl : u.imagenUrl
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { errors: _, ...uSinErrores } = u
      const nuevo = new Usuario({ ...uSinErrores, ...data, imagenUrl })
      nuevo.errors = {}
      setUsuario(nuevo)
      setUsuarioContext(nuevo)
      toast.success("¡Perfil actualizado con éxito!")
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || "No se pudo actualizar el perfil.")
    }
  }

  const manejarAgregarLibro = () => {
    navigate("/libros/nuevo/editar")
  }

  const manejarEliminarLibro = async (libroId: number) => {
    try {
      await libroService.eliminarLibro(libroId, usuario.id)
      toast.success("Libro eliminado.")
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || "No se pudo eliminar el libro.")
      throw e
    }
  }

  const cantidadPrestados = usuario.reservados
  const cantidadLeidos = usuario.leidos

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div
        className="animate-in fade-in duration-300"
        style={{ animationDelay: "60ms" }}
      >
        <PerfilResumen
          usuario={usuario}
          onEditar={() => setModalEditarAbierto(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-stretch">
        <div
          className={`${esAdmin ? "lg:col-span-12" : (esSoloLector ? "lg:col-span-8" : "lg:col-span-4 lg:h-full lg:flex lg:flex-col")} space-y-6 animate-in fade-in duration-300`}
          style={{ animationDelay: "120ms" }}
        >
          <MisDatosCard usuario={usuario} />

          {(!esSoloLector && !esAdmin) && (
            <div
              className={`grid gap-4 lg:flex-1 lg:h-full ${esSoloPublicador ? "grid-cols-1" : "grid-cols-2"}`}
            >
              <EstadisticaCard
                valor={cantidadPrestados}
                etiqueta="Libros Prestados"
                className={`min-h-31 ${esSoloPublicador ? "lg:h-full" : "lg:min-h-0 lg:h-full"}`}
                valorClassName={esSoloPublicador ? "text-6xl" : "text-5xl"}
                etiquetaClassName="text-[10px] tracking-[0.18em] text-on-surface-variant/60"
              />
              {!esSoloPublicador && (
                <EstadisticaCard
                  valor={cantidadLeidos}
                  etiqueta="Libros Leídos"
                  className="min-h-31 lg:min-h-0 lg:h-full"
                  valorClassName="text-5xl"
                  etiquetaClassName="text-[10px] tracking-[0.18em] text-on-surface-variant/60"
                />
              )}
            </div>
          )}
        </div>

        {esSoloLector && (
          <div
            className="lg:col-span-4 animate-in fade-in duration-300 h-full"
            style={{ animationDelay: "160ms" }}
          >
            <div className="h-full">
              <div className="w-full h-full">
                <EstadisticaCard
                  valor={cantidadLeidos}
                  etiqueta="Libros Leídos"
                  className="h-full min-h-60 lg:min-h-0"
                  valorClassName="text-7xl lg:text-8xl"
                  etiquetaClassName="text-[10px] lg:text-xs tracking-[0.2em] text-on-surface-variant/60"
                />
              </div>
            </div>
          </div>
        )}

        {(!esSoloLector && !esAdmin) && (
          <div
            className="lg:col-span-8 animate-in fade-in duration-300"
            style={{ animationDelay: "160ms" }}
          >
            <GestionMisLibros
              gestion={gestionLibros}
              onAgregar={manejarAgregarLibro}
              onEliminar={manejarEliminarLibro}
              clicksPorLibro={clicksPorLibro}
            />
          </div>
        )}
      </div>

      {!esSoloLector && !esAdmin && libroMasClickeado && (
        <div
          className="animate-in fade-in duration-300"
          style={{ animationDelay: "180ms" }}
        >
          <div className="bg-surface rounded-xl border border-accent/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] px-5 py-4 flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5">
            <span className="text-2xl" aria-hidden="true">
              📖
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                Tu libro más clickeado
              </div>
              <div className="text-on-surface font-bold truncate">
                {libroMasClickeado.libroTitulo}
                <span className="ml-2 text-sm text-on-surface-variant/60 font-medium tabular-nums">
                  ({libroMasClickeado.total} visitas)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!esSoloLector && !esAdmin && (
        <div
          className="animate-in fade-in duration-300"
          style={{ animationDelay: "200ms" }}
        >
          <HistorialClicksCard
            clicks={clicks}
            cargando={cargandoClicks}
            error={errorClicks}
            onReintentar={() => void cargarClicks()}
          />
        </div>
      )}

      {modalEditarAbierto && (
        <ModalEditarPerfil
          onClose={() => setModalEditarAbierto(false)}
          usuario={usuario}
          onGuardar={guardarDesdeModal}
        />
      )}
    </div>
  )
}
