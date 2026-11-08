import type { SVGProps } from 'react'

export function RatMDLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="200" height="60" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(25, 40)">
        <path d="M 0 20 Q 2 28, 5 22 Q 8 16, 12 20" style={{ stroke: 'var(--color-accent)' }} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="30" cy="22" rx="18" ry="13" style={{ fill: 'var(--color-accent)' }}/>
        <circle cx="52" cy="20" r="10" style={{ fill: 'var(--color-accent)' }}/>
        <ellipse cx="54" cy="12" rx="4.5" ry="6" style={{ fill: 'var(--color-accent)' }}/>
        <circle cx="54" cy="19" r="1.8" style={{ fill: 'var(--color-bg)' }}/>
        <line x1="62" y1="17" x2="70" y2="15" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="62" y1="20" x2="70" y2="20" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="62" y1="23" x2="70" y2="25" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1.2" strokeLinecap="round"/>
        <ellipse cx="26" cy="34" rx="3" ry="2" style={{ fill: 'var(--color-accent)' }}/>
        <ellipse cx="36" cy="34" rx="3" ry="2" style={{ fill: 'var(--color-accent)' }}/>
      </g>
      <text x="130" y="72" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" fontSize="48">
        <tspan style={{ fill: 'var(--color-text)' }}>Rat</tspan>
        <tspan style={{ fill: 'var(--color-accent)' }}>MD</tspan>
      </text>
    </svg>
  )
}

export function RatMDIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(6, 20)">
        <path d="M 0 12 Q 1 18, 3 13 Q 5 9, 8 12" style={{ stroke: 'var(--color-accent)' }} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="20" cy="13" rx="12" ry="9" style={{ fill: 'var(--color-accent)' }}/>
        <circle cx="35" cy="12" r="7" style={{ fill: 'var(--color-accent)' }}/>
        <ellipse cx="37" cy="6" rx="3" ry="4" style={{ fill: 'var(--color-accent)' }}/>
        <circle cx="37" cy="11" r="1.3" style={{ fill: 'var(--color-bg)' }}/>
        <line x1="42" y1="10" x2="48" y2="9" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1" strokeLinecap="round"/>
        <line x1="42" y1="12" x2="48" y2="12" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1" strokeLinecap="round"/>
        <line x1="42" y1="14" x2="48" y2="15" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1" strokeLinecap="round"/>
        <ellipse cx="17" cy="21" rx="2" ry="1.5" style={{ fill: 'var(--color-accent)' }}/>
        <ellipse cx="24" cy="21" rx="2" ry="1.5" style={{ fill: 'var(--color-accent)' }}/>
      </g>
    </svg>
  )
}
