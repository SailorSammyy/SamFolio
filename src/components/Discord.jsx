import { useState, useEffect, useRef } from 'react'
import { siteData } from '@/data'

export default function Discord() {
  const [data, setData] = useState(null)
  const userId = siteData.discord.userId

  useEffect(() => {
    if (!userId || userId === '000000000000000000') return

    let ws, hbInterval

    const connect = () => {
      try {
        ws = new WebSocket('wss://api.lanyard.rest/socket')
      } catch {
        fallbackREST()
        return
      }

      ws.onopen = () => ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }))

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (msg.op === 1) {
          clearInterval(hbInterval)
          hbInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN)
              ws.send(JSON.stringify({ op: 3 }))
          }, msg.d.heartbeat_interval)
        }
        if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
          setData(msg.d)
        }
      }

      ws.onclose = () => {
        clearInterval(hbInterval)
        setTimeout(connect, 5000)
      }

      ws.onerror = () => {
        ws.close()
        fallbackREST()
      }
    }

    const fallbackREST = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
        const json = await res.json()
        if (json.success) setData(json.data)
      } catch {}
    }

    connect()
    return () => {
      clearInterval(hbInterval)
      ws?.close()
    }
  }, [userId])

  const statusColor = (s) =>
    s === 'online' ? 'bg-green-500' :
    s === 'idle'   ? 'bg-yellow-500' :
    s === 'dnd'    ? 'bg-red-500' :
    'bg-gray-500'

  const statusLabel = (s) =>
    ({ online: 'Online', idle: 'Idle', dnd: 'DND', offline: 'Offline' }[s] || 'Offline')

  const renderWidget = () => {
    if (!data || !data.discord_user) {
      return (
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary/50">?</div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gray-500 border-2 border-card" />
          </div>
          <div>
            <p className="font-semibold text-sm">sam</p>
            <p className="text-xs text-muted-foreground">offline</p>
          </div>
        </div>
      )
    }

    const u = data.discord_user
    const status = data.discord_status
    const avatar = u.avatar
      ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=64`
      : null
    const custom = data.activities?.find((a) => a.type === 4)
    const main = data.activities?.find((a) => a.type !== 4)
    const spotify = data.spotify
    const isSpotify = data.listening_to_spotify && spotify

    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img src={avatar} className="w-10 h-10 rounded-full" alt={u.username} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary/50">?</div>
          )}
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColor(status)}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{u.username}</p>
          {custom?.state && (
            <p className="text-xs text-muted-foreground italic">{custom.state}</p>
          )}

          {isSpotify ? (
            <>
              <p className="text-xs text-muted-foreground font-mono">Listening to Spotify</p>
              <div className="flex items-center gap-2 mt-1">
                <img src={spotify.album_art_url} className="w-8 h-8 rounded" alt="" />
                <div>
                  <p className="text-xs font-semibold truncate">{spotify.song}</p>
                  <p className="text-[0.6rem] text-muted-foreground">{spotify.artist}</p>
                </div>
              </div>
            </>
          ) : main ? (
            <p className="text-xs text-muted-foreground font-mono truncate">
              {{ 0: 'Playing', 1: 'Streaming', 3: 'Watching', 5: 'Competing in' }[main.type] || ''}{' '}
              {main.name}
            </p>
          ) : null}
        </div>

        <span className="text-[0.6rem] px-2 py-0.5 border border-border rounded text-muted-foreground capitalize">
          {statusLabel(status)}
        </span>
      </div>
    )
  }

  return (
    <section id="discord" className="py-24 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="reveal mb-14">
          <p className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-widest">
            / status
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            Where to find me.
          </h2>
          <p className="text-muted-foreground text-sm mt-4 max-w-sm">
            If I'm online, feel free to reach out.
          </p>
        </div>

        <div className="reveal max-w-sm">
          <div className="p-4 border border-border rounded-lg bg-card">
            {renderWidget()}
          </div>
        </div>
      </div>
    </section>
  )
}