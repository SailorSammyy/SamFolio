import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-delay')
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    revealEls.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}