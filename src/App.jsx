import * as React from 'react'
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars"
import BackgroundSettings, { DEFAULT_SETTINGS } from "./components/Settings"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Projects from "./components/Projects"
import AnimeQuote from "./components/Quote"
import Discord from "./components/Discord"
import Contact from "./components/Contact"
import useScrollReveal from "./hooks/useScrollReveal"

export default function App() {
  useScrollReveal()
  const [settings, setSettings] = React.useState(() => {
    try {
      const saved = localStorage.getItem('bg-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  React.useEffect(() => {
    localStorage.setItem('bg-settings', JSON.stringify(settings))
  }, [settings])

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{ background: settings.gradient }}
      >
        <GravityStarsBackground
          className="absolute inset-0"
          starColor={settings.starColor}
          starsCount={settings.starsCount}
          starsSize={settings.starsSize}
          starsOpacity={settings.starsOpacity}
          movementSpeed={settings.movementSpeed}
          glowEnabled={settings.glowEnabled}
          glowIntensity={settings.glowIntensity}
          mouseGravity={settings.mouseGravity}
          mouseInfluence={settings.mouseInfluence}
          gravityStrength={settings.gravityStrength}
        />
      </div>

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <AnimeQuote />
        <Discord />
        <Contact />
      </main>

      <BackgroundSettings settings={settings} onChange={setSettings} />
    </>
  )
}
