import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Auth } from "../classes/Auth"
import type { AuthMode, FieldConfig } from "../classes/Auth"
import { authService } from "../services/AuthService"
import navBarLogo from "../assets/icons/booklibre-logo.svg"
import { NavbarSuperior } from "../components/ui/NavbarSuperior"

const linkClassName =
  "cursor-pointer text-primary font-semibold rounded hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"

const inputClassBase =
  "w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm placeholder:text-secondary-light transition-[color,box-shadow,border-color] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const submitClassName =
  "mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark active:bg-accent transition-[background-color,box-shadow,opacity] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"

const config = {
  login: {
    title: "Iniciar sesión",
    subtitle: "Ingresá a tu cuenta para gestionar tus préstamos",
    submitLabel: "Iniciar sesión",
    submittingLabel: "Ingresando…",
    fields: Auth.loginFields,
    footer: (
      <p className="text-center text-sm text-secondary opacity-80">
        ¿No tenés una cuenta?{" "}
        <Link to="/register" className={linkClassName}>
          Registrate
        </Link>
      </p>
    ),
  },
  register: {
    title: "Crear cuenta",
    subtitle: (
      <>
        Completá tus datos para unirte a{" "}
        <span translate="no">BookLibre</span>
      </>
    ),
    submitLabel: "Registrarse",
    submittingLabel: "Registrando…",
    fields: Auth.registerFields,
    footer: (
      <p className="text-center text-sm text-secondary opacity-80">
        ¿Ya tenés una cuenta?{" "}
        <Link to="/login" className={linkClassName}>
          Iniciá sesión
        </Link>
      </p>
    ),
  },
}

interface AuthPageProps {
  mode: AuthMode
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  const model = new Auth()
  const navigate = useNavigate()
  const { title, subtitle, submitLabel, submittingLabel, fields, footer } =
    config[mode]

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  )
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value }
    setValues(newValues)

    if (errors[name]) {
      const tempModel = new Auth()
      Object.assign(tempModel, newValues)
      const newErrors = tempModel.validate(mode)
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    Object.assign(model, values)

    const newErrors = model.validate(mode)
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors)
      const firstErrorField = fields.find((f) => newErrors[f.name])
      if (firstErrorField) {
        requestAnimationFrame(() => {
          document.getElementById(`auth-${firstErrorField.name}`)?.focus()
        })
      }
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === "login") {
        await authService.login(model.toLoginDTO())
        navigate("/home")
      } else {
        await authService.registro(model.toRegisterDTO())
        toast.success("¡Registro exitoso! Por favor iniciá sesión.")
        navigate("/login")
      }
    } catch (error) {
      toast.error(authService.manejarError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>
      <NavbarSuperior />
      <main
        id="main-content"
        className="min-h-screen bg-background flex items-center justify-center px-4 pt-24 pb-10"
      >
        <div className="w-full max-w-md bg-surface rounded-2xl shadow-md border border-accent p-8">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img
                src={navBarLogo}
                alt=""
                width={44}
                height={44}
                className="w-11 h-11"
              />
            </div>
            <h1 className="text-2xl font-bold text-secondary-dark text-balance">
              {title}
            </h1>
            <p className="text-sm text-secondary opacity-70 text-center text-pretty">
              {subtitle}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                error={errors[field.name]}
                onChange={(value) => handleChange(field.name, value)}
              />
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className={submitClassName}
            >
              {isSubmitting && (
                <Loader2
                  className="animate-spin motion-reduce:animate-none"
                  size={16}
                  aria-hidden
                />
              )}
              {isSubmitting ? submittingLabel : submitLabel}
            </button>

            {footer}
          </form>
        </div>
      </main>
    </>
  )
}

/* ---------- Sub-component ---------- */

interface FormFieldProps {
  field: FieldConfig
  value: string
  error?: string
  onChange: (value: string) => void
}

const FormField = ({ field, value, error, onChange }: FormFieldProps) => {
  const [show, setShow] = useState(false)
  const inputId = `auth-${field.name}`
  const errorId = `${inputId}-error`

  const inputClass = `${inputClassBase} ${
    error ? "border-red-400" : "border-accent"
  }`

  const sharedInputProps = {
    id: inputId,
    name: field.name,
    value,
    placeholder: field.placeholder,
    autoComplete: field.autocomplete,
    inputMode: field.inputMode,
    spellCheck: field.spellCheck ?? true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value),
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="text-xs font-bold text-secondary-light uppercase tracking-wider"
      >
        {field.label} <span className="text-primary">*</span>
      </label>

      {field.isPassword ? (
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            {...sharedInputProps}
            className={`${inputClass} pr-16`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-light hover:text-secondary transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {show ? (
              <EyeOff size={25} aria-hidden />
            ) : (
              <Eye size={25} aria-hidden />
            )}
          </button>
        </div>
      ) : (
        <input
          type={field.type ?? "text"}
          {...sharedInputProps}
          className={inputClass}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
