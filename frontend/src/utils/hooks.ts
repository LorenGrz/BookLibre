import { useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export const useOnInit = (initialCallBack: () => void) => {
  useEffect(() => {
    initialCallBack()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useAlIniciar = useOnInit

export const useAuthContext = () => {
  return useContext(AuthContext)
}