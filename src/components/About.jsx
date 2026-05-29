import { Card } from '@/components/ui/card'
import { skills } from '@/data'

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="reveal mb-14">
          <p className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-widest">
            / abt me rq
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            who even is this guy ?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-14 items-start">
          <div className="reveal space-y-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
            <p>
              fr just a nonchalant dude who started coding cuz its fun n shii.
              anime is literally always on the line, cats are the GOAT, and periods?
              I HATE IT
            </p>
          </div>

          <div className="reveal-delay grid grid-cols-2 gap-3">
            {skills.map((s) => (
              <Card key={s.label} className="p-4 hover:border-primary/30 transition-colors">
                <p className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {s.items}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}