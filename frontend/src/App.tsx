import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AppRouter } from "./router"
import { ThemeProvider, useTheme } from "./context/ThemeContext"

function AppToast() {
  const { theme } = useTheme()
  return (
    <ToastContainer
      position="bottom-right"
      theme={theme}
      autoClose={3000}
      hideProgressBar={false}
      pauseOnHover
    />
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
      <AppToast />
    </ThemeProvider>
  )
}

export default App
