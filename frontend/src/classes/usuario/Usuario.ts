import type { TipoUsuario } from "../../models/usuarioModel"

export type UsuarioData = {
  id: number
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: TipoUsuario
  bibliokarmas: number
  fechaRegistro?: string
  imagenUrl?: string | null
  reservados: number
  leidos: number
  esAdmin: boolean
}

export type ErrorsUsuario = Partial<Record<keyof UsuarioData, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Regex simple para celular: acepta +, números y debe tener entre 7 y 15 dígitos
const CELULAR_REGEX = /^\+?[0-9]{7,15}$/
export class Usuario implements UsuarioData {
  id: number = 0
  nombre: string = ""
  desc: string = ""
  email: string = ""
  celular: string = ""
  ciudad: string = ""
  tipoUsuario: TipoUsuario = "Lector"
  bibliokarmas: number = 0
  fechaRegistro?: string
  imagenUrl?: string | null
  reservados: number = 0
  leidos: number = 0
  esAdmin: boolean = false
  errors: ErrorsUsuario = {}

  constructor(props?: Partial<UsuarioData>) {
    if (props) Object.assign(this, props)
  }

  validar(): Usuario {
    const err: ErrorsUsuario = {}

    // Validar Nombre (Max 50 caracteres por ejemplo)
    if (!this.nombre.trim()) {
      err.nombre = "El nombre es obligatorio"
    } else if (this.nombre.length > 50) {
      err.nombre = "El nombre es demasiado largo (máx. 50 caracteres)"
    }

    // Validar Email
    if (!this.email.trim()) {
      err.email = "El email es obligatorio"
    } else if (!EMAIL_REGEX.test(this.email.trim())) {
      err.email = "El email no es válido"
    }

    // Validar Descripción (Largo de un Tweet: 280 caracteres)
    if (this.desc.length > 280) {
      err.desc = "La descripción no puede superar los 280 caracteres"
    }

    // Validar Celular
    if (this.celular && !CELULAR_REGEX.test(this.celular.trim())) {
      err.celular = "El número de celular no es válido"
    }

    // Validar Ciudad
    if (this.ciudad.length > 100) {
      err.ciudad = "El nombre de la ciudad es demasiado largo"
    }

    return new Usuario({ ...this, errors: err })
  }

  setCampo<K extends keyof UsuarioData>(
    campo: K,
    valor: UsuarioData[K],
  ): Usuario {
    return new Usuario({ ...this, [campo]: valor, errors: {} })
  }
}
