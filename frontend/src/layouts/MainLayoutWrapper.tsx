import { Outlet } from "react-router-dom"
import { NavbarSuperior } from "../components/ui/NavbarSuperior"
import { AuthProvider } from "../context/AuthContext"
import { ThemeProvider } from "../context/ThemeContext"

export function MainLayoutWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col h-screen overflow-hidden bg-background">
          <header className="flex-none">
            <NavbarSuperior />
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}