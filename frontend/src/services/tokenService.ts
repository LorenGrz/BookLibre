const ID_USUARIO_KEY = 'idUsuario'
const NOMBRE_USUARIO_KEY = 'nombreUsuario'
const TIPO_USUARIO_KEY = 'tipoUsuario'
const ES_ADMIN_KEY = 'esAdmin'

export const tokenService = {

  getIdUsuario(): number | null {
    const id = localStorage.getItem(ID_USUARIO_KEY)
    return id ? Number(id) : null
  },

  setIdUsuario(id: number): void {
    localStorage.setItem(ID_USUARIO_KEY, id.toString())
  },

  setTipoUsuario(tipo: string) : void {
    localStorage.setItem(TIPO_USUARIO_KEY, tipo)
  },

  getTipoUsuario() : string | null {
    return localStorage.getItem(TIPO_USUARIO_KEY)
  },

  setEsAdmin(esAdmin: boolean): void {
    localStorage.setItem(ES_ADMIN_KEY, String(esAdmin))
  },

  getEsAdmin(): boolean {
    return localStorage.getItem(ES_ADMIN_KEY) === 'true'
  },

  getNombreUsuario(): string | null {
    return localStorage.getItem(NOMBRE_USUARIO_KEY)
  },

  setNombreUsuario(nombre: string): void {
    localStorage.setItem(NOMBRE_USUARIO_KEY, nombre)
  },

  estaAutenticado(): boolean {
    return tokenService.getIdUsuario() !== null
  },

  clearAll(): void {
    localStorage.removeItem(ID_USUARIO_KEY)
    localStorage.removeItem(NOMBRE_USUARIO_KEY)
    localStorage.removeItem(TIPO_USUARIO_KEY)
    localStorage.removeItem(ES_ADMIN_KEY)
  },
}
