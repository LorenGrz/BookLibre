import { useState, useCallback, useEffect, useRef } from "react"
import { Libro } from "../classes/Libro"
import { libroService } from "../services/libroService"
import { useOnInit } from "../utils/hooks"
import {
  obtenerMensajeError,
  type ErrorPersonalizado,
} from "../utils/errorHandler"

export const useDetalleLibro = (
  id: string | undefined,
  usuarioId: number,
  cargandoUsuario: boolean,
) => {
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const isInitial = useRef(true)

  const recargar = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await libroService.getLibroById(Number(id), usuarioId)
      setLibro(data)
    } catch (err) {
      console.error("Error fetching libro", err)
      setError(obtenerMensajeError(err))
    } finally {
      setLoading(false)
    }
  }, [id, usuarioId])

  useOnInit(() => {
    if (!cargandoUsuario) {
      recargar()
    }
  })

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }
    if (!cargandoUsuario) {
      recargar()
    }
  }, [cargandoUsuario, recargar])

  return { libro, setLibro, loading, error, recargar }
}
