export type VarianteBadgeDisponibilidad = 'exito' | 'advertencia'

export type BadgeDisponibilidad = {
  variante: VarianteBadgeDisponibilidad
  texto: string
}

/** Variante y texto del badge según si el libro está prestado o no. */
export function badgeDisponibilidad(disponible: boolean): BadgeDisponibilidad {
  return disponible
    ? { variante: 'exito', texto: 'Disponible' }
    : { variante: 'advertencia', texto: 'Prestado' }
}

/** Fecha corta es-AR o "—" si no hay dato. */
export function formatearFechaAgregadoLibro(fechaStr: string | null | undefined): string {
  if (!fechaStr) return '—'
  return new Date(fechaStr)
    .toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', '')
}

/** Ruta de edición de un libro en la app. */
export function rutaEditarLibro(libroId: number): string {
  return `/libros/${libroId}/editar`
}
