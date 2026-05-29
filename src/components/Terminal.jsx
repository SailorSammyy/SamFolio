import { useState, useRef, useEffect } from 'react'
import { siteData, skills } from '@/data'

const commands = {
  help: () => [
    { t: 'text', v: 'available commands (type one):' },
    { t: 'cmd', v: '  whoami      — the lore' },
    { t: 'cmd', v: '  skills      — what i actually know' },
    { t: 'cmd', v: '  projects    — stuff i built' },
    { t: 'cmd', v: '  contact     — where to find me' },
    { t: 'cmd', v: '  ls          — list sections' },
    { t: 'cmd', v: '  neofetch    — system info (real)' },
    { t: 'cmd', v: '  cat         — meow' },
    { t: 'cmd', v: '  rickroll    — you know' },
    { t: 'cmd', v: '  clear       — wipe terminal' },
  ],

  whoami: () => [
    { t: 'text', v: siteData.name + ' — ' + siteData.role },
    { t: 'muted', v: siteData.tagline },
    { t: 'muted', v: 'hates periods.' },
  ],

  skills: () => [
    { t: 'text', v: 'what i mess with:' },
    ...skills.map(s => ({
      t: 'text',
      v: `  ${s.label.toLowerCase()}  →  ${s.items}`,
    })),
  ],

  projects: () => [
    { t: 'text', v: 'all my real repos are pulled from github' },
    { t: 'muted', v: '→ scroll down to #projects bro' },
  ],

  contact: () => {
    const lines = []
    if (siteData.socials.github) lines.push({ t: 'text', v: `github   → ${siteData.socials.github}` })
    if (siteData.socials.linkedin) lines.push({ t: 'text', v: `linkedin → ${siteData.socials.linkedin}` })
    if (siteData.socials.twitter) lines.push({ t: 'text', v: `twitter  → ${siteData.socials.twitter}` })
    if (siteData.socials.discord) lines.push({ t: 'text', v: `discord  → ${siteData.socials.discord}` })
    if (siteData.socials.email) lines.push({ t: 'text', v: `email    → ${siteData.socials.email}` })
    return lines.length > 0 ? lines : [{ t: 'muted', v: 'no socials set up yet' }]
  },

  ls: () => [
    { t: 'text', v: 'hero/ about/ projects/ vibes/ status/ contact/' },
  ],

  pwd: () => [{ t: 'text', v: '/home/' + siteData.name.toLowerCase() + '/portfolio' }],

  date: () => [{ t: 'text', v: new Date().toString() }],

  neofetch: () => [
    { t: 'text', v: '       ⢀⣴⠾⠛⠛⠳⢦⡀        ' },
    { t: 'text', v: '      ⣠⡾⠁            ⠹⣦      ' },
    { t: 'text', v: '    ⢀⣴⠟⠁   ⣠⣤⣤⣤⡀   ⠈⠻⣦    ' },
    { t: 'text', v: '   ⢀⡾⠃    ⣼⣿⣿⣿⣿⡇     ⠹⣧   ' },
    { t: 'text', v: '  ⣰⠟      ⣿⣿⣿⣿⣿⡇      ⠻⣆  ' },
    { t: 'text', v: ' ⢰⠏       ⠙⠛⠛⠛⠋        ⠈⡇  ' },
    { t: 'text', v: ' ⣿                                ⣿  ' },
    { t: 'text', v: ' ⠹⣆        ' + siteData.name.padEnd(20) + '⣰⠏  ' },
    { t: 'text', v: '  ⠻⣆       ' + siteData.role.padEnd(20) + '⣠⠟   ' },
    { t: 'text', v: '   ⠈⠻⣦⡀   ' + 'anime · cats · hates periods'.padEnd(20) + '⢀⣴⠟⠁   ' },
    { t: 'text', v: '      ⠈⠙⠳⢦⣄⡀      ⢀⣠⡴⠞⠋      ' },
    { t: 'text', v: '           ⠉⠛⠻⠶⠶⠟⠛⠉           ' },
  ],

  cat: () => [
    { t: 'text', v: '  /\\_/\\  ' },
    { t: 'text', v: ' ( o.o ) ' },
    { t: 'text', v: '  > ^ <  ' },
    { t: 'muted', v: 'meow. cats run this house.' },
  ],

  rickroll: () => [
    { t: 'text', v: '🎵 Never gonna give you up' },
    { t: 'text', v: '🎵 Never gonna let you down' },
    { t: 'text', v: '🎵 Never gonna run around and desert you' },
    { t: 'muted', v: '(got rickrolled in a terminal lmao)' },
  ],

  clear: () => [],
}

export default function Terminal() {
  const [history, setHistory] = useState([
    { t: 'muted', v: `welcome, user. type 'help' to see commands.` },
  ])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight)
  }, [history])

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    setCommandHistory((prev) => [trimmed, ...prev])
    setHistoryIndex(-1)
    setInput('')

    if (trimmed === 'clear') {
      setHistory([])
      return
    }

    setHistory((prev) => [...prev, { t: 'prompt', v: cmd }])
    const output = commands[trimmed]
      ? commands[trimmed]()
      : [
          { t: 'error', v: `command not found: ${trimmed}. try 'help'` },
          { t: 'muted', v: 'maybe u typed it wrong, no cap.' },
        ]
    setHistory((prev) => [...prev, ...output])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIndex = Math.max(historyIndex - 1, -1)
      setHistoryIndex(newIndex)
      setInput(newIndex === -1 ? '' : commandHistory[newIndex])
    }
  }

  return (
    <div className="card bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-[10px] text-muted-foreground">~/portfolio — bash</span>
      </div>

      <div
        ref={outputRef}
        className="px-4 pt-4 pb-2 font-mono text-xs space-y-1 text-muted-foreground min-h-[140px] max-h-[220px] overflow-y-auto"
      >
        {history.map((line, i) => (
          <p
            key={i}
            className={
              line.t === 'error'
                ? 'text-red-400'
                : line.t === 'cmd'
                ? 'text-slate-400'
                : 'text-slate-300'
            }
          >
            {line.t === 'prompt' ? (
              <>
                <span className="text-primary">$</span>{' '}
                <span className="text-foreground">{line.v}</span>
              </>
            ) : (
              line.v
            )}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 pb-4 border-t border-border pt-2">
        <span className="text-primary font-mono text-xs">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command..."
          className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 caret-primary font-mono text-xs"
        />
      </div>
    </div>
  )
}