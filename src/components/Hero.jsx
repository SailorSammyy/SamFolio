import { Button } from '@/components/ui/button'
import { Icons } from '@/icons'
import Terminal from './Terminal'
import { siteData } from '@/data'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center px-5 sm:px-8 pt-16">
      <div className="max-w-5xl mx-auto w-full py-20 sm:py-28">
        <div className="reveal">

          <h1 className="font-display leading-[1.1] tracking-tight text-[clamp(2.8rem,8vw,5.5rem)] mb-6">
            <span className="text-foreground">Hey, I'm</span>
            <br />
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {siteData.name}
            </span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl font-medium mb-2">
            {siteData.role}
          </p>

          <p className="text-muted-foreground/70 text-sm sm:text-base leading-relaxed max-w-lg mb-10">
            {siteData.bio}
          </p>

          <div className="flex flex-wrap gap-3 mb-16">
            <a href="#projects">
              <Button>
                <Icons.zap className="mr-2" /> See my work
              </Button>
            </a>
            <a href="#contact">
              <Button variant="secondary">
                <Icons.mail className="mr-2" /> Get in touch
              </Button>
            </a>
          </div>
        </div>

        <div className="reveal-delay mt-16 sm:mt-20 max-w-sm">
          <Terminal />
        </div>
      </div>
    </section>
  )
}