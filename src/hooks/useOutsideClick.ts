import { useEffect, useRef } from "react"

interface UseOutsideClickType {
  handler: () => void
  listenCapturing?: boolean
}

export function useOutsideClick({
  handler,
  listenCapturing = true,
}: UseOutsideClickType) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handler()
        }
      }

      document.addEventListener("click", handleClick, listenCapturing)

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing)
    },
    [handler, listenCapturing],
  )

  return ref
}
