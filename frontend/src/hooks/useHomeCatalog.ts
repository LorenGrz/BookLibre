import { useState } from "react"
import {
  INITIAL_HOME_FILTERS,
  hasActiveHomeFilters,
  type HomeFiltersState,
} from "../models/homeFilters"
import type { LibroHome } from "../models/libroModel"
import { homeService } from "../services/homeService"
import { obtenerMensajeError, type ErrorPersonalizado } from "../utils/errorHandler"

const ITEMS_POR_PAGINA = 10

type UseHomeCatalogParams = {
  userId: number | null
}

export const useHomeCatalog = ({ userId }: UseHomeCatalogParams) => {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<HomeFiltersState>(INITIAL_HOME_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<HomeFiltersState>(INITIAL_HOME_FILTERS)
  const [books, setBooks] = useState<LibroHome[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [sortBy, setSortBy] = useState("titulo")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const [animating, setAnimating] = useState(false)
  const [vistaPopulares, setVistaPopulares] = useState(true)

  const search = async (
    q: string,
    f: HomeFiltersState,
    page: number = 0,
    sort: string = sortBy,
    usarPopulares: boolean = vistaPopulares,
  ) => {
    setAnimating(true)
    setLoading(true)
    setError(null)
    try {
      const isInitialLoad =
        usarPopulares &&
        q === "" &&
        !hasActiveHomeFilters(f) &&
        page === 0 &&
        sort === "titulo"

      if (isInitialLoad) {
        const data = await homeService.getPopulares(userId)
        setBooks(data.content)
        setTotalPaginas(data.totalPages)
      } else {
        const data = await homeService.search(q, f, page, ITEMS_POR_PAGINA, userId, sort)
        setBooks(data.content)
        setTotalPaginas(data.totalPages)
      }
    } catch (e: unknown) {
      setError(obtenerMensajeError(e))
    } finally {
      setLoading(false)
      setTimeout(() => setAnimating(false), 150)
    }
  }

  const loadInitialCatalog = () => search("", INITIAL_HOME_FILTERS, 0)

  const handleSearch = async (q: string) => {
    setQuery(q)
    setCurrentPage(1)
    setVistaPopulares(false)
    await search(q, appliedFilters, 0, sortBy, false)
  }

  const handleChangeFilters = (newFilters: HomeFiltersState) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = async (f: HomeFiltersState) => {
    setFilters(f)
    setAppliedFilters(f)
    setCurrentPage(1)
    setVistaPopulares(false)
    await search(query, f, 0, sortBy, false)
  }

  const handlePageChange = async (page: number) => {
    setCurrentPage(page)
    setVistaPopulares(false)
    await search(query, appliedFilters, page - 1, sortBy, false)
  }

  const handleSortChange = async (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
    setVistaPopulares(false)
    await search(query, appliedFilters, 0, sort, false)
  }

  const handleClearFilters = async () => {
    setFilters(INITIAL_HOME_FILTERS)
    setAppliedFilters(INITIAL_HOME_FILTERS)
    setCurrentPage(1)
    setVistaPopulares(false)
    await search(query, INITIAL_HOME_FILTERS, 0, sortBy, false)
  }

  const handleVerMas = async () => {
    setVistaPopulares(false)
    setQuery("")
    setFilters(INITIAL_HOME_FILTERS)
    setAppliedFilters(INITIAL_HOME_FILTERS)
    setSortBy("titulo")
    setCurrentPage(1)
    await search("", INITIAL_HOME_FILTERS, 0, "titulo", false)
  }

  const handleVerPopulares = async () => {
    setVistaPopulares(true)
    setQuery("")
    setFilters(INITIAL_HOME_FILTERS)
    setAppliedFilters(INITIAL_HOME_FILTERS)
    setSortBy("titulo")
    setCurrentPage(1)
    await search("", INITIAL_HOME_FILTERS, 0, "titulo", true)
  }

  const retrySearch = () => search(query, appliedFilters, currentPage - 1, sortBy)

  return {
    query,
    filters,
    books,
    currentPage,
    totalPaginas,
    sortBy,
    loading,
    error,
    animating,
    vistaPopulares,
    hasActiveFilters: hasActiveHomeFilters(appliedFilters),
    handleSearch,
    handleChangeFilters,
    handleApplyFilters,
    handlePageChange,
    handleSortChange,
    handleClearFilters,
    handleVerMas,
    handleVerPopulares,
    loadInitialCatalog,
    retrySearch,
  }
}
