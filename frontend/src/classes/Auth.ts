import type { LoginData, RegisterData } from "../types/UsuarioTypes"

export type AuthMode = "login" | "register"

export type FieldConfig = {
  name: string
  label: string
  type?: string
  placeholder?: string
  isPassword?: boolean
  autocomplete?: string
  inputMode?: "email" | "text" | "search" | "tel" | "url" | "none" | "numeric" | "decimal"
  spellCheck?: boolean
}

export class Auth {
  // Campos Login
  email: string = ""
  password: string = ""

  // Campos Registro
  nombre: string = ""
  confirmarPassword: string = ""

  static loginFields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "tu@email.com…",
      autocomplete: "email",
      inputMode: "email",
      spellCheck: false,
    },
    {
      name: "password",
      label: "Contraseña",
      placeholder: "Tu contraseña…",
      isPassword: true,
      autocomplete: "current-password",
      spellCheck: false,
    },
  ]

  static registerFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre",
      placeholder: "Tu nombre…",
      autocomplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "tu@email.com…",
      autocomplete: "email",
      inputMode: "email",
      spellCheck: false,
    },
    {
      name: "password",
      label: "Contraseña",
      placeholder: "Mínimo 6 caracteres…",
      isPassword: true,
      autocomplete: "new-password",
      spellCheck: false,
    },
    {
      name: "confirmarPassword",
      label: "Repetí tu contraseña",
      placeholder: "Repetí la contraseña…",
      isPassword: true,
      autocomplete: "new-password",
      spellCheck: false,
    },
  ]

  validateLogin(): Record<string, string | undefined> {
    return {
      email: !this.email.trim() ? "El email es obligatorio" : undefined,
      password: !this.password ? "La contraseña es obligatoria" : undefined,
    }
  }

  validateRegister(): Record<string, string | undefined> {
    const password = this.password.trim()
    const confirmar = this.confirmarPassword.trim()
    return {
      nombre: !this.nombre.trim() ? "El nombre es obligatorio" : undefined,
      email: !this.email.trim()
        ? "El email es obligatorio"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
          ? "Ingresá un email válido"
          : undefined,
      password: !password
        ? "La contraseña es obligatoria"
        : password.length < 6
          ? "Mínimo 6 caracteres"
          : undefined,
      confirmarPassword: !confirmar
        ? "Repetí tu contraseña"
        : confirmar !== password
          ? "Las contraseñas no coinciden"
          : undefined,
    }
  }

  validate(mode: AuthMode): Record<string, string | undefined> {
    return mode === "login" ? this.validateLogin() : this.validateRegister()
  }

  toLoginDTO(): LoginData {
    return { email: this.email, password: this.password }
  }

  toRegisterDTO(): RegisterData {
    return {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
    }
  }
}
