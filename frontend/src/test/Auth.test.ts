import { describe, it, expect, beforeEach } from 'vitest'
import { Auth } from '../classes/Auth'

describe('Auth - validateLogin', () => {

  let auth: Auth

  beforeEach(() => { auth = new Auth() })

  it('retorna errores si ambos campos están vacíos', () => {
    const errors = auth.validateLogin()
    expect(errors.email).toBe('El email es obligatorio')
    expect(errors.password).toBe('La contraseña es obligatoria')
  })

  it('no retorna errores con credenciales válidas', () => {
    auth.email = 'test@mail.com'
    auth.password = '123456'
    const errors = auth.validateLogin()
    expect(errors.email).toBeUndefined()
    expect(errors.password).toBeUndefined()
  })

  it('email con solo espacios es considerado vacío', () => {
    auth.email = '   '
    auth.password = '123456'
    expect(auth.validateLogin().email).toBe('El email es obligatorio')
  })

  it('retorna error solo de email si password está completo', () => {
    auth.password = '123456'
    const errors = auth.validateLogin()
    expect(errors.email).toBeDefined()
    expect(errors.password).toBeUndefined()
  })

  it('retorna error solo de password si email está completo', () => {
    auth.email = 'test@mail.com'
    const errors = auth.validateLogin()
    expect(errors.email).toBeUndefined()
    expect(errors.password).toBeDefined()
  })
})

describe('Auth - validateRegister', () => {

  let auth: Auth

  // Genera un Auth con todos los campos válidos
  beforeEach(() => {
    auth = new Auth()
    auth.nombre = 'Juan'
    auth.email = 'juan@mail.com'
    auth.password = '123456'
    auth.confirmarPassword = '123456'
  })

  it('no retorna errores con todos los campos válidos', () => {
    const errors = auth.validateRegister()
    expect(Object.values(errors).every(v => v === undefined)).toBe(true)
  })

  it('retorna error si nombre está vacío', () => {
    auth.nombre = ''
    expect(auth.validateRegister().nombre).toBe('El nombre es obligatorio')
  })

  it('nombre con solo espacios es considerado vacío', () => {
    auth.nombre = '   '
    expect(auth.validateRegister().nombre).toBe('El nombre es obligatorio')
  })

  it('retorna error si email está vacío', () => {
    auth.email = ''
    expect(auth.validateRegister().email).toBe('El email es obligatorio')
  })

  it('retorna error si el formato de email es inválido', () => {
    auth.email = 'no-es-un-email'
    expect(auth.validateRegister().email).toBe('Ingresá un email válido')
  })

  it('acepta emails con subdominios', () => {
    auth.email = 'user@sub.domain.com'
    expect(auth.validateRegister().email).toBeUndefined()
  })

  it('retorna error si password está vacío', () => {
    auth.password = ''
    expect(auth.validateRegister().password).toBe('La contraseña es obligatoria')
  })

  it('retorna error si password tiene menos de 6 caracteres', () => {
    auth.password = '123'
    auth.confirmarPassword = '123'
    expect(auth.validateRegister().password).toBe('Mínimo 6 caracteres')
  })

  it('acepta password con exactamente 6 caracteres', () => {
    auth.password = '123456'
    auth.confirmarPassword = '123456'
    expect(auth.validateRegister().password).toBeUndefined()
  })

  it('retorna error si confirmarPassword está vacío', () => {
    auth.confirmarPassword = ''
    expect(auth.validateRegister().confirmarPassword).toBe('Repetí tu contraseña')
  })

  it('retorna error si las contraseñas no coinciden', () => {
    auth.confirmarPassword = 'diferente123'
    expect(auth.validateRegister().confirmarPassword).toBe('Las contraseñas no coinciden')
  })

  it('la comparación de contraseñas ignora espacios extremos', () => {
    auth.password = '123456'
    auth.confirmarPassword = '  123456  '
    // trim() en ambos lados — ver Auth.ts línea confirmarPassword
    expect(auth.validateRegister().confirmarPassword).toBeUndefined()
  })
})

describe('Auth - validate (dispatcher)', () => {

  let auth: Auth
  beforeEach(() => { auth = new Auth() })

  it('en modo login solo valida email y password', () => {
    const errors = auth.validate('login')
    expect(errors.email).toBeDefined()
    expect(errors.password).toBeDefined()
    expect(errors.nombre).toBeUndefined()
    expect(errors.confirmarPassword).toBeUndefined()
  })

  it('en modo register valida todos los campos', () => {
    const errors = auth.validate('register')
    expect(errors.nombre).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.password).toBeDefined()
    expect(errors.confirmarPassword).toBeDefined()
  })
})

describe('Auth - toLoginDTO', () => {

  it('mapea solo email y password', () => {
    const auth = new Auth()
    auth.email = 'test@mail.com'
    auth.password = 'secret'
    auth.nombre = 'Juan' // no debe aparecer

    const dto = auth.toLoginDTO()

    expect(dto).toEqual({ email: 'test@mail.com', password: 'secret' })
    expect(dto).not.toHaveProperty('nombre')
    expect(dto).not.toHaveProperty('confirmarPassword')
  })
})

describe('Auth - toRegisterDTO', () => {

  it('mapea todos los campos de registro', () => {
    const auth = new Auth()
    auth.nombre = 'Juan'
    auth.email = 'juan@mail.com'
    auth.password = '123456'
    auth.confirmarPassword = '123456'

    expect(auth.toRegisterDTO()).toEqual({
      nombre: 'Juan',
      email: 'juan@mail.com',
      password: '123456',
    })
    expect(auth.toRegisterDTO()).not.toHaveProperty('confirmarPassword')
  })
})