import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars"
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

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]">
        <StarsBackground
          starColor="#FFF"
          className="absolute inset-0"
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
    </>
  )
}