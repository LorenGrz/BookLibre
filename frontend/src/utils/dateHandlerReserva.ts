import {
  differenceInDays,
  format,
  parseISO,
  startOfDay,
} from "date-fns"
import { es } from "date-fns/locale"

//Calcula la diferencia en días entre dos fechas (formato YYYY-MM-DD).
export const calcularDiferenciaDias = (
  fechaDesde: string,
  fechaHasta: string,
): number => {
  if (!fechaDesde || !fechaHasta) return 0
  const desde = startOfDay(parseISO(fechaDesde))
  const hasta = startOfDay(parseISO(fechaHasta))
  const diff = differenceInDays(hasta, desde)
  return diff >= 0 ? diff + 1 : 0
}

//Devuelve la fecha actual en formato YYYY-MM-DD para usar en inputs de HTML.
export const obtenerFechaHoy = (): string => format(new Date(), "yyyy-MM-dd");

// Formatea una fecha string (YYYY-MM-DD) a un formato visual amigable.
export const formatearFechaVisual = (fechaStr: string): string => {
  if (!fechaStr) return "-";
  return format(parseISO(fechaStr), "d MMM yyyy", { locale: es })
}

// Formatea una fecha-hora string (ISO datetime) incluyendo horas y minutos.
export const formatearFechaHoraVisual = (fechaStr: string): string => {
  if (!fechaStr) return "-";
  const hasTime = fechaStr.includes("T") && fechaStr.length > 10;
  const fmt = hasTime ? "d MMM yyyy HH:mm" : "d MMM yyyy";
  return format(parseISO(fechaStr), fmt, { locale: es });
}