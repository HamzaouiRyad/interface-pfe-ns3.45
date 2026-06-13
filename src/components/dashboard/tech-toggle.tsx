'use client'

import type { SimTech } from '@/types/ns3'

interface Props {
  value    : SimTech
  onChange : (tech: SimTech) => void
  disabled?: boolean
}

const TECHS: { id: SimTech; label: string; sub: string }[] = [
  { id: '4g', label: '4G',  sub: 'LTE'    },
  { id: '5g', label: '5G',  sub: 'NR'     },
]

const STYLES: Record<SimTech, { active: string; ring: string }> = {
  '4g': {
    active: 'bg-sky-600    text-white border-sky-500    shadow-sky-900/60',
    ring  : 'ring-sky-500',
  },
  '5g': {
    active: 'bg-violet-600 text-white border-violet-500 shadow-violet-900/60',
    ring  : 'ring-violet-500',
  },
}

export function TechToggle({ value, onChange, disabled = false }: Props) {
  return (
    <div
      className="flex rounded-md overflow-hidden border border-slate-700 shrink-0"
      role="group"
      aria-label="Select radio technology"
    >
      {TECHS.map((tech, i) => {
        const isActive = value === tech.id
        const { active, ring } = STYLES[tech.id]
        return (
          <button
            key={tech.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tech.id)}
            className={[
              'relative flex items-center gap-1 px-3 py-1 text-xs font-mono transition-all duration-150',
              'focus-visible:outline-none focus-visible:z-10',
              isActive
                ? `${active} shadow-inner focus-visible:ring-1 ${ring}`
                : 'text-foreground hover:text-foreground hover:bg-slate-800',
              disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              i > 0 ? 'border-l border-slate-700' : '',
            ].join(' ')}
            aria-pressed={isActive}
          >
            <span className="font-bold text-sm leading-none">{tech.label}</span>
            <span className={`text-[9px] leading-none ${isActive ? 'opacity-80' : 'opacity-50'}`}>
              {tech.sub}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/60" />
            )}
          </button>
        )
      })}
    </div>
  )
}
