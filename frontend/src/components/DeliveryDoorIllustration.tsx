/** Illustration for the homepage CTA - a package delivered to the doorstep,
 * on brand (same flat line-art style as HeroIllustration). */
export function DeliveryDoorIllustration() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration d'un colis livré devant une porte">
      {/* house facade */}
      <path d="M40 100 160 30 280 100V210a6 6 0 0 1-6 6H46a6 6 0 0 1-6-6V100Z" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="4" strokeLinejoin="round" />
      {/* roof line accent */}
      <path d="M20 108 160 26l140 82" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* door */}
      <rect x="132" y="128" width="56" height="88" rx="4" fill="white" fillOpacity="0.16" stroke="white" strokeWidth="3.5" />
      <circle cx="176" cy="174" r="3" fill="white" />

      {/* window */}
      <rect x="66" y="128" width="40" height="40" rx="4" fill="white" fillOpacity="0.16" stroke="white" strokeWidth="3.5" />
      <path d="M86 128v40M66 148h40" stroke="white" strokeWidth="2.5" />

      {/* package on the step */}
      <g>
        <rect x="200" y="176" width="58" height="40" rx="3" fill="white" />
        <path d="M200 194h58M229 176v40" stroke="var(--color-primary-500)" strokeWidth="3" />
        <path d="M212 176v-10a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v10" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* delivered checkmark badge */}
      <circle cx="252" cy="168" r="16" fill="var(--color-primary-500)" />
      <path d="M245 168l5 5 9-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* doorstep */}
      <path d="M20 216h280" stroke="white" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
