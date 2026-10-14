import { useEffect, useRef, useState, type ReactNode } from 'react'

type LazyOnViewProps = {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
}

export default function LazyOnView({
  children,
  fallback = null,
  rootMargin = '400px 0px',
}: LazyOnViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={containerRef}>
      {isVisible ? children : fallback}
    </div>
  )
}
