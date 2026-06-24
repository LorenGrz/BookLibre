import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Card, CardHeader } from "../ui/Card"
import { Boton } from "../ui/Boton"
import { formatearFechaVisual, calcularDiferenciaDias } from "../../utils/dateHandlerReserva"
import { reservaService } from "../../services/reservaService"
import { Libro } from "../../classes/Libro"
import {
  CalendarDays,
  Package,
  RotateCcw,
  Clock,
  Pencil,
  CheckCircle2,
  Bug,
  ChevronDown,
} from "lucide-react"
import { Calendario } from "../ui/Calendario"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../../utils/errorHandler"

interface ReservaCardProps {
  libro: Libro
  usuarioId: number
  onReservaExitosa: (desde: string, hasta: string) => void
  fechaDesde: string
  setFechaDesde: (fecha: string) => void
  fechaHasta: string
  setFechaHasta: (fecha: string) => void
  esAdmin?: boolean
}

const strToDate = (str: string) => new Date(str + "T12:00:00")
const dateToStr = (d: Date) => format(d, "yyyy-MM-dd")

export const ReservaCard = ({
  libro,
  usuarioId,
  onReservaExitosa,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  esAdmin = false,
}: ReservaCardProps) => {
  const [loading, setLoading] = useState(false)
  const [calendarAbierto, setCalendarAbierto] = useState(false)
  const [reservaConfirmada, setReservaConfirmada] = useState<{
    desde: string
    hasta: string
  } | null>(null)
  const [debugAbierto, setDebugAbierto] = useState(false)
  const [debugDesde, setDebugDesde] = useState("")
  const [debugHasta, setDebugHasta] = useState("")

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const minDia = new Date(hoy)
  minDia.setDate(minDia.getDate() + 1)

  const diasDeshabilitados = [
    { before: minDia },
    ...libro.reservas.map((r) => ({
      from: new Date(r.fechaDesde + "T12:00:00"),
      to: new Date(r.fechaHasta + "T12:00:00"),
    })),
  ]

  const rangeSeleccionado: DateRange | undefined = fechaDesde
    ? {
        from: strToDate(fechaDesde),
        to: fechaHasta ? strToDate(fechaHasta) : undefined,
      }
    : undefined

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setFechaDesde("")
      setFechaHasta("")
      return
    }

    const nuevoDesde = range.from ? dateToStr(range.from) : ""
    const nuevoHasta = range.to ? dateToStr(range.to) : ""

    const esPrimerClic =
      nuevoDesde && nuevoHasta && nuevoDesde === nuevoHasta && !fechaDesde

    setFechaDesde(nuevoDesde)

    if (esPrimerClic) {
      setFechaHasta("")
    } else {
      setFechaHasta(nuevoHasta)
      if (nuevoHasta) {
        setCalendarAbierto(false)
      }
    }
  }

  const duracionDias =
    fechaDesde && fechaHasta ? calcularDiferenciaDias(fechaDesde, fechaHasta) : 0

  const handleReservar = async () => {
    const usarDebug = esAdmin && !!(debugDesde && debugHasta)
    const fechaDesdeEnvio = usarDebug ? debugDesde : fechaDesde
    const fechaHastaEnvio = usarDebug ? debugHasta : fechaHasta
    if (!fechaDesdeEnvio || !fechaHastaEnvio) return
    if (new Date(fechaHastaEnvio) <= new Date(fechaDesdeEnvio)) {
      toast.error(
        'La fecha de "hasta" debe ser posterior a la fecha de "desde"'
      )
      return
    }
    setLoading(true)
    try {
      await reservaService.crearReserva({
        libroId: libro.id,
        usuarioId,
        fechaDesde: fechaDesdeEnvio,
        fechaHasta: fechaHastaEnvio,
      })
      setReservaConfirmada({ desde: fechaDesdeEnvio, hasta: fechaHastaEnvio })
      setFechaDesde("")
      setFechaHasta("")
      setCalendarAbierto(false)
      toast.success("¡Reserva confirmada con éxito!")
      onReservaExitosa(fechaDesdeEnvio, fechaHastaEnvio)
    } catch (error) {
      const err = obtenerMensajeError(error)
      toast.error(
        err.mensaje || "No se pudo confirmar la reserva. Intentá de nuevo."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleModificarFechas = () => {
    setFechaDesde("")
    setFechaHasta("")
    setCalendarAbierto(true)
  }

  const hayFechasSeleccionadas = !!(fechaDesde && fechaHasta)

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0">
      <div className="px-5 pt-5 pb-4 border-b border-accent/10">
        <CardHeader
          titulo={reservaConfirmada ? "Reserva Confirmada" : "Tu Reserva"}
          icono={
            reservaConfirmada ? (
              <CheckCircle2 size={18} className="text-success" />
            ) : (
              <CalendarDays size={18} className="text-primary" />
            )
          }
          className="text-lg mb-0"
        />
      </div>

      {reservaConfirmada ? (
        <div className="px-5 py-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <p className="text-sm font-semibold text-secondary-dark">
            ¡El libro está reservado para vos!
          </p>
          <div className="w-full flex flex-col gap-0">
            <div className="flex items-center justify-between py-2.5 border-b border-accent/10">
              <div className="flex items-center gap-2 text-secondary/60">
                <Package size={13} />
                <span className="text-xs font-semibold">Retiro</span>
              </div>
              <span className="text-xs font-bold text-secondary-dark">
                {formatearFechaVisual(reservaConfirmada.desde)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-secondary/60">
                <RotateCcw size={13} />
                <span className="text-xs font-semibold">Devolución</span>
              </div>
              <span className="text-xs font-bold text-secondary-dark">
                {formatearFechaVisual(reservaConfirmada.hasta)}
              </span>
            </div>
          </div>
          <p className="text-xs text-secondary/40">
            El libro quedará reservado a tu nombre hasta el{" "}
            <span className="font-semibold text-secondary/60">
              {formatearFechaVisual(reservaConfirmada.hasta)}
            </span>
          </p>
        </div>
      ) : (
        <>
          {/* Calendar Dropdown Selector */}
          <div className="border-b border-accent/10">
            <button
              type="button"
              onClick={() => setCalendarAbierto((v) => !v)}
              className="cursor-pointer w-full flex items-center justify-between px-5 py-3.5 text-left group transition-colors hover:bg-accent/5"
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-secondary/70 group-hover:text-secondary transition-colors">
                  {hayFechasSeleccionadas ? "Cambiar Fechas" : "Seleccionar Fechas"}
                </span>
                {hayFechasSeleccionadas && (
                  <span className="ml-2 text-xs font-semibold text-primary">
                    ({duracionDias} {duracionDias === 1 ? "día" : "días"})
                  </span>
                )}
              </div>
              <ChevronDown
                size={13}
                className={`text-secondary/50 transition-transform duration-200 ${
                  calendarAbierto ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                calendarAbierto
                  ? "max-h-[360px] pb-4 opacity-100 border-t border-accent/5"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Calendario
                rangeSeleccionado={rangeSeleccionado}
                onSelect={handleSelect}
                diasDeshabilitados={diasDeshabilitados}
              />
            </div>
          </div>

          {/* Selected dates summary details */}
          {hayFechasSeleccionadas && (
            <div className="px-5 py-4 border-b border-accent/10 bg-accent/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50">
                  Fechas Seleccionadas
                </p>
                <button
                  type="button"
                  onClick={handleModificarFechas}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
                >
                  <Pencil size={10} />
                  Modificar
                </button>
              </div>
              <div className="flex items-center gap-3 mb-3 bg-primary/10 rounded-lg px-3 py-2.5">
                <CalendarDays size={14} className="text-primary shrink-0" />
                <span className="text-sm font-semibold text-secondary-dark">
                  {formatearFechaVisual(fechaDesde)} →{" "}
                  {formatearFechaVisual(fechaHasta)}
                </span>
              </div>
              <div className="flex flex-col gap-0">
                <div className="flex items-center justify-between py-2 border-b border-accent/10">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Package size={13} />
                    <span className="text-xs font-semibold">Recogido</span>
                  </div>
                  <span className="text-xs font-bold text-secondary-dark">
                    {formatearFechaVisual(fechaDesde)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-accent/10">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <RotateCcw size={13} />
                    <span className="text-xs font-semibold">Devolución</span>
                  </div>
                  <span className="text-xs font-bold text-secondary-dark">
                    {formatearFechaVisual(fechaHasta)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Clock size={13} />
                    <span className="text-xs font-semibold">Duración</span>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {duracionDias} {duracionDias === 1 ? "día" : "días"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="px-5 py-4 flex flex-col gap-2">
            {/* Debug fecha */}
            {esAdmin && (
              <div className="border border-yellow-500/30 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDebugAbierto((v) => !v)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors text-left"
                >
                  <Bug size={12} className="text-yellow-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                    Debug
                  </span>
                  <span className="ml-auto text-[10px] text-yellow-400/60">
                    {debugAbierto ? "▲" : "▼"}
                  </span>
                </button>
                {debugAbierto && (
                  <div className="px-3 py-3 flex flex-col gap-2 bg-yellow-500/5">
                    <p className="text-[10px] text-yellow-400/70 leading-relaxed">
                      Sobreescribe las fechas del calendario con valores exactos
                      (fecha + hora).
                    </p>
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-yellow-400/80">
                        Desde
                      </span>
                      <input
                        type="datetime-local"
                        value={debugDesde}
                        onChange={(e) => setDebugDesde(e.target.value)}
                        className="text-xs bg-surface-high border border-yellow-500/30 rounded px-2 py-1 text-secondary-dark focus:outline-none focus:border-yellow-400"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-yellow-400/80">
                        Hasta
                      </span>
                      <input
                        type="datetime-local"
                        value={debugHasta}
                        onChange={(e) => setDebugHasta(e.target.value)}
                        className="text-xs bg-surface-high border border-yellow-500/30 rounded px-2 py-1 text-secondary-dark focus:outline-none focus:border-yellow-400"
                      />
                    </label>
                    {(debugDesde || debugHasta) && (
                      <button
                        type="button"
                        onClick={() => {
                          setDebugDesde("")
                          setDebugHasta("")
                        }}
                        className="text-[10px] text-yellow-400/60 hover:text-yellow-400 text-left underline"
                      >
                        Limpiar override
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <Boton
              tipo="primario"
              className="w-full"
              onClick={handleReservar}
              deshabilitado={
                loading ||
                (!(fechaDesde && fechaHasta) && !(esAdmin && debugDesde && debugHasta))
              }
            >
              {loading ? "Procesando..." : "Confirmar Reserva ✓"}
            </Boton>

            {hayFechasSeleccionadas && (
              <p className="text-xs text-secondary/40 text-center">
                El libro quedará reservado a tu nombre hasta el{" "}
                {formatearFechaVisual(fechaHasta)}
              </p>
            )}
          </div>
        </>
      )}
    </Card>
  )
}