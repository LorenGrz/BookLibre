import { Settings } from "lucide-react"
import { Avatar } from "../ui"
import type { Usuario } from "../../classes/usuario"

export type PropsPerfilResumen = {
  usuario: Usuario
  onEditar: () => void
}
export const PerfilResumen = ({ usuario, onEditar }: PropsPerfilResumen) => {
  return (
    <section className="group bg-surface rounded-xl border border-accent/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-4 md:gap-5 min-w-0">
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
          <Avatar
            tamaño="grande"
            src={usuario.imagenUrl ?? null}
            alt={usuario.nombre}
          />
        </div>
        <div className="min-w-0">
          <div className="text-xl md:text-2xl font-serif font-bold text-on-surface truncate">
            {usuario.nombre}
          </div>
          {usuario.desc && (
            <div className="text-primary/70 text-sm mt-1 font-medium truncate italic">
              {usuario.desc}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-on-surface-variant font-medium">
            {usuario.fechaRegistro && (
              <span className="flex items-center gap-1">
                <span className="text-accent/60">📅</span>
                Se unió en {new Date(usuario.fechaRegistro).getFullYear()}
              </span>
            )}
            <span className="text-accent/40">·</span>
            <span className="flex items-center gap-1">
              <span className="text-accent/60">📍</span>
              {usuario.ciudad}
            </span>
            <span className="text-accent/40">·</span>
            <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary-light text-xs font-bold">
              ✦ {usuario.bibliokarmas} Bibliokarmas
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0 flex sm:justify-end">
        <button
          onClick={onEditar}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant border border-accent/20 rounded hover:bg-surface-high hover:text-on-surface transition-all"
        >
          <Settings className="h-3.5 w-3.5" />
          Editar Perfil
        </button>
      </div>
    </section>
  )
}
