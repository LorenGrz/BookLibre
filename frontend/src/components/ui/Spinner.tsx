export type PropsSpinner = {
  className?: string
}

export function Spinner({ className = '' }: PropsSpinner) {
  return (
    <div
      className={`flex items-center justify-center w-full min-h-[40vh] ${className}`}
      data-testid="spinner"
    >
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-secondary/30 border-t-primary"
        aria-hidden
      />
    </div>
  )
}

