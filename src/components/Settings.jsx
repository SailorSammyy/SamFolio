import * as React from 'react'
import { cn } from '@/lib/utils'

const GRADIENT_PRESETS = [
  { label: 'Deep Space',  value: 'radial-gradient(ellipse at bottom, #262626 0%, #000000 100%)' },
  { label: 'Nebula',      value: 'radial-gradient(ellipse at bottom, #1a0533 0%, #000000 100%)' },
  { label: 'Aurora',      value: 'radial-gradient(ellipse at bottom, #003322 0%, #000000 100%)' },
  { label: 'Ember',       value: 'radial-gradient(ellipse at bottom, #2d0a00 0%, #000000 100%)' },
  { label: 'Midnight',    value: 'radial-gradient(ellipse at bottom, #000d2e 0%, #000000 100%)' },
  { label: 'Void',        value: 'radial-gradient(ellipse at bottom, #000000 0%, #000000 100%)' },
]

function Slider({ label, value, min, max, step = 1, onChange, format }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-mono text-white/80">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-violet-500 cursor-pointer"
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/60">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors duration-200',
          checked ? 'bg-violet-500' : 'bg-white/15'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-white/30 pt-1">{children}</p>
  )
}

export default function BackgroundSettings({ settings, onChange }) {
  const [open, setOpen] = React.useState(false)

  const set = (key, val) => onChange({ ...settings, [key]: val })

  React.useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Background settings"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed z-50 flex flex-col bg-black/80 border border-white/10 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out',
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[85dvh]',
          'sm:bottom-auto sm:top-0 sm:left-auto sm:right-0 sm:h-full sm:w-80 sm:rounded-none sm:rounded-l-2xl sm:max-h-full',
          open
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <span className="text-sm font-semibold text-white">Background Settings</span>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          <SectionLabel>Background</SectionLabel>

          <div className="grid grid-cols-3 gap-2">
            {GRADIENT_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => set('gradient', p.value)}
                title={p.label}
                className={cn(
                  'h-10 rounded-lg border transition-all duration-150 text-[10px] text-white/70 font-medium',
                  settings.gradient === p.value
                    ? 'border-violet-500 ring-1 ring-violet-500/50 scale-[1.03]'
                    : 'border-white/10 hover:border-white/25'
                )}
                style={{ background: p.value }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <SectionLabel>Stars</SectionLabel>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60 shrink-0">Color</span>
            <div className="flex items-center gap-2 ml-auto">
              {['#ffffff', '#a78bfa', '#67e8f9', '#fde68a', '#f9a8d4'].map((c) => (
                <button
                  key={c}
                  onClick={() => set('starColor', c)}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-transform duration-150',
                    settings.starColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                  )}
                  style={{ background: c }}
                />
              ))}
              <input
                type="color"
                value={settings.starColor}
                onChange={(e) => set('starColor', e.target.value)}
                className="w-5 h-5 rounded-full cursor-pointer border-0 bg-transparent p-0"
                title="Custom color"
              />
            </div>
          </div>

          <Slider label="Count"         value={settings.starsCount}   min={10}  max={200} step={5}    onChange={(v) => set('starsCount', v)} />
          <Slider label="Size"          value={settings.starsSize}    min={0.5} max={5}   step={0.5}  onChange={(v) => set('starsSize', v)} />
          <Slider label="Opacity"       value={settings.starsOpacity} min={0.1} max={1}   step={0.05} onChange={(v) => set('starsOpacity', v)} format={(v) => v.toFixed(2)} />
          <Slider label="Speed"         value={settings.movementSpeed} min={0}  max={2}   step={0.05} onChange={(v) => set('movementSpeed', v)} format={(v) => v.toFixed(2)} />

          <SectionLabel>Glow</SectionLabel>
          <Toggle label="Enable glow" checked={settings.glowEnabled} onChange={(v) => set('glowEnabled', v)} />
          {settings.glowEnabled && (
            <Slider label="Intensity" value={settings.glowIntensity} min={1} max={40} step={1} onChange={(v) => set('glowIntensity', v)} />
          )}

          <SectionLabel>Mouse interaction</SectionLabel>

          <div className="flex items-center gap-2">
            {['attract', 'repel'].map((mode) => (
              <button
                key={mode}
                onClick={() => set('mouseGravity', mode)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 capitalize',
                  settings.mouseGravity === mode
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <Slider label="Influence radius" value={settings.mouseInfluence}  min={20}  max={300} step={5}   onChange={(v) => set('mouseInfluence', v)} />
          <Slider label="Gravity strength" value={settings.gravityStrength} min={10}  max={200} step={5}   onChange={(v) => set('gravityStrength', v)} />

          <button
            onClick={() => onChange(DEFAULT_SETTINGS)}
            className="w-full mt-2 py-2 rounded-lg text-xs text-white/40 border border-white/10 hover:border-white/20 hover:text-white/70 transition-colors duration-150"
          >
            Reset to defaults
          </button>

          <div className="h-4" />
        </div>
      </div>
    </>
  )
}

export const DEFAULT_SETTINGS = {
  gradient:       'radial-gradient(ellipse at bottom, #262626 0%, #000000 100%)',
  starColor:      '#ffffff',
  starsCount:     90,
  starsSize:      2,
  starsOpacity:   0.75,
  movementSpeed:  0.3,
  glowEnabled:    true,
  glowIntensity:  15,
  mouseGravity:   'attract',
  mouseInfluence: 120,
  gravityStrength: 75,
}
