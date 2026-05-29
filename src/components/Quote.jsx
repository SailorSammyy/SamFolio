import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/icons'

const CACHE_KEY = 'anime_quote_cache'
const CACHE_HOURS = 12

export default function AnimeQuote() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAndCacheQuote = useCallback(async () => {
    try {
      const res = await fetch('https://api.animechan.io/v1/quotes/random')
      if (!res.ok) throw new Error('API down')

      const json = await res.json()
      if (json.status !== 'success' || !json.data) throw new Error('bad response')

      const newQuote = {
        content: json.data.content,
        anime: json.data.anime.name,
        character: json.data.character.name,
        timestamp: Date.now(),
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(newQuote))
      return newQuote
    } catch (err) {
      console.error(err)
      return null
    }
  }, [])

  const getQuote = useCallback(
    async (forceFetch = false) => {
      setLoading(true)
      setError(null)

      if (!forceFetch) {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            const ageInHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60)
            if (ageInHours < CACHE_HOURS) {
              setQuote(parsed)
              setLoading(false)
              return
            }
          } catch {}
        }
      }

      const newQuote = await fetchAndCacheQuote()
      if (newQuote) {
        setQuote(newQuote)
      } else {
        setError('couldn’t grab a quote rn')
      }
      setLoading(false)
    },
    [fetchAndCacheQuote]
  )

  useEffect(() => {
    getQuote(false)
  }, [getQuote])

  const handleRefresh = () => {
    getQuote(true)
  }

  return (
    <section id="timeline" className="py-24 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-widest">
            / quote
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            random wisdom 🗣️
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          {loading ? (
            <div className="text-center text-muted-foreground font-mono text-sm py-16">
              summoning quote... 
            </div>
          ) : error ? (
            <div className="text-center text-muted-foreground font-mono text-sm py-16">
              {error}
              <br />
              <button
                onClick={handleRefresh}
                className="text-primary hover:underline mt-2 font-semibold"
              >
                try again
              </button>
            </div>
          ) : quote ? (
            <div className="animate-fade-up text-center space-y-4">
              <blockquote className="text-lg sm:text-xl font-medium text-foreground italic leading-relaxed">
                “{quote.content}”
              </blockquote>
              <div className="text-sm text-muted-foreground">
                — {quote.character} ·{' '}
                <span className="font-semibold text-foreground/80">{quote.anime}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}