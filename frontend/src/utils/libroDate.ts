import { format, isValid, parseISO } from "date-fns"

export const parseLibroInputDate = (value: string): Date | undefined => {
  if (!value) return undefined
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

export const formatLibroInputDate = (date: Date): string => format(date, "yyyy-MM-dd")
