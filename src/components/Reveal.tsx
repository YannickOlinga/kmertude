import { useEffect, useRef, useState, type ReactNode } from 'react'
import './Reveal.css'

// Fait apparaître son contenu en fondu quand il entre dans l'écran (une seule fois)
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`km-reveal${visible ? ' is-visible' : ''}`}>{children}</div>
}
