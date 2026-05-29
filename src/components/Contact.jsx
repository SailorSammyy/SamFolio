import { Icons } from '@/icons'
import { siteData } from '@/data'

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="reveal max-w-lg">
          <p className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-widest">
            / contact
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-5">
            Say hello.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 text-sm sm:text-base">
            I'm always up for chatting about random shii, creating friends, or random ideas. Find me here:
          </p>

          <div className="flex flex-wrap gap-3">
            {Object.entries(siteData.socials).map(([name, url]) => {
                const Icon = Icons[name]
                if (!url || name === 'email') return null

                return (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-3 py-2 hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all"
                        >
                            {Icon && <Icon />}
                            <span className="capitalize">{name}</span>
                        </a>)
            })}
          </div>
        </div>
      </div>
    </section>
  )
}