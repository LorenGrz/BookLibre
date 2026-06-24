import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { TrendingUp, LogOut, Menu, X, Sun, Moon } from "lucide-react"
import navBarLogo from "../../assets/icons/booklibre-logo.svg"
import { authService } from "../../services/AuthService"
import { tokenService } from "../../services/tokenService"
import { useState } from "react"
import { Avatar } from "./Avatar"
import { useAuthContext } from "../../utils/hooks"
import { useTheme } from "../../context/ThemeContext"

interface NavItemProps {
  text: string
  to: string
  onClick?: () => void
}

export const NavItem = ({ text, to, onClick }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `text-[11px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 ${
            isActive
              ? "text-primary-light border-b-2 border-primary-light pb-0.5"
              : "text-on-surface-variant hover:text-on-surface"
          }`
        }
      >
        {text}
      </NavLink>
    </li>
  )
}

export const NavbarSuperior = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const { usuario } = useAuthContext()
  const estaLogueado = !!usuario && !!usuario.id
  const nombre = usuario?.nombre ?? "Usuario"
  const bibliokarmas = usuario?.bibliokarmas ?? 0
  const navigate = useNavigate()
  const location = useLocation()
  const enPaginaAuth =
    location.pathname === "/login" || location.pathname === "/register"

  const esAdmin = usuario?.esAdmin ?? tokenService.getEsAdmin()

  const items: NavItemProps[] = [
    { text: "Inicio", to: "/home" },
    ...(estaLogueado && !enPaginaAuth
      ? [
          { text: "Mis Préstamos", to: "/mis-prestamos" },
          { text: "Perfil", to: "/perfil" },
        ]
      : []),
    ...(esAdmin && estaLogueado && !enPaginaAuth ? [{ text: "Consultas", to: "/consultas" }] : []),
  ]

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  const cerrarMenu = () => setMenuMovilAbierto(false)

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      }
      className="cursor-pointer p-2 rounded-lg border border-accent/30 text-on-surface-variant hover:text-primary-light hover:border-primary-light/40 hover:bg-primary-light/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {theme === "dark" ? (
        <Sun size={15} aria-hidden />
      ) : (
        <Moon size={15} aria-hidden />
      )}
    </button>
  )

  return (
    <nav className="bg-background/80 backdrop-blur-md fixed top-0 z-50 w-full border-b border-accent/20 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
      <div className="flex justify-between items-center w-full px-6 md:px-10 py-3.5">
        {/* Logo + nav links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <img src={navBarLogo} alt="BookLibre" className="w-6 h-6" />
            <span
              translate="no"
              className="text-xl font-serif font-bold tracking-tight text-primary-light dark:text-primary-light [html[data-theme='light']_&]:text-primary-dark"
            >
              BookLibre
            </span>
          </div>
          <ul className="hidden md:flex gap-7 list-none items-center">
            {items.map((item) => (
              <NavItem key={item.to} text={item.text} to={item.to} />
            ))}
          </ul>
        </div>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {estaLogueado ? (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg border border-accent/20">
                <TrendingUp size={13} className="text-primary-light" />
                <span className="text-primary-light text-sm font-bold">
                  {bibliokarmas}
                </span>
                <span className="text-[10px] text-on-surface-variant/50 font-medium">
                  BK
                </span>
              </div>
              <Avatar
                src={usuario?.imagenUrl ?? null}
                alt={nombre}
                tamaño="chico"
                className="!w-8 !h-8 !rounded-lg !text-sm"
              />
              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-danger border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-danger-bg/30 hover:border-danger/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
              >
                <LogOut size={13} aria-hidden />
                Salir
              </button>
            </>
          ) : (
            !enPaginaAuth && (
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-background bg-primary-light hover:bg-primary rounded-lg px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Iniciar Sesión
              </button>
            )
          )}
        </div>

        {/* Acciones móvil */}
        <div className="flex md:hidden items-center gap-2.5">
          <ThemeToggle />
          {estaLogueado ? (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface rounded-lg border border-accent/20">
                <TrendingUp size={12} className="text-primary-light" />
                <span className="text-primary-light text-xs font-bold">
                  {bibliokarmas}
                </span>
              </div>
              <Avatar
                src={usuario?.imagenUrl ?? null}
                alt={nombre}
                tamaño="chico"
                className="!rounded-lg !text-sm"
              />
              <button
                onClick={() => setMenuMovilAbierto((v) => !v)}
                className="p-1.5 rounded-lg border border-accent/30 text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
                aria-label="Abrir menú"
              >
                {menuMovilAbierto ? <X size={17} /> : <Menu size={17} />}
              </button>
            </>
          ) : (
            !enPaginaAuth && (
              <button
                onClick={() => navigate("/login")}
                className="text-[11px] font-bold uppercase tracking-wider text-background bg-primary-light hover:bg-primary rounded-lg px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Ingresar
              </button>
            )
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {estaLogueado && menuMovilAbierto && (
        <div className="md:hidden border-t border-accent/15 bg-background/95 backdrop-blur-md px-6 py-5 flex flex-col gap-5">
          <ul className="flex flex-col gap-4 list-none">
            {items.map((item) => (
              <NavItem
                key={item.to}
                text={item.text}
                to={item.to}
                onClick={cerrarMenu}
              />
            ))}
          </ul>
          <div className="border-t border-accent/15 pt-4">
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-danger transition-colors"
            >
              <LogOut size={14} aria-hidden />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
