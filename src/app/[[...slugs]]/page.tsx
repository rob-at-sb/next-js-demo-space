import { getStoryPath } from '@/delivery-api'
import {
  BridgeSearchParams,
  parseBridgeSearchParams,
} from '@/BridgeSearchParams'
import {
  array,
  formatResult,
  object,
  parseString,
  withDefault,
} from 'pure-parse'
import { notFound } from 'next/navigation'
import { getStoryblokApi } from '@/lib/storyblok'
import { StoryblokStory } from '@storyblok/react/rsc'
import AppBar from '@/components/AppBar'
import { brandStyle } from '@/storyblok/brandStyle'
import Footer from '@/components/Footer'
import SiteFooter from '@/components/SiteFooter'
import type { ColorsContent, FooterContent, HeaderContent } from '@/content'
// Parsing: uncomment the lines below to perform runtime validation of the story content
// import { parseContent } from '@/content'

const resolveRelations = ['teamMembers.teamMembers']

type DynamicPageProps = {
  params: Promise<unknown>
  searchParams: Promise<unknown>
}

const parseParams = object<{ slugs: string[] }>({
  slugs: withDefault(array(parseString), []),
})

/**
 * Fetch a story from the Storyblok delivery API.
 * @throws an error if the story could not be fetched or parsed.
 * @param slugs an array of the path segments of the current page
 * @param bridgeSearchParams an object containing the parsed search parameters from the Storyblok bridge
 */
const getStory = async (
  slugs: string[],
  bridgeSearchParams: BridgeSearchParams,
) => {
  const client = getStoryblokApi()

  return await client
    .get(`cdn/stories/${getStoryPath(slugs, bridgeSearchParams)}`, {
      resolve_relations: resolveRelations,
      version: bridgeSearchParams.version,
      // To support internationalization in production, you'll want to adjust this;
      //  for example, by parsing the language code from the path.
      language:
        bridgeSearchParams.version === 'draft'
          ? bridgeSearchParams._storyblok_lang
          : 'default',
    })
    .then((result) => result.data)
    .catch((error: { status: number; message: string }) => {
      if (error.status === 404) {
        notFound()
      }
      throw new Error(`Failed to fetch story: ${error.status} ${error.message}`)
    })
}

export default async function DynamicPage(props: DynamicPageProps) {
  const paramsResult = parseParams(await props.params)

  if (paramsResult.error) {
    throw new Error(
      `Failed to parse params: the folders in the app directory are likely misconfigured ${formatResult(paramsResult)}`,
    )
  }

  const bridgeSearchParams = parseBridgeSearchParams(await props.searchParams)

  const { story } = await getStory(paramsResult.value.slugs, bridgeSearchParams)

  // Parsing: uncomment the lines below to perform runtime validation of the story content
  // const contentResult = parseContent(story.content)
  // if (contentResult.error) {
  //   throw new Error(
  //     `Failed to parse story content: ${formatResult(contentResult)}`,
  //   )
  // }
  // story.content = contentResult.value

  const [header, footer, colors] = await Promise.all([
    getGlobal<HeaderContent>('common/header', bridgeSearchParams),
    getGlobal<FooterContent>('common/footer', bridgeSearchParams),
    getGlobal<ColorsContent>('common/colors', bridgeSearchParams),
  ])

  // The header, footer and colors stories render themselves (with live preview) when opened in the editor.
  const isGlobalStory = ['header', 'footer', 'colors'].includes(
    story.content?.component,
  )

  return (
    <div style={brandStyle(colors)}>
      {isGlobalStory ? null : <AppBar header={header} />}
      <StoryblokStory
        story={story}
        bridgeOptions={{
          resolveRelations,
        }}
      />
      {isGlobalStory ? null : footer ? <SiteFooter footer={footer} /> : <Footer />}
    </div>
  )
}

/**
 * Fetch a global settings story (e.g. `common/header`).
 * Uses the same version as the current page, so drafts are previewed together.
 * Returns `undefined` if the story does not exist, so the template defaults are used.
 */
const getGlobal = async <T,>(
  slug: string,
  bridgeSearchParams: BridgeSearchParams,
): Promise<T | undefined> =>
  getStoryblokApi()
    .get(`cdn/stories/${slug}`, { version: bridgeSearchParams.version })
    .then((result) => result.data.story?.content as T)
    .catch(() => undefined)
