import { useEffect, useMemo, useState } from 'react'
import type { ContributionLink } from '../data/party'
import {
  brideProfile,
  bridesmaids as fallbackBridesmaids,
  itinerary as fallbackItinerary,
  partyInfo as fallbackPartyInfo,
} from '../data/party'

type PartyInfo = typeof fallbackPartyInfo
type Bridesmaid = (typeof fallbackBridesmaids)[number]
type ItineraryItem = (typeof fallbackItinerary)[number]

const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  PAST: 'past',
} as const

const EVENTS_API_BASE = (import.meta.env.VITE_EVENTS_API_BASE ?? '/api/events').replace(/\/$/, '')
const configuredSlug = import.meta.env.VITE_EVENT_SLUG ?? '2025-palm-springs'

const RESERVED_SEGMENTS = new Set(['toast', 'bridesmaid'])

const deriveSlugDetails = () => {
  if (typeof window === 'undefined') {
    return { slug: null, basePath: '' }
  }

  const pathSegments = window.location.pathname.split('/').filter(Boolean)
  if (!pathSegments.length) {
    return { slug: null, basePath: '' }
  }

  const [first, second] = pathSegments
  const firstLower = first.toLowerCase()

  if ((firstLower === 'event' || firstLower === 'events') && second) {
    return {
      slug: second,
      basePath: `/${first}/${second}`,
    }
  }

  if (!RESERVED_SEGMENTS.has(firstLower)) {
    return {
      slug: first,
      basePath: `/${first}`,
    }
  }

  return { slug: null, basePath: '' }
}

const { slug: slugFromPath, basePath: basePathFromPath } = deriveSlugDetails()
const DEFAULT_EVENT_SLUG = slugFromPath ?? configuredSlug
const DEFAULT_BASE_PATH =
  basePathFromPath || (slugFromPath ? `/${slugFromPath}` : '')

type ApiBridesmaid = Partial<Bridesmaid> & { SK?: string; PK?: string }

type DrinkLinkMap = Record<string, { link?: string; blurb?: string; handle?: string }>

type PartyApiResponse = {
  meta?: Partial<PartyInfo> & {
    heroHighlights?: string[]
    drinkLinks?: DrinkLinkMap
    itinerary?: Partial<ItineraryItem>[]
  }
  bridesmaids?: ApiBridesmaid[]
  bride?: Partial<typeof brideProfile>
}

const fallbackImage = fallbackBridesmaids[0]?.image ?? '/qr-placeholder.svg'
const normalizeContributionLinks = (input?: DrinkLinkMap): ContributionLink[] => {
  if (!input) {
    return fallbackPartyInfo.contributionLinks
  }

  const formatPlatform = (platform: string) =>
    platform
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const links = Object.entries(input)
    .map(([platform, details]) => {
      if (!details?.link) {
        return null
      }

      const derivedHandle =
        details.handle ??
        details.link.split('/').filter(Boolean).pop() ??
        undefined

      return {
        platform: formatPlatform(platform),
        url: details.link,
        handle: derivedHandle,
        note: details.blurb,
      } satisfies ContributionLink
    })
    .filter((entry): entry is ContributionLink => Boolean(entry))

  return links.length ? links : fallbackPartyInfo.contributionLinks
}
const normalizeItinerary = (input?: Partial<ItineraryItem>[]): ItineraryItem[] => {
  if (!Array.isArray(input)) {
    return fallbackItinerary
  }

  const normalized = input
    .map((entry) => {
      if (!entry?.day || !entry?.title || !entry?.detail) {
        return null
      }
      return {
        day: entry.day,
        title: entry.title,
        detail: entry.detail,
      } satisfies ItineraryItem
    })
    .filter((item): item is ItineraryItem => Boolean(item))

  return normalized.length ? normalized : fallbackItinerary
}
const computeEventStatus = (dates: string) => {
  if (!dates) {
    return EVENT_STATUS.UPCOMING
  }

  const [rangeStart, rangeEnd] = dates.split('-').map((segment) => segment.trim())
  const currentYear = new Date().getFullYear()
  const startDate = rangeStart ? new Date(`${rangeStart} ${currentYear}`) : null
  const endDate = rangeEnd ? new Date(`${rangeEnd} ${currentYear}`) : null
  const today = new Date()

  if (startDate && today < startDate) {
    return EVENT_STATUS.UPCOMING
  }

  if (endDate && today > endDate) {
    return EVENT_STATUS.PAST
  }

  if (startDate && endDate && today >= startDate && today <= endDate) {
    return EVENT_STATUS.LIVE
  }

  return EVENT_STATUS.UPCOMING
}

