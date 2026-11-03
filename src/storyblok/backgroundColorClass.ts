import type { BackgroundColor } from '../content'

export const backgroundColor = (backgroundColor: BackgroundColor): string => {
  switch (backgroundColor) {
    case 'beige':
      return 'bg-[#f4f2e9]'
    case 'white':
      return 'bg-white'
    case 'grey':
      return 'bg-[#f5f5f7]'
    case 'purple':
      return 'bg-[#D9D4FC]'
    case 'orange':
      return 'bg-[#FFE7D3]'
    case 'yellow':
      return 'bg-[#F2F1D7]'
    case 'green':
      return 'bg-[#C3F0CC]'
    case 'pink':
      return 'bg-[#FECCD4]'
    case 'blue':
      return 'bg-[#D9DFF6]'
    // Brand colors come from the `common/colors` story via CSS variables
    case 'brandPrimary':
      return 'bg-[var(--brand-primary)] text-[var(--brand-primary-text)] on-primary'
    case 'brandSecondary':
      return 'bg-[var(--brand-secondary)] text-[var(--brand-secondary-text)]'
    case 'brandLight':
      return 'bg-[var(--brand-light)] text-[var(--brand-light-text)]'
  }
}
