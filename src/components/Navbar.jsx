import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/icons'
import { siteData } from '@/data'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const navLinks = [
    { label: 'about',    id: 'about' },
    { label: 'projects', id: 'projects' },
    { label: 'vibes',    id: 'timeline' },
    { label: 'status',   id: 'discord' },
    { label: 'contact',  id: 'contact' },
  ]

  useEffect(() => {
    const sections = navLinks
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const mostVisible = visible.reduce((prev, current) =>
            (prev.intersectionRatio > current.intersectionRatio ? prev : current)
          )
          setActiveSection(mostVisible.target.id)
        }
      },
      {
        rootMargin: '0px 0px -50% 0px',
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-0 left-0 z-50 w-full backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 flex items-center justify-between h-14 sm:h-16">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center text-primary text-xs font-mono group-hover:bg-primary/20 transition-colors">
            s
          </span>
          <span className="font-mono text-xs text-white/70 group-hover:text-white transition-colors">
            ~<span className="text-white">/sam</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, id }) => {
            const isActive = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`relative px-2 py-1 rounded font-mono text-[0.7rem] transition-colors
                  ${isActive ? 'text-primary bg-primary/10' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2 after:h-[1px] after:w-4/5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200
                  ${isActive ? 'after:scale-x-100' : ''}
                `}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <a href={`mailto:${siteData.socials.email}`} className="hidden md:inline-flex">
          <Button variant="secondary" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white">
            <Icons.mail className="mr-2" /> say hi
          </Button>
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] p-2 rounded-md hover:bg-white/5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-white/60 transition-all duration-300 ml-auto ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black/60 backdrop-blur-lg px-5 py-5">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, id }) => {
              const isActive = activeSection === id
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`relative px-2 py-2 rounded font-mono text-[0.7rem] transition-colors
                    ${isActive ? 'text-primary bg-primary/10' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              )
            })}
          </nav>
          <a
            href={`mailto:${siteData.socials.email}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <Icons.mail /> say hi
          </a>
        </div>
      )}
    </header>
  )
}