const usePartyInfo = (eventSlug = DEFAULT_EVENT_SLUG) => {
  const [partyInfo, setPartyInfo] = useState<PartyInfo>(fallbackPartyInfo)
  const [bridesmaidList, setBridesmaidList] = useState<Bridesmaid[]>(fallbackBridesmaids)
  const [bride, setBride] = useState(brideProfile)
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(fallbackItinerary)
  const [statusLabel, setStatusLabel] = useState<'upcoming' | 'live' | 'past'>('upcoming')
  const [basePath] = useState(DEFAULT_BASE_PATH)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const endpoint = useMemo(() => `${EVENTS_API_BASE}/${eventSlug}`, [eventSlug])

  useEffect(() => {
    const controller = new AbortController()
    setHydrated(false)

    const fetchMeta = async () => {
      setStatus('loading')
      setError(null)
      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }
        const payload = (await response.json()) as PartyApiResponse
        if (payload.meta) {
          const highlights =
            payload.meta.heroHighlights ??
            payload.meta.highlights ??
            fallbackPartyInfo.highlights
          const contributionLinks = normalizeContributionLinks(payload.meta.drinkLinks)
          const itinerary = normalizeItinerary(payload.meta.itinerary)
          let themeVariant = fallbackPartyInfo.theme
          let themeTagline = payload.meta.themeTagline ?? fallbackPartyInfo.themeTagline ?? fallbackPartyInfo.theme
          const coEventSlug = payload.meta.coEvent ?? fallbackPartyInfo.coEvent

          if (typeof payload.meta.theme === 'string') {
            const normalizedTheme = payload.meta.theme.toLowerCase()
            if (normalizedTheme === 'boys' || normalizedTheme === 'ladies') {
              themeVariant = normalizedTheme
            } else {
              themeTagline = payload.meta.theme
            }
          }

          const mergedMeta: PartyInfo = {
            ...fallbackPartyInfo,
            ...payload.meta,
            highlights,
            contributionLinks,
            coEvent: coEventSlug,
            theme: themeVariant,
            themeTagline,
          }
          setPartyInfo(mergedMeta)
          setItineraryItems(itinerary)
          setStatusLabel(computeEventStatus(mergedMeta.dates))
        } else {
          setPartyInfo(fallbackPartyInfo)
          setItineraryItems(fallbackItinerary)
          setStatusLabel(computeEventStatus(fallbackPartyInfo.dates))
        }

        if (payload.bride) {
          const candidateId =
            payload.bride.id ??
            payload.bride.SK?.split('#')[1] ??
            payload.bride.name?.toLowerCase().replace(/\s+/g, '-') ??
            brideProfile.id

          setBride({
            ...brideProfile,
            ...payload.bride,
            id: candidateId,
            image: payload.bride.image ?? brideProfile.image,
          })
        } else {
          setBride(brideProfile)
        }

        if (payload.bridesmaids?.length) {
          const normalizedBridesmaids = payload.bridesmaids
            .map((entry) => {
              const idFromField = entry.id
              const idFromSK = entry.SK?.split('#')[1]
              const idFromName = entry.name?.toLowerCase().replace(/\s+/g, '-')
              const id = idFromField ?? idFromSK ?? idFromName

              if (!id) {
                return null
              }

              return {
                id,
                name: entry.name ?? 'Crew Member',
                role: entry.role ?? 'Bridesmaid',
                bio:
                  entry.bio ??
                  'Celebrating the bride with us this weekend. Check back soon for their full bio!',
                image: entry.image ?? fallbackImage ?? '',
                socials: entry.socials,
                vibe: entry.vibe,
              } satisfies Bridesmaid
            })
            .filter((entry): entry is Bridesmaid => Boolean(entry && entry.image))
          setBridesmaidList(normalizedBridesmaids)
        } else {
          setBridesmaidList([])
        }
        setStatus('success')
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }
        console.error('Failed to load party info', fetchError)
        setStatus('error')
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load party info')
      } finally {
        if (!controller.signal.aborted) {
          setHydrated(true)
        }
      }
    }

    fetchMeta()

    return () => {
      controller.abort()
    }
  }, [endpoint])

  return {
    partyInfo,
    bride,
    bridesmaids: bridesmaidList,
    itinerary: itineraryItems,
    eventStatus: statusLabel,
    eventBasePath: basePath,
    eventSlug: eventSlug,
    loading: status === 'loading',
    error,
    hydrated,
  }
}

export default usePartyInfo
