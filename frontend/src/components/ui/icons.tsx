import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
)
export const IconPackage = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>
)
export const IconMapPin = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
)
export const IconUser = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>
)
export const IconTruck = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 7h11v9H3z" /><path d="M14 11h4l3 3v2h-7z" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="17.5" cy="18.5" r="1.5" /></svg>
)
export const IconClipboard = (p: IconProps) => (
  <svg {...base(p)}><rect x="6" y="4" width="12" height="17" rx="1.5" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 10h6M9 14h6" /></svg>
)
export const IconUsers = (p: IconProps) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c1.2-3.6 3.9-5.2 6.5-5.2s5.3 1.6 6.5 5.2" /><circle cx="17" cy="9" r="2.6" /><path d="M15.5 14.4c2 .3 3.9 1.7 4.9 4.6" /></svg>
)
export const IconSettings = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.7.7 1.2 1.5 1.4h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>
)
export const IconTag = (p: IconProps) => (
  <svg {...base(p)}><path d="M12.6 2H4a2 2 0 0 0-2 2v8.6c0 .5.2 1 .6 1.4l9.4 9.4c.8.8 2 .8 2.8 0l7.6-7.6c.8-.8.8-2 0-2.8L13 2.6c-.4-.4-.9-.6-1.4-.6Z" /><circle cx="8" cy="8" r="1.5" /></svg>
)
export const IconShirt = (p: IconProps) => (
  <svg {...base(p)}><path d="M8 3 3 6l2 4 2-1v11h10V9l2 1 2-4-5-3-1.5 1.5a2.5 2.5 0 0 1-3 0Z" /></svg>
)
export const IconClock = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
)
export const IconCreditCard = (p: IconProps) => (
  <svg {...base(p)}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19" /></svg>
)
export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
)
export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
)
export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>
)
export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" /></svg>
)
export const IconEdit = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
)
export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
)
export const IconLocation = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="5" /></svg>
)
export const IconBox = (p: IconProps) => (
  <svg {...base(p)}><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /><path d="M20.7 7 12 2 3.3 7v10L12 22l8.7-5Z" /></svg>
)
