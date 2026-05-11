interface LogoIconProps {
  className?: string
  size?: number | string
}

export function LogoIcon({ className, size = 50 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      role="img"
    >
      {/* Tail */}
      <path
        d="M15 40 C2 40 0 54 8 56"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx="30" cy="38" rx="15" ry="11" />
      {/* Head */}
      <circle cx="44" cy="28" r="10" />
      {/* Snout */}
      <path d="M52 24 L62 28 L52 32 Z" />
      {/* Ear */}
      <circle cx="40" cy="17" r="7" />
    </svg>
  )
}
