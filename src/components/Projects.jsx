import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/icons'
import { siteData, projects as hardcodedFallback } from '@/data'

const CACHE_KEY = 'github_projects_cache'
const FALLBACK_KEY = 'github_projects_fallback'
const CACHE_DURATION = 60 * 60 * 1000

export default function Projects() {
  const [repos, setRepos] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRepos = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)

    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            setRepos(data)
            setLoading(false)
            return
          }
        } catch {}
      }
    }
    try {
      const headers = {}
      if (import.meta.env.VITE_GITHUB_TOKEN) {
        headers.Authorization = `token ${import.meta.env.VITE_GITHUB_TOKEN}`
      }

      const res = await fetch(
        `https://api.github.com/users/${siteData.githubUsername}/repos?sort=updated&per_page=6`,
        { headers }
      )

      if (res.status === 403) throw new Error('rate_limited')
      if (!res.ok) throw new Error('fetch_failed')

      const data = await res.json()
      const filtered = data.filter((repo) => !repo.fork).slice(0, 6)

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: filtered, timestamp: Date.now() })
      )
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(filtered))

      setRepos(filtered.length > 0 ? filtered : null)
    } catch (err) {
      if (err.message === 'rate_limited') {
        setError('rate_limited')
      } else {
        setError('fetch_failed')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRepos()
  }, [fetchRepos])

  const getDisplayRepos = () => {
    if (repos) return repos

    const savedFallback = localStorage.getItem(FALLBACK_KEY)
    if (savedFallback) {
      try {
        const parsed = JSON.parse(savedFallback)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch {}
    }

    return error ? hardcodedFallback : null
  }

  const displayRepos = getDisplayRepos()
  const isEmpty = !loading && !error && displayRepos && displayRepos.length === 0

  if (loading) {
    return (
      <section id="projects" className="py-24 sm:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground font-mono text-sm">
          loading repos... smth cooking fr 🔥
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-fade-up mb-14">
          <p className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-widest">
            / projects
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            stuff i've worked on
          </h2>
        </div>

        {error === 'rate_limited' && (
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground font-mono">
              github said too many requests (rate limited).
              <br />
              showing last successful data – add <span className="text-primary">VITE_GITHUB_TOKEN</span> in .env for unlimited.
            </p>
          </div>
        )}

        {error === 'fetch_failed' && (
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground font-mono">
              couldn't reach github. using last saved data.
            </p>
          </div>
        )}

        {isEmpty && (
          <div className="mb-8 text-center">
            <p className="text-muted-foreground font-mono text-sm">
              no repos found. this might be a caching issue – try{' '}
              <button
                onClick={() => {
                  localStorage.removeItem(CACHE_KEY)
                  localStorage.removeItem(FALLBACK_KEY)
                  fetchRepos(true)
                }}
                className="text-primary hover:underline font-semibold"
              >
                refreshing
              </button>
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayRepos.map((item, i) => {
            const isGitHubRepo = item.html_url
            const title = isGitHubRepo
              ? item.name.replace(/-/g, ' ')
              : item.title
            const description = isGitHubRepo
              ? item.description || 'no description, just vibes'
              : item.description
            const tags = isGitHubRepo
              ? (item.topics?.slice(0, 4) || (item.language ? [item.language] : []))
              : item.stack
            const githubUrl = isGitHubRepo ? item.html_url : item.github
            const demoUrl = isGitHubRepo ? item.homepage : item.demo

            return (
              <Card
                key={isGitHubRepo ? item.id : i}
                className="animate-fade-up p-5 sm:p-6 flex flex-col !opacity-100"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex gap-1.5 flex-wrap mb-5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono text-[0.65rem] lowercase">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="font-display text-base sm:text-lg text-foreground mb-3">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                  {description}
                </p>

                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icons.github /> GitHub
                  </a>
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icons.arrowUpRight /> Demo
                    </a>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}