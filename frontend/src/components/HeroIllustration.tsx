/** On-brand hero illustration (shirt + delivery) — replaces the generic
 * Vite scaffold placeholder image, which clashed with the orange/white
 * identity from the cahier (§1.4, §22). */
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration d'un service de pressing avec livraison">
      <rect width="420" height="340" rx="24" fill="var(--color-primary-50)" />

      {/* hanger + shirt */}
      <g>
        <circle cx="180" cy="60" r="10" fill="none" stroke="var(--color-neutral-400)" strokeWidth="4" />
        <path d="M180 70v14" stroke="var(--color-neutral-400)" strokeWidth="4" strokeLinecap="round" />
        <path d="M110 122 180 84l70 38" stroke="var(--color-neutral-400)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path
          d="M148 108c10-14 22-20 32-20s22 6 32 20l38 22-18 26-20-11v88a10 10 0 0 1-10 10h-44a10 10 0 0 1-10-10v-88l-20 11-18-26z"
          fill="white"
          stroke="var(--color-primary-500)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </g>

      {/* sparkle / clean */}
      <g stroke="var(--color-primary-400)" strokeWidth="4" strokeLinecap="round">
        <path d="M92 96v18M83 105h18" />
        <path d="M300 150v14M293 157h14" />
      </g>

      {/* delivery box */}
      <g>
        <rect x="230" y="220" width="110" height="78" rx="8" fill="var(--color-primary-600)" />
        <path d="M230 246h110M285 220v78" stroke="white" strokeOpacity="0.5" strokeWidth="3" />
        <path d="M244 220l16-22h50l16 22" fill="none" stroke="var(--color-primary-700)" strokeWidth="4" strokeLinejoin="round" />
      </g>

      {/* ground shadow */}
      <ellipse cx="210" cy="312" rx="150" ry="10" fill="var(--color-primary-100)" />

      {/* map pin (delivery) */}
      <g transform="translate(60,220)">
        <path d="M20 0C9 0 0 9 0 20c0 15 20 34 20 34s20-19 20-34C40 9 31 0 20 0z" fill="var(--color-primary-500)" />
        <circle cx="20" cy="19" r="8" fill="white" />
      </g>
    </svg>
  )
}
