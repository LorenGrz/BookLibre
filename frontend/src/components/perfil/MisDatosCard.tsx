import { User } from "lucide-react"
import type { Usuario } from "../../classes/usuario"

export type PropsMisDatosCard = {
  usuario: Usuario
}

const etiquetaTipo = (t: Usuario["tipoUsuario"]) =>
  t === "LectorPublicador" ? "Lector & Publicador" : t

export const MisDatosCard = ({ usuario }: PropsMisDatosCard) => {
  return (
    <div className="truncate text-sm text-on-surface-variant bg-surface rounded-xl border border-accent/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-accent/10">
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary-light" />
        </div>
        <h3 className="text-base font-serif font-bold text-on-surface">
          Mis Datos
        </h3>
      </div>
      <div className="px-5 pb-5 pt-1 divide-y divide-accent/10">
        {[
          { label: "Email", value: usuario.email },
          { label: "Teléfono", value: usuario.celular },
          { label: "Ciudad", value: usuario.ciudad },
          { label: "Tipo de perfil", value: etiquetaTipo(usuario.tipoUsuario) },
        ].map(({ label, value }) => (
          <div key={label} className="py-3">
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/50 uppercase">
              {label}
            </div>
            <div className="mt-0.5 text-sm font-medium text-on-surface">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
