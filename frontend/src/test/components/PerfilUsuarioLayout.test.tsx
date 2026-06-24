import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { PerfilUsuarioLayout } from '../../layouts/PerfilUsuarioLayout'

const hoisted = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockObtenerIdUsuarioActual: vi.fn(),
  mockObtenerUsuario: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => hoisted.mockNavigate,
    Outlet: () => <div data-testid="perfil-outlet">Perfil hijo</div>,
  }
})

vi.mock('../../services/AuthService', () => ({
  authService: {
    obtenerIdUsuarioActual: hoisted.mockObtenerIdUsuarioActual,
  },
}))

vi.mock('../../services/usuarioService', () => ({
  usuarioService: {
    obtenerUsuario: hoisted.mockObtenerUsuario,
  },
}))

describe('PerfilUsuarioLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra error y navega a login al reintentar si no hay sesión', async () => {
    hoisted.mockObtenerIdUsuarioActual.mockReturnValue(null)

    render(<PerfilUsuarioLayout />)

    expect(await screen.findByTestId('error-card')).toBeInTheDocument()
    expect(screen.getByText('Debés iniciar sesión para ver tu perfil.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(hoisted.mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('renderiza el Outlet cuando carga usuario correctamente', async () => {
    hoisted.mockObtenerIdUsuarioActual.mockReturnValue(7)
    hoisted.mockObtenerUsuario.mockResolvedValueOnce({
      id: 7,
      nombre: 'Ana',
      desc: 'Lectora',
      email: 'ana@mail.com',
      celular: '123',
      ciudad: 'CABA',
      tipoUsuario: 'Lector',
      bibliokarmas: 22,
    })

    render(<PerfilUsuarioLayout />)

    await waitFor(() => {
      expect(screen.getByTestId('perfil-outlet')).toBeInTheDocument()
    })
  })
})
