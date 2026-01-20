import { useEffect, useMemo, useState } from 'react'
import { partyInfo as fallbackPartyInfo } from '../data/party'

type PartyInfo = typeof fallbackPartyInfo

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

const usePartyInfo = (eventSlug = DEFAULT_EVENT_SLUG) => {
  const [partyInfo, setPartyInfo] = useState<PartyInfo>(fallbackPartyInfo)
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
        const payload = (await response.json()) as Partial<PartyInfo>
        setPartyInfo((prev) => ({ ...prev, ...payload }))
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
    loading: status === 'loading',
    error,
  }
}

export default usePartyInfo
