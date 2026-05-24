import type { SVGProps } from 'react'

export function RatMDLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="200" height="60" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(25, 40)">
        <path d="M 0 20 Q 2 28, 5 22 Q 8 16, 12 20" stroke="#39FF14" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="30" cy="22" rx="18" ry="13" fill="#39FF14"/>
        <circle cx="52" cy="20" r="10" fill="#39FF14"/>
        <ellipse cx="54" cy="12" rx="4.5" ry="6" fill="#39FF14"/>
        <circle cx="54" cy="19" r="1.8" fill="#000000"/>
        <line x1="62" y1="17" x2="70" y2="15" stroke="#39FF14" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="62" y1="20" x2="70" y2="20" stroke="#39FF14" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="62" y1="23" x2="70" y2="25" stroke="#39FF14" strokeWidth="1.2" strokeLinecap="round"/>
        <ellipse cx="26" cy="34" rx="3" ry="2" fill="#39FF14"/>
        <ellipse cx="36" cy="34" rx="3" ry="2" fill="#39FF14"/>
      </g>
      <text x="130" y="72" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" fontSize="48">
        <tspan fill="#F0F0EE">Rat</tspan>
        <tspan fill="#39FF14">MD</tspan>
      </text>
    </svg>
  )
}

export function RatMDIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(6, 20)">
        <path d="M 0 12 Q 1 18, 3 13 Q 5 9, 8 12" stroke="#39FF14" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="20" cy="13" rx="12" ry="9" fill="#39FF14"/>
        <circle cx="35" cy="12" r="7" fill="#39FF14"/>
        <ellipse cx="37" cy="6" rx="3" ry="4" fill="#39FF14"/>
        <circle cx="37" cy="11" r="1.3" fill="#000000"/>
        <line x1="42" y1="10" x2="48" y2="9" stroke="#39FF14" strokeWidth="1" strokeLinecap="round"/>
        <line x1="42" y1="12" x2="48" y2="12" stroke="#39FF14" strokeWidth="1" strokeLinecap="round"/>
        <line x1="42" y1="14" x2="48" y2="15" stroke="#39FF14" strokeWidth="1" strokeLinecap="round"/>
        <ellipse cx="17" cy="21" rx="2" ry="1.5" fill="#39FF14"/>
        <ellipse cx="24" cy="21" rx="2" ry="1.5" fill="#39FF14"/>
      </g>
    </svg>
  )
}
