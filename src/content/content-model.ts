import type {
  AssetContent,
  BlockContent,
  LinkContent,
  RichTextContent,
  Story,
} from '../delivery-api'

export type Content =
  | UnknownContent
  | PageContent
  | TestimonialContent
  | TestimonialsContent
  | CardsContent
  | CardContent
  | HeroContent
  | TabsContent
  | TabContent
  | TeamMembersContent
  | TeamMemberContent
  | ButtonContent
  | HeaderContent
  | NavLinkContent
  | ColorsContent
  | VideoSectionContent
  | ImageBannerContent
  | ServiceCardsContent
  | ServiceCardContent
  | FooterContent
  | FeatureCardsContent
  | FeatureCardContent

/**
 * When the parsing of a component fails, fall back fack to this component.
 * Parsing could fail for several reasons; for example,
 * 1. You changed the schema of a component without updating the content.
 * 2. You have modeled the content incorrectly in your type alias and parser
 */
export type UnknownContent = BlockContent<{
  component: 'unknown'
}>

export type PageContent = BlockContent<{
  component: 'page'
  body: Content[]
}>

export type BackgroundColor =
  | 'beige'
  | 'white'
  | 'grey'
  | 'purple'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'pink'
  | 'blue'
  | 'brandPrimary'
  | 'brandSecondary'
  | 'brandLight'

export type TestimonialContent = BlockContent<{
  component: 'testimonial'
  quote: string
  image?: AssetContent
  name: string
  title: string
  imageBackgroundColor: BackgroundColor
}>

export type TestimonialsContent = BlockContent<{
  component: 'testimonials'
  title: string
  description: string
  testimonials: Content[]
}>

export type CardsContent = BlockContent<{
  component: 'cards'
  description: RichTextContent
  cards: CardContent[]
}>

export type CardContent = BlockContent<{
  component: 'card'
  description: RichTextContent
  icon?: AssetContent
}>

export type HeroContent = BlockContent<{
  component: 'hero'
  image?: AssetContent
  imagePadding: boolean
  textAlignment: 'left' | 'right' | 'center'
  description: RichTextContent
  backgroundColor: BackgroundColor
  buttons: ButtonContent[]
}>

export type TabsContent = BlockContent<{
  component: 'tabs'
  description: RichTextContent
  tabs: TabContent[]
}>

export type TabContent = BlockContent<{
  component: 'tab'
  title: string
  content: Content[]
}>

export type TeamMemberContent = BlockContent<{
  component: 'teamMember'
  name: string
  title: string
  image?: AssetContent
  backgroundColor: BackgroundColor
}>

export type TeamMembersContent = BlockContent<{
  component: 'teamMembers'
  description: RichTextContent
  teamMembers: (Story & {
    content: TeamMemberContent
  })[]
}>

export type ButtonContent = BlockContent<{
  component: 'button'
  text: string
  link?: LinkContent
  color: 'primary' | 'secondary' | 'brandPrimary' | 'brandSecondary'
}>

export type NavLinkContent = BlockContent<{
  component: 'navLink'
  label: string
  link?: LinkContent
}>

export type HeaderContent = BlockContent<{
  component: 'header'
  logo?: AssetContent
  brandName?: string
  navLinks?: NavLinkContent[]
  ctaButtons?: ButtonContent[]
}>

export type ColorsContent = BlockContent<{
  component: 'colors'
  primary?: string
  primaryText?: string
  secondary?: string
  secondaryText?: string
  light?: string
  lightText?: string
  accent?: string
}>

export type VideoSectionContent = BlockContent<{
  component: 'videoSection'
  headline?: string
  headlineSecondLine?: string
  description?: RichTextContent
  buttons?: ButtonContent[]
  videoSource: 'youtube' | 'asset'
  youtubeUrl?: string
  videoAsset?: AssetContent
  poster?: AssetContent
  videoTitle?: string
  videoPosition?: 'left' | 'right'
  backgroundColor?: BackgroundColor
}>

export type ImageBannerContent = BlockContent<{
  component: 'imageBanner'
  headline?: string
  headlineHighlight?: string
  highlightColor?: 'accent' | 'brandPrimary' | 'dark'
  description?: RichTextContent
  buttons?: ButtonContent[]
  image?: AssetContent
  cardPosition?: 'left' | 'center' | 'right'
  height?: 'small' | 'medium' | 'large'
}>

export type ServiceCardContent = BlockContent<{
  component: 'serviceCard'
  image?: AssetContent
  title: string
  description?: RichTextContent
  links?: NavLinkContent[]
  footerLink?: NavLinkContent[]
  footerIcon?: 'none' | 'send' | 'mailbox' | 'parcel' | 'search'
}>

export type ServiceCardsContent = BlockContent<{
  component: 'serviceCards'
  title?: string
  description?: string
  cards: ServiceCardContent[]
  backgroundColor?: BackgroundColor
}>

export type FooterColumnContent = BlockContent<{
  component: 'footerColumn'
  title: string
  links?: NavLinkContent[]
}>

export type PartnerLogoContent = BlockContent<{
  component: 'partnerLogo'
  name: string
  logo?: AssetContent
  label?: string
  link?: LinkContent
}>

export type FooterContent = BlockContent<{
  component: 'footer'
  columns?: FooterColumnContent[]
  partnersTitle?: string
  partners?: PartnerLogoContent[]
  legalLinks?: NavLinkContent[]
  copyright?: string
}>

export type FeatureCardContent = BlockContent<{
  component: 'featureCard'
  image?: AssetContent
  imageFit?: 'contain' | 'cover'
  title: string
  description?: string
  link?: LinkContent
}>

export type FeatureCardsContent = BlockContent<{
  component: 'featureCards'
  title?: string
  description?: string
  cards: FeatureCardContent[]
  imageBackground?: 'brandPrimary' | 'brandSecondary' | 'brandLight' | 'grey'
}>
