import { format } from "date-fns"
import { Calendario } from "../../ui/Calendario"

interface FechaPublicacionFieldProps {
  value: string
  error?: string
  fechaEsFutura: boolean
  fechaPickerAbierto: boolean
  fechaSeleccionada?: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diasDeshabilitados: any[]
  mesCalendario?: Date
  onChange: (value: string) => void
  onOpen: () => void
  onClose: () => void
  onCalendarSelect: (fecha: Date | undefined) => void
}

export const FechaPublicacionField = ({
  value,
  error,
  fechaEsFutura,
  fechaPickerAbierto,
  fechaSeleccionada,
  diasDeshabilitados,
  mesCalendario,
  onChange,
  onOpen,
  onClose,
  onCalendarSelect,
}: FechaPublicacionFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
        Fecha de publicación <span className="text-primary">*</span>
      </label>
      <input
        type="date"
        value={value}
        max={format(new Date(), "yyyy-MM-dd")}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onOpen}
        className={`w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm outline-none transition-colors focus:border-primary
          ${error || fechaEsFutura ? "border-red-400" : "border-accent"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {fechaPickerAbierto && (
        <div className="mt-2 rounded-lg border border-accent bg-surface-high p-2">
          <Calendario
            modo="single"
            rangeSeleccionado={
              fechaSeleccionada
                ? { from: fechaSeleccionada, to: fechaSeleccionada }
                : undefined
            }
            fechaSeleccionada={fechaSeleccionada}
            onSelectFecha={onCalendarSelect}
            diasDeshabilitados={diasDeshabilitados}
            mes={mesCalendario}
          />
          <button
            type="button"
            onClick={onClose}
            className="mt-1 w-full text-xs text-secondary/50 hover:text-secondary/80 transition-colors py-1"
          >
            Cerrar calendario
          </button>
        </div>
      )}
    </div>
  )
}
