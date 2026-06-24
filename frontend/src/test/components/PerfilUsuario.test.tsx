import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { PerfilUsuario } from '../../pages/PerfilUsuario'
import { Usuario } from '../../classes/usuario'
import { toast } from 'react-toastify'

const mockSetUsuario = vi.fn()
const mockNavigate = vi.fn()
const mockUseOutletContext = vi.fn()
const mockObtenerLibrosUsuarioPerfil = vi.fn()
const mockActualizarUsuario = vi.fn()
const mockObtenerClicksDePublicador = vi.fn()
const mockSetUsuarioContext = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useOutletContext: () => mockUseOutletContext(),
  }
})

vi.mock('../../services/libroService', () => ({
  libroService: {
    obtenerLibrosUsuarioPerfil: (...args: unknown[]) => mockObtenerLibrosUsuarioPerfil(...args),
    eliminarLibro: vi.fn(),
  },
}))

vi.mock('../../services/usuarioService', () => ({
  usuarioService: {
    actualizarUsuario: (...args: unknown[]) => mockActualizarUsuario(...args),
    obtenerClicksDePublicador: (...args: unknown[]) => mockObtenerClicksDePublicador(...args),
  },
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../../utils/hooks', async () => {
  const actual = await vi.importActual<typeof import('../../utils/hooks')>('../../utils/hooks')
  return {
    ...actual,
    useAuthContext: () => ({
      setUsuarioContext: mockSetUsuarioContext,
    }),
  }
})

vi.mock('../../components/perfil/PerfilResumen', () => ({
  PerfilResumen: ({ onEditar }: { onEditar: () => void }) => (
    <button type="button" onClick={onEditar}>Abrir modal</button>
  ),
}))

vi.mock('../../components/perfil/MisDatosCard', () => ({
  MisDatosCard: () => <div>MisDatosCard</div>,
}))

vi.mock('../../components/perfil/EstadisticaCard', () => ({
  EstadisticaCard: () => <div>EstadisticaCard</div>,
}))

vi.mock('../../components/perfil/GestionMisLibros', () => ({
  GestionMisLibros: () => <div>GestionMisLibros</div>,
}))

vi.mock('../../components/perfil/ModalEditarPerfil', () => ({
  ModalEditarPerfil: ({
    onGuardar,
  }: {
    onGuardar: (u: Usuario) => Promise<void>
  }) => (
    <button
      type="button"
      onClick={() =>
        void onGuardar(
          new Usuario({
            id: 1,
            nombre: 'Ana 2',
            desc: 'desc',
            email: 'ana@mail.com',
            celular: '123',
            ciudad: 'CABA',
            tipoUsuario: 'Lector',
            bibliokarmas: 10,
            imagenUrl: 'img-local',
          })
        )
      }
    >
      Guardar mock
    </button>
  ),
}))

describe('PerfilUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseOutletContext.mockReturnValue({
      usuario: new Usuario({
        id: 1,
        nombre: 'Ana',
        desc: 'desc',
        email: 'ana@mail.com',
        celular: '123',
        ciudad: 'CABA',
        tipoUsuario: 'Lector',
        bibliokarmas: 10,
        imagenUrl: 'img-original',
      }),
      setUsuario: mockSetUsuario,
    })
    mockObtenerLibrosUsuarioPerfil.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 })
    mockObtenerClicksDePublicador.mockResolvedValue([])
  })

  it('actualiza usuario desde modal y conserva imagen local si backend no la devuelve', async () => {
    mockActualizarUsuario.mockResolvedValueOnce({
      nombre: 'Ana 2',
      desc: 'desc',
      email: 'ana@mail.com',
      celular: '123',
      ciudad: 'CABA',
      tipoUsuario: 'Lector',
      bibliokarmas: 10,
      imagenUrl: undefined,
    })

    render(<PerfilUsuario />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir modal' }))
    fireEvent.click(screen.getByRole('button', { name: 'Guardar mock' }))

    await waitFor(() => {
      expect(mockSetUsuario).toHaveBeenCalledTimes(1)
      expect(mockSetUsuarioContext).toHaveBeenCalledTimes(1)
      const usuarioSeteado = mockSetUsuario.mock.calls[0][0] as Usuario
      expect(usuarioSeteado.nombre).toBe('Ana 2')
      expect(usuarioSeteado.imagenUrl).toBe('img-local')
      const usuarioContexto = mockSetUsuarioContext.mock.calls[0][0] as Usuario
      expect(usuarioContexto.imagenUrl).toBe('img-local')
      expect(toast.success).toHaveBeenCalledWith('¡Perfil actualizado con éxito!')
    })
  })

  it('actualiza usuario desde modal y conserva imagen local si backend devuelve imagen nula', async () => {
    mockActualizarUsuario.mockResolvedValueOnce({
      nombre: 'Ana 2',
      desc: 'desc',
      email: 'ana@mail.com',
      celular: '123',
      ciudad: 'CABA',
      tipoUsuario: 'Lector',
      bibliokarmas: 10,
      imagenUrl: null,
    })

    render(<PerfilUsuario />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir modal' }))
    fireEvent.click(screen.getByRole('button', { name: 'Guardar mock' }))

    await waitFor(() => {
      expect(mockSetUsuario).toHaveBeenCalledTimes(1)
      expect(mockSetUsuarioContext).toHaveBeenCalledTimes(1)
      const usuarioSeteado = mockSetUsuario.mock.calls[0][0] as Usuario
      expect(usuarioSeteado.imagenUrl).toBe('img-local')
      const usuarioContexto = mockSetUsuarioContext.mock.calls[0][0] as Usuario
      expect(usuarioContexto.imagenUrl).toBe('img-local')
    })
  })

  it('no muestra GestionMisLibros cuando el usuario es solo lector', async () => {
    render(<PerfilUsuario />)

    expect(screen.queryByText('GestionMisLibros')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(mockObtenerLibrosUsuarioPerfil).not.toHaveBeenCalled()
    })
  })

  it('muestra GestionMisLibros y carga libros cuando puede publicar', async () => {
    mockUseOutletContext.mockReturnValue({
      usuario: new Usuario({
        id: 1,
        nombre: 'Ana',
        desc: 'desc',
        email: 'ana@mail.com',
        celular: '123',
        ciudad: 'CABA',
        tipoUsuario: 'Publicador',
        bibliokarmas: 10,
        imagenUrl: 'img-original',
      }),
      setUsuario: mockSetUsuario,
    })

    render(<PerfilUsuario />)

    expect(screen.getByText('GestionMisLibros')).toBeInTheDocument()
    await waitFor(() => {
      expect(mockObtenerLibrosUsuarioPerfil).toHaveBeenCalled()
    })
  })

  it('muestra el banner con el libro mas clickeado del publicador', async () => {
    mockUseOutletContext.mockReturnValue({
      usuario: new Usuario({
        id: 1,
        nombre: 'Ana',
        desc: 'desc',
        email: 'ana@mail.com',
        celular: '123',
        ciudad: 'CABA',
        tipoUsuario: 'Publicador',
        bibliokarmas: 10,
        imagenUrl: 'img-original',
      }),
      setUsuario: mockSetUsuario,
    })

    mockObtenerClicksDePublicador.mockResolvedValueOnce([
      { libroId: 10, libroTitulo: 'Dune', nombreUsuario: 'u1@mail.com', fechaHora: '2026-05-28T10:00:00' },
      { libroId: 10, libroTitulo: 'Dune', nombreUsuario: 'u2@mail.com', fechaHora: '2026-05-28T10:05:00' },
      { libroId: 11, libroTitulo: '1984', nombreUsuario: 'u3@mail.com', fechaHora: '2026-05-28T10:10:00' },
    ])

    render(<PerfilUsuario />)

    const bannerHeading = await screen.findByText('Tu libro más clickeado')
    const banner = bannerHeading.parentElement

    expect(banner).not.toBeNull()
    expect(within(banner as HTMLElement).getByText('Dune')).toBeInTheDocument()
    expect(within(banner as HTMLElement).getByText('(2 visitas)')).toBeInTheDocument()
  })
})
