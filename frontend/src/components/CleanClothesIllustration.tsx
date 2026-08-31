/** Illustration for the "Comment ça marche" page - a stack of freshly
 * folded, clean clothes. Same flat line-art style as the other brand
 * illustrations. */
export function CleanClothesIllustration() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration d'une pile de vêtements propres et pliés">
      <rect width="320" height="240" rx="24" fill="var(--color-primary-50)" />

      {/* folded shirt stack */}
      <rect x="80" y="150" width="160" height="26" rx="6" fill="white" stroke="var(--color-primary-500)" strokeWidth="3" />
      <rect x="90" y="122" width="140" height="26" rx="6" fill="white" stroke="var(--color-primary-500)" strokeWidth="3" />
      <rect x="100" y="94" width="120" height="26" rx="6" fill="white" stroke="var(--color-primary-500)" strokeWidth="3" />

      {/* fold crease lines */}
      <path d="M110 107h100M100 135h140M90 163h160" stroke="var(--color-primary-200)" strokeWidth="2.5" />

      {/* collar accents on the top item */}
      <path d="M130 94l30 14 30-14" stroke="var(--color-primary-600)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* sparkle / clean */}
      <g stroke="var(--color-primary-400)" strokeWidth="4" strokeLinecap="round">
        <path d="M240 60v20M230 70h20" />
        <path d="M64 80v14M57 87h14" />
      </g>

      {/* ground shadow */}
      <ellipse cx="160" cy="188" rx="90" ry="8" fill="var(--color-primary-100)" />
    </svg>
  )
}
