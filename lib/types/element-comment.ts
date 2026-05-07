export interface ElementComment {
  id: string
  text: string
  createdAt: number
}

export function createElementComment(text: string): ElementComment {
  const trimmed = text.trim()
  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    text: trimmed,
    createdAt: Date.now(),
  }
}
