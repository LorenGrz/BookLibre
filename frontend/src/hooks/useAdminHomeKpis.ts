import { useState } from "react"
import type { AdminKpiResumenResponse } from "../models/libroModel"
import { adminService } from "../services/adminService"

type UseAdminHomeKpisParams = {
  esAdmin: boolean
}

export const useAdminHomeKpis = ({ esAdmin }: UseAdminHomeKpisParams) => {
  const [adminKpis, setAdminKpis] = useState<AdminKpiResumenResponse | null>(null)
  const [loadingAdminKpis, setLoadingAdminKpis] = useState(false)
  const [errorAdminKpis, setErrorAdminKpis] = useState("")

  const loadAdminKpis = async () => {
    if (!esAdmin) return

    setLoadingAdminKpis(true)
    setErrorAdminKpis("")
    try {
      const data = await adminService.obtenerResumenKpisHome()
      setAdminKpis(data)
    } catch {
      setErrorAdminKpis("No se pudieron cargar los KPIs")
    } finally {
      setLoadingAdminKpis(false)
    }
  }

  return {
    adminKpis,
    loadingAdminKpis,
    errorAdminKpis,
    loadAdminKpis,
  }
}
