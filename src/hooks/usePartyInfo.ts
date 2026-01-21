import { useEffect, useMemo, useState } from 'react'
import { brideProfile, bridesmaids as fallbackBridesmaids, partyInfo as fallbackPartyInfo } from '../data/party'

type PartyInfo = typeof fallbackPartyInfo
type Bridesmaid = (typeof fallbackBridesmaids)[number]

const EVENTS_API_BASE = (import.meta.env.VITE_EVENTS_API_BASE ?? '/api/events').replace(/\/$/, '')
const configuredSlug = import.meta.env.VITE_EVENT_SLUG ?? '2025-palm-springs'

const RESERVED_SEGMENTS = new Set(['toast', 'bridesmaid', 'event', 'events'])

const deriveSlugFromPath = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const url = new URL(window.location.href)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  const slugCandidate = pathSegments.find((segment) => !RESERVED_SEGMENTS.has(segment.toLowerCase()))

  if (slugCandidate) {
    return slugCandidate
  }

  const apiSlug = url.pathname.split('/').filter(Boolean).pop()
  return apiSlug ?? null
}

const DEFAULT_EVENT_SLUG = deriveSlugFromPath() ?? configuredSlug

type ApiBridesmaid = Partial<Bridesmaid> & { SK?: string; PK?: string }

type PartyApiResponse = {
  meta?: Partial<PartyInfo>
  bridesmaids?: ApiBridesmaid[]
  bride?: Partial<typeof brideProfile>
}

const fallbackImage = fallbackBridesmaids[0]?.image ?? '/qr-placeholder.svg'

const usePartyInfo = (eventSlug = DEFAULT_EVENT_SLUG) => {
  const [partyInfo, setPartyInfo] = useState<PartyInfo>(fallbackPartyInfo)
  const [bridesmaidList, setBridesmaidList] = useState<Bridesmaid[]>(fallbackBridesmaids)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const endpoint = useMemo(() => `${EVENTS_API_BASE}/${eventSlug}`, [eventSlug])

  useEffect(() => {
    const controller = new AbortController()

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
          setPartyInfo((prev) => ({ ...prev, ...payload.meta }))
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

          if (normalizedBridesmaids.length) {
            setBridesmaidList(normalizedBridesmaids)
          }
        }
        setStatus('success')
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }
        console.error('Failed to load party info', fetchError)
        setStatus('error')
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load party info')
      }
    }

    fetchMeta()

    return () => {
      controller.abort()
    }
  }, [endpoint])

  return {
    partyInfo,
    bridesmaids: bridesmaidList,
    loading: status === 'loading',
    error,
  }
}

export default usePartyInfo
