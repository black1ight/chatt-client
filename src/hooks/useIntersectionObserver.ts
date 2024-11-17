import { useEffect, useRef } from 'react'

type IntersectionCallback = (entry: Element) => void

interface ObserverOptions extends IntersectionObserverInit {}

const useIntersectionObserver = (
  onIntersect: IntersectionCallback,
  options?: ObserverOptions,
) => {
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry.target) // Вызов функции при пересечении
        }
      })
    }, options)

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [onIntersect, options])

  const observe = (element: Element | null) => {
    if (element) observer.current?.observe(element)
  }

  const unobserve = (element: Element | null) => {
    if (element) observer.current?.unobserve(element)
  }

  return { observe, unobserve }
}

export default useIntersectionObserver
