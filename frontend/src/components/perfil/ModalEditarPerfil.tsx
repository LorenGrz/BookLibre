import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Boton, Avatar } from "../ui"
import { Usuario } from "../../classes/usuario"
import type { TipoUsuario } from "../../models/usuarioModel"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../../utils/errorHandler"

export type PropsModalEditarPerfil = {
  onClose: () => void
  usuario: Usuario
  onGuardar: (usuario: Usuario) => void | Promise<void>
}

const opcionesTipo: TipoUsuario[] = ["Lector", "Publicador", "LectorPublicador"]
const claseInput =
  "mt-1 w-full rounded-lg border border-outline/40 px-3 py-2.5 text-sm text-on-surface bg-surface-high focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
const claseInputError = "border-danger/60 focus:ring-danger/40"
const MAX_FOTO_BYTES = 800_000

async function archivoADataUrl(file: File): Promise<string> {
  if (file.size > MAX_FOTO_BYTES) {
    throw new Error("La imagen es demasiado grande (máx. ~800 KB).")
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."))
    reader.readAsDataURL(file)
  })
}

export const ModalEditarPerfil = ({
  onClose,
  usuario,
  onGuardar,
}: PropsModalEditarPerfil) => {
  const [form, setForm] = useState<Usuario>(new Usuario(usuario))
  const [enviando, setEnviando] = useState(false)
  const [archivoLocal, setArchivoLocal] = useState<File | null>(null)
  const [previewLocal, setPreviewLocal] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewLocal) URL.revokeObjectURL(previewLocal)
    }
  }, [previewLocal])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 180)
  }

  const detectarCampoDuplicado = (
    mensaje: string,
  ): "email" | "celular" | null => {
    const texto = mensaje.toLowerCase()
    if (texto.includes("email")) return "email"
    if (
      texto.includes("celular") ||
      texto.includes("telefono") ||
      texto.includes("teléfono")
    )
      return "celular"
    return null
  }

  const setCampo =
    (
      campo: "nombre" | "desc" | "email" | "celular" | "ciudad" | "tipoUsuario",
    ) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      if (campo === "tipoUsuario") {
        setForm(form.setCampo("tipoUsuario", e.target.value as TipoUsuario))
        return
      }
      setForm(form.setCampo(campo, e.target.value))
    }

  const alElegirArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !file.type.startsWith("image/")) {
      if (file) toast.error("Elegí un archivo de imagen.")
      return
    }
    if (previewLocal) URL.revokeObjectURL(previewLocal)
    setArchivoLocal(file)
    setPreviewLocal(URL.createObjectURL(file))
  }

  const quitarFoto = () => {
    if (previewLocal) URL.revokeObjectURL(previewLocal)
    setPreviewLocal(null)
    setArchivoLocal(null)
    setForm(form.setCampo("imagenUrl", null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validado = form.validar()
    setForm(validado)
    if (Object.keys(validado.errors).length > 0) return
    setEnviando(true)
    try {
      let aGuardar = validado
      if (archivoLocal) {
        const dataUrl = await archivoADataUrl(archivoLocal)
        aGuardar = new Usuario({ ...validado, imagenUrl: dataUrl })
      }
      await onGuardar(aGuardar)
      handleClose()
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("demasiado grande")) {
        toast.error(e.message)
        setEnviando(false)
        return
      }
      const err = obtenerMensajeError(e)
      if (err.estado === 409) {
        const campo = detectarCampoDuplicado(err.mensaje)
        if (campo) {
          const usuarioConError = new Usuario({ ...validado })
          usuarioConError.errors = { ...validado.errors, [campo]: err.mensaje }
          setForm(usuarioConError)
          return
        }
      }
      toast.error(err.mensaje || "No se pudieron guardar los cambios.")
    } finally {
      setEnviando(false)
    }
  }

  const srcVistaPrevia = previewLocal || form.imagenUrl || null

  return createPortal(
    <div
      className="backdrop-enter fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-perfil-titulo"
      onClick={handleClose}
    >
      <div
        className={`${closing ? "modal-out" : "modal-enter"} bg-surface border border-accent/15 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent/20 hover:scrollbar-thumb-accent/30`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-outline/20">
              <h2
                id="modal-editar-perfil-titulo"
                className="text-lg font-bold text-on-surface"
              >
                Editar perfil
              </h2>
            </div>

            <div className="flex flex-col items-center gap-3 py-2">
              <Avatar tamaño="grande" src={srcVistaPrevia} alt={form.nombre} />
              <input
                ref={inputArchivoRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={alElegirArchivo}
              />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Boton
                  type="button"
                  tipo="secundario"
                  className="text-xs py-2 px-3"
                  onClick={() => inputArchivoRef.current?.click()}
                  deshabilitado={enviando}
                >
                  Elegir imagen
                </Boton>
                {(srcVistaPrevia || form.imagenUrl) && (
                  <button
                    type="button"
                    onClick={quitarFoto}
                    className="cursor-pointer text-xs font-semibold text-on-surface-variant hover:text-danger underline-offset-2 hover:underline"
                  >
                    Quitar foto
                  </button>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant/80 text-center max-w-sm">
                Solo desde tu dispositivo. Tamaño máximo ~800 KB.
              </p>
            </div>

            <div>
              <label
                htmlFor="editar-perfil-nombre"
                className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase"
              >
                Nombre
              </label>
              <input
                id="editar-perfil-nombre"
                type="text"
                value={form.nombre}
                onChange={setCampo("nombre")}
                className={
                  form.errors?.nombre
                    ? `${claseInput} ${claseInputError}`
                    : claseInput
                }
                required
              />
              {form.errors?.nombre && (
                <p className="mt-1 text-xs text-red-500">
                  {form.errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="editar-perfil-desc"
                className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase"
              >
                Descripción
              </label>
              <textarea
                id="editar-perfil-desc"
                value={form.desc}
                onChange={setCampo("desc")}
                className={`${claseInput} resize-none min-h-20`}
                rows={3}
              />
              {form.errors?.desc && (
                <p className="mt-1 text-xs text-red-500">{form.errors.desc}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="editar-perfil-email"
                className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase"
              >
                Email
              </label>
              <input
                id="editar-perfil-email"
                type="email"
                value={form.email}
                onChange={setCampo("email")}
                className={
                  form.errors?.email
                    ? `${claseInput} ${claseInputError}`
                    : claseInput
                }
                required
              />
              {form.errors?.email && (
                <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="editar-perfil-celular"
                className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase"
              >
                Celular
              </label>
              <input
                id="editar-perfil-celular"
                type="tel"
                value={form.celular}
                onChange={setCampo("celular")}
                className={
                  form.errors?.celular
                    ? `${claseInput} ${claseInputError}`
                    : claseInput
                }
              />
              {form.errors?.celular && (
                <p className="mt-1 text-xs text-red-500">
                  {form.errors.celular}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="editar-perfil-ciudad"
                className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase"
              >
                Ciudad / Ubicación
              </label>
              <input
                id="editar-perfil-ciudad"
                type="text"
                value={form.ciudad}
                onChange={setCampo("ciudad")}
                className={claseInput}
              />
            </div>

            <div>
              <label
                htmlFor="editar-perfil-tipo"
                className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase"
              >
                Tipo de lector
              </label>
              <select
                id="editar-perfil-tipo"
                value={form.tipoUsuario}
                onChange={setCampo("tipoUsuario")}
                className={"cursor-pointer " + claseInput}
              >
                {form.tipoUsuario === "ADMIN" && (
                  <option value="ADMIN" disabled>
                    Administrador (elegí un tipo)
                  </option>
                )}
                {opcionesTipo.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion === "LectorPublicador"
                      ? "Lector & Publicador"
                      : opcion}
                  </option>
                ))}
              </select>
              {usuario.esAdmin && (
                <p className="mt-1 text-[11px] text-on-surface-variant/80">
                  Tu rol de administrador se mantiene aunque cambies el tipo.
                </p>
              )}
            </div>
          </div>

          <div className="flex border-t border-outline/20">
            <Boton
              type="button"
              tipo="gris"
              className="flex-1 rounded-none py-3 text-sm font-semibold"
              onClick={handleClose}
              deshabilitado={enviando}
            >
              Cancelar
            </Boton>
            <Boton
              type="submit"
              tipo="primario"
              className="flex-1 rounded-none py-3 text-sm font-semibold"
              deshabilitado={enviando}
            >
              {enviando ? "Guardando…" : "Guardar cambios"}
            </Boton>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
