import { describe, it, expect } from "vitest"
import { Usuario } from "../classes/usuario"

describe("Usuario — validar()", () => {
  const base = () =>
    new Usuario({
      id: 1,
      nombre: "Juan",
      desc: "desc",
      email: "juan@mail.com",
      celular: "123456789",
      ciudad: "Rosario",
      tipoUsuario: "Lector",
      bibliokarmas: 10,
      fechaRegistro: "2021-01-01",
    })

  it("no retorna errores si nombre y email son válidos", () => {
    const u = base()
    const validado = u.validar()

    expect(Object.keys(validado.errors).length).toBe(0)
  })

  it("retorna error si nombre está vacío", () => {
    const u = base()
    u.nombre = ""
    const validado = u.validar()

    expect(validado.errors.nombre).toBe("El nombre es obligatorio")
  })

  it("retorna error si nombre tiene solo espacios", () => {
    const u = base()
    u.nombre = "   "
    const validado = u.validar()

    expect(validado.errors.nombre).toBe("El nombre es obligatorio")
  })

  it("retorna error si email está vacío", () => {
    const u = base()
    u.email = ""
    const validado = u.validar()

    expect(validado.errors.email).toBe("El email es obligatorio")
  })

  it("retorna error si email tiene formato inválido", () => {
    const u = base()
    u.email = "no-es-un-email"
    const validado = u.validar()

    expect(validado.errors.email).toBe("El email no es válido")
  })

  it("acepta email con espacios extremos (trim)", () => {
    const u = base()
    u.email = "  juan@mail.com  "
    const validado = u.validar()

    expect(Object.keys(validado.errors).length).toBe(0)
  })
})

describe("Usuario — setCampo()", () => {
  it("limpia errors al setear un campo y permite volver a validar", () => {
    const u = new Usuario({
      id: 1,
      nombre: "Juan",
      desc: "desc",
      email: "juan@mail.com",
      celular: "123456789",
      ciudad: "Rosario",
      tipoUsuario: "Lector",
      bibliokarmas: 10,
    })

    const inicial = u.validar()
    expect(Object.keys(inicial.errors).length).toBe(0)

    const u2 = u.setCampo("nombre", "   ")
    const validado = u2.validar()

    expect(validado.errors.nombre).toBe("El nombre es obligatorio")
  })
})
