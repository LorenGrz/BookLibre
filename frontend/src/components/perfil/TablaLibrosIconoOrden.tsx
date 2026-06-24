import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { SentidoOrden } from '../../utils/misLibros/gestionMisLibros'

export type PropsTablaLibrosIconoOrden = {
  activo: boolean
  sentido: SentidoOrden
}

export function TablaLibrosIconoOrden({ activo, sentido }: PropsTablaLibrosIconoOrden) {
  if (!activo) {
    return <ChevronsUpDown className="ml-1 w-3 h-3 text-gray-300" />
  }
  return sentido === 'ascendente' ? (
    <ChevronUp className="ml-1 w-3 h-3 text-secondary" />
  ) : (
    <ChevronDown className="ml-1 w-3 h-3 text-secondary" />
  )
}
