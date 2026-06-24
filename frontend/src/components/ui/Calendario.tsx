import { DayPicker, getDefaultClassNames, type DateRange } from "react-day-picker"
import { es } from "react-day-picker/locale"
import "react-day-picker/style.css"

interface CalendarioProps {
  modo?: "single" | "range"
  rangeSeleccionado?: DateRange
  onSelect?: (range: DateRange | undefined) => void
  fechaSeleccionada?: Date
  onSelectFecha?: (fecha: Date | undefined) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diasDeshabilitados: any[]
  defaultMonth?: Date
  mes?: Date
  onMesCambio?: (mes: Date) => void
}

export const Calendario = ({
  modo = "range",
  rangeSeleccionado,
  onSelect,
  fechaSeleccionada,
  onSelectFecha,
  diasDeshabilitados,
  defaultMonth,
  mes,
  onMesCambio,
}: CalendarioProps) => {
  const defaultClassNames = getDefaultClassNames()
  const handleRangeSelect = onSelect ?? (() => undefined)
  const sharedClassNames = {
    root: `${defaultClassNames.root} w-full p-4 font-sans relative`,
    months: "w-full",
    month: "w-full",
    month_caption: "flex items-center text-secondary-dark font-extrabold text-lg mb-4 px-2",
    nav: "absolute top-4 right-4 flex gap-1.5",
    button_previous: `${defaultClassNames.button_previous} !text-primary-light !bg-surface-highest !border !border-accent hover:!bg-accent rounded-lg w-8 h-8 flex items-center justify-center transition-colors`,
    button_next: `${defaultClassNames.button_next} !text-primary-light !bg-surface-highest !border !border-accent hover:!bg-accent rounded-lg w-8 h-8 flex items-center justify-center transition-colors`,
    chevron: "fill-primary-light w-4 h-4",
    month_grid: "w-full border-collapse",
    weekdays: "",
    weekday: "text-secondary-light text-[0.65rem] font-bold uppercase tracking-widest py-2 text-center",
    week: "",
    day: "p-0 text-center",
    day_button: `${defaultClassNames.day_button} !w-full !h-10 text-secondary text-[0.8rem] font-medium bg-transparent hover:!bg-surface-highest hover:!text-secondary-dark transition-all cursor-pointer flex items-center justify-center border-none rounded-lg`,
    today: "[&>button]:font-black [&>button]:underline [&>button]:text-primary-light",
    selected: "[&>button]:!bg-primary [&>button]:!text-white [&>button]:!font-bold",
    disabled: "[&>button]:!text-accent [&>button]:!line-through [&>button]:!opacity-40 [&>button]:!cursor-not-allowed hover:[&>button]:!bg-transparent",
    outside: "[&>button]:!opacity-0 [&>button]:!pointer-events-none",
  }

  const rangeOnlyClassNames = {
    range_start: "bg-primary/15 rounded-l-lg [&>button]:!bg-primary [&>button]:!text-white [&>button]:!rounded-l-lg [&>button]:!rounded-r-none [&.rdp-day_range_end]:!bg-transparent [&.rdp-day_range_end>button]:!rounded-lg",
    range_middle: "!bg-primary/15 [&>button]:!bg-transparent [&>button]:!text-primary-light [&>button]:!rounded-none",
    range_end: "bg-primary/15 rounded-r-lg [&>button]:!bg-primary [&>button]:!text-white [&>button]:!rounded-r-lg [&>button]:!rounded-l-none [&.rdp-day_range_start]:!bg-transparent [&.rdp-day_range_start>button]:!rounded-lg",
  }

  return (
    <div className="mx-4 my-4 rounded-2xl overflow-hidden border border-accent/40 bg-surface-high">
      {modo === "single" ? (
        <DayPicker
          mode="single"
          locale={es}
          selected={fechaSeleccionada}
          onSelect={onSelectFecha}
          disabled={diasDeshabilitados}
          defaultMonth={defaultMonth}
          month={mes}
          onMonthChange={onMesCambio}
          showOutsideDays={false}
          classNames={sharedClassNames}
        />
      ) : (
        <DayPicker
          mode="range"
          locale={es}
          selected={rangeSeleccionado}
          onSelect={handleRangeSelect}
          disabled={diasDeshabilitados}
          defaultMonth={defaultMonth}
          month={mes}
          onMonthChange={onMesCambio}
          showOutsideDays={false}
          classNames={{ ...sharedClassNames, ...rangeOnlyClassNames }}
        />
      )}
    </div>
  )
}