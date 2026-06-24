import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper"
import { Home } from "./pages/Home"
import { DetallePrestamos } from "./pages/DetallePrestamos"
import { EditarLibro } from "./pages/EditarLibro.tsx"
import { AuthPage } from "./pages/AuthPage"
import { PerfilUsuario } from "./pages/PerfilUsuario"
import { PerfilUsuarioLayout } from "./layouts/PerfilUsuarioLayout"
import { DetalleLibro } from "./pages/DetalleLibro"
import { VerMasResenias } from "./pages/VerMasResenias"
import { ConsultasAdmin } from "./pages/ConsultasAdmin.tsx"
import { NotFound } from "./pages/NotFound"
import { RequireTipoUsuario } from "./components/auth/RequireTipoUsuario"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<AuthPage key="login" mode="login" />} />
        <Route path="register" element={<AuthPage key="register" mode="register" />} />
        <Route element={<MainLayoutWrapper />}>
          <Route index element={<Navigate to="/home" />} />

          <Route path="home" element={<Home />} />
          <Route path="mis-prestamos" element={<DetallePrestamos />} />

          <Route path="libros/:id" element={<DetalleLibro />} />
          <Route path="libros/:id/resenias" element={<VerMasResenias />} />
          <Route
            path="libros/nuevo/editar"
            element={
              <RequireTipoUsuario
                permitidos={["Publicador", "LectorPublicador"]}
                redirectTo="/perfil"
              >
                <EditarLibro />
              </RequireTipoUsuario>
            }
          />
          <Route
            path="libros/:id/editar"
            element={
              <RequireTipoUsuario
                permitidos={["Publicador", "LectorPublicador"]}
                redirectTo="/perfil"
              >
                <EditarLibro />
              </RequireTipoUsuario>
            }
          />
          <Route path="perfil" element={<PerfilUsuarioLayout />}>
            <Route index element={<PerfilUsuario />} />
          </Route>

          <Route path="consultas" element={<ConsultasAdmin />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
