import { useEffect, useRef } from "react"

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !ref.current) return

    const el = ref.current
    const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    function handler(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      const activeEl = document.activeElement
      if (e.shiftKey) {
        if (activeEl === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (activeEl === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [active])

  return ref
}
