import type {
  AssetLinkContent,
  EmailLinkContent,
  LinkContent,
  StoryLinkContent,
  UrlLinkContent,
} from '../delivery-api'

/**
 * Converts a story link slug to a URL path for this application.
 * `pages/mypage` -> `/mypage`
 */
export const hrefFromStoryLink = (slugs: string): string =>
  '/' + slugs.split('/').slice(1).join('/')

/**
 * Resolves any Storyblok multilink to an href usable by `next/link`.
 */
export const linkHref = (link?: LinkContent): string => {
  switch (link?.linktype) {
    case 'url':
      return (link as UrlLinkContent).cached_url
    case 'story':
      return hrefFromStoryLink((link as StoryLinkContent).cached_url)
    case 'email':
      return `mailto:${(link as EmailLinkContent).email}`
    case 'asset':
      return (link as AssetLinkContent).cached_url
    default:
      return '#'
  }
}
