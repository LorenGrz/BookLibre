import { useState } from "react"
import { Search } from "lucide-react"

type Props = {
  onSearch: (query: string) => void
  placeholder: string
}

export const SearchBar = ({ onSearch, placeholder }: Props) => {
  const [texto, setTexto] = useState("")

  const handleSearch = () => onSearch(texto)

  return (
    <div className="relative flex items-center w-full group">
      <div className="absolute left-3.5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors duration-200">
        <Search size={16} />
      </div>

      <input
        type="text"
        value={texto}
        placeholder={placeholder}
        className="w-full pl-10 pr-28 py-2.5 bg-surface border border-accent/20 rounded-xl outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm text-on-surface placeholder:text-on-surface-variant/30"
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
      />

      <button
        onClick={handleSearch}
        className="absolute right-1.5 px-4 py-1.5 bg-primary hover:bg-primary-dark text-background rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer"
      >
        Buscar
      </button>
    </div>
  )
}
