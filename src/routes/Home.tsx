import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import usePartyInfo from '../hooks/usePartyInfo'
import useShareImage from '../hooks/useShareImage'
import useThemeClass from '../hooks/useThemeClass'
import '../App.css'

const getBasePrefix = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  return segments[0] ?? 'events'
}

const getCoEventBasePath = (currentBasePath: string, isCurrentBoys: boolean) => {
  if (!currentBasePath) {
    return isCurrentBoys ? '/events' : '/event'
  }

  const currentPrefix = getBasePrefix(currentBasePath)
  const oppositePrefix = currentPrefix === 'events' ? 'event' : 'events'
  return `/${oppositePrefix}`
}

const Home = () => {
  const {
    partyInfo,
    bride,
    bridesmaids: bridesmaidsList,
    itinerary: itineraryItems,
    eventStatus,
    eventBasePath,
    eventSlug,
    loading: isPartyInfoLoading,
    error: partyInfoError,
    hydrated,
    displayTheme,
  } = usePartyInfo()
  const { downloadCard, isGenerating: isShareGenerating } = useShareImage()
  const location = useLocation()

  const basePath = eventBasePath || ''
  const buildPath = (suffix: string) => {
    const trimmedSuffix = suffix.replace(/^\/+/, '')
    const normalizedSuffix = trimmedSuffix ? `/${trimmedSuffix}` : ''
    const combinedPath = `${basePath}${normalizedSuffix}`
    return combinedPath || normalizedSuffix || '/'
  }
  const { isBoysTheme } = useThemeClass(displayTheme)
  const heroShareRef = useRef<HTMLDivElement>(null)
  const shareFileName = eventSlug ? `${eventSlug}-weekend` : 'weekend-card'
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [isShareReady, setIsShareReady] = useState(false)
  useEffect(() => {
    if (!isQrOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQrOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isQrOpen])

  useEffect(() => {
    if (!hydrated) {
      setIsShareReady(false)
      return
    }

    const handle = requestAnimationFrame(() => {
      if (heroShareRef.current) {
        setIsShareReady(true)
      }
    })

    return () => cancelAnimationFrame(handle)
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0 })
  }, [location.hash, hydrated])

  const openQrModal = () => setIsQrOpen(true)
  const closeQrModal = () => setIsQrOpen(false)

  if (!hydrated) {
    return (
      <div className={`page loading-state ${isBoysTheme ? 'boys-theme' : 'ladies-theme'}`} id="top">
        <div className="panel soft loading-panel">
          <p className="eyebrow">Loading event</p>
          <h2>Grabbing the latest details…</h2>
          <p className="muted">Hang tight while we fetch this weekend&apos;s info.</p>
        </div>
      </div>
    )
  }

  const themeTagline = partyInfo.themeTagline ?? (isBoysTheme ? 'The fellas are up next' : partyInfo.theme)
  const crewSegment = bride.role === 'Groom' ? 'groomsman' : 'bridesmaid'
  const crewLabelPlural = bride.role === 'Groom' ? 'Groomsmen' : 'Bridesmaids'
  const coEventEyebrow =
    partyInfo.coEventEyebrow ?? (isBoysTheme ? 'What about the girls?' : 'What about the boys?')
  const coEventTitle =
    partyInfo.coEventTitle ?? (isBoysTheme ? 'See the bridal plans' : 'Peep the bachelor plans')
  const coEventDescription =
    partyInfo.coEventDescription ??
    'Their crew has a full itinerary brewing—peek at their schedule, highlights, and ways to send a round.'
  const coEventButtonLabel =
    partyInfo.coEventButtonLabel ?? (isBoysTheme ? "Visit the ladies' page" : "Visit the boys' page")

  return (
    <div className={`page ${isBoysTheme ? 'boys-theme' : 'ladies-theme'}`} id="top">
      <div className="share-previews" aria-hidden="true">
        <div className="weekend-share-card" ref={heroShareRef}>
          <div className="status-pill">{eventStatus}</div>
          <h1>
            {partyInfo.bride}&apos;s {partyInfo.weekendName}
          </h1>
          <p className="share-location">{partyInfo.location}</p>
          <p className="share-dates">{partyInfo.dates}</p>
          <div className="share-itinerary">
            {itineraryItems.map((stop) => (
              <div key={stop.day} className="share-stop">
                <div className="share-stop-day">{stop.day}</div>
                <div>
                  <h3>{stop.title}</h3>
                  <p>{stop.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="hero">
        <div className="eyebrow hero-status">
          <span className={`status-pill ${eventStatus}`}>{eventStatus}</span>
          <span>Bachelorette Weekend • {partyInfo.location}</span>
        </div>
        <h1>
          {partyInfo.bride}&apos;s {partyInfo.weekendName}
          <span className="script-accent">Let&apos;s celebrate</span>
        </h1>
        <p className="hero-blurb">{partyInfo.blurb}</p>
        {isPartyInfoLoading ? (
          <div className="data-status">Loading the latest details…</div>
        ) : null}
        {partyInfoError ? (
          <div className="data-status error">
            Unable to load live updates right now. Showing saved details instead.
          </div>
        ) : null}

        <div className="hero-cta">
          <div className="cta-buttons">
            <Link className="primary-button" to={buildPath('/toast')}>
              Buy {bride.role === 'Groom' ? 'the groom' : 'the bride'} a drink
            </Link>
            <a className="ghost-button" href="#crew">
              Meet the crew
            </a>
          </div>
          <button type="button" className="qr-card" onClick={openQrModal} aria-label="View QR code">
            <img src="/qr-placeholder.svg" alt={partyInfo.qrLabel} />
            <p>{partyInfo.qrLabel}</p>
          </button>
        </div>

        <div className="meta-row">
          <div>
            <span className="label">Dates</span>
            <strong>{partyInfo.dates}</strong>
          </div>
          <div>
            <span className="label">Where</span>
            <strong>{partyInfo.location}</strong>
          </div>
          <div>
            <span className="label">Stay</span>
            <strong>{partyInfo.lodging}</strong>
          </div>
        </div>
        <button
          className="share-button"
          type="button"
          onClick={() => downloadCard(heroShareRef.current, shareFileName)}
          disabled={isShareGenerating || !isShareReady}
        >
          {isShareGenerating || !isShareReady ? 'Preparing card…' : 'Download weekend card'}
        </button>
      </header>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">What to expect</p>
            <h2>Weekend highlights</h2>
          </div>
          <div className="tagline">{themeTagline}</div>
        </div>
        <div className="highlight-grid">
          {partyInfo.highlights.map((item) => (
            <div key={item} className="highlight-card">
              <span className="sparkle">✷</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel soft">
        <p className="eyebrow">Plan</p>
        <h2>Itinerary</h2>
        <div className="itinerary-grid">
          {itineraryItems.map((stop) => (
            <div key={stop.day} className="itinerary-card">
              <div className="pill">{stop.day}</div>
              <h3>{stop.title}</h3>
              <p>{stop.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel soft bride-panel" id="bride">
        <div className="section-header">
          <div>
            <p className="eyebrow">{bride.role === 'Groom' ? 'The groom' : 'The bride'}</p>
            <h2>Meet {bride.name}</h2>
          </div>
        </div>
        <div className="bride-card">
          <div className="bride-image">
            <img src={bride.image} alt={bride.name} loading="lazy" />
          </div>
          <div className="bride-copy">
            <div className="pill">{bride.role}</div>
            <h3>{bride.name}</h3>
            <p>{bride.bio}</p>
            {bride.vibe ? <p className="muted">{bride.vibe}</p> : null}
            <div className="cta-buttons">
              <Link className="primary-button" to={buildPath(`/${crewSegment}/${bride.id}`)}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" id="crew">
        <p className="eyebrow">The {crewLabelPlural.toLowerCase()}</p>
        <h2>Meet the crew</h2>
        <div className="crew-grid">
          {bridesmaidsList.map((person) => (
            <Link key={person.id} to={buildPath(`/${crewSegment}/${person.id}`)} className="crew-card">
              <div className="crew-image">
                <img src={person.image} alt={person.name} loading="lazy" />
              </div>
              <div className="crew-copy">
                <div className="pill">{person.role}</div>
                <h3>{person.name}</h3>
                <p>{person.vibe}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel soft cta-panel">
        <div className="cta-copy">
          <p className="eyebrow">{bride.role === 'Groom' ? 'Spoil the groom' : 'Spoil the guest of honor'}</p>
          <h2>{partyInfo.ctaTitle ?? `Send ${bride.name} a toast`}</h2>
          <p>{partyInfo.ctaBody}</p>
          <div className="cta-buttons">
            <Link className="primary-button" to={buildPath('/toast')}>
              Buy {bride.role === 'Groom' ? 'the groom' : 'the bride'} a drink
            </Link>
            <a className="ghost-button" href="#top">
              Back to top
            </a>
          </div>
        </div>
        <button type="button" className="qr-card" onClick={openQrModal} aria-label="View QR code">
          <img src="/qr-placeholder.svg" alt={partyInfo.qrLabel} />
          <div className="qr-note">Keep this handy for on-the-spot cheers.</div>
        </button>
      </section>

      {partyInfo.coEvent ? (
        <section className="panel soft">
          <p className="eyebrow">{coEventEyebrow}</p>
          <h2>{coEventTitle}</h2>
          <p>{coEventDescription}</p>
          <div className="cta-buttons">
            <a
              className="ghost-button boys-button"
              href={`${getCoEventBasePath(basePath, isBoysTheme)}/${partyInfo.coEvent}`}
            >
              {coEventButtonLabel}
            </a>
          </div>
        </section>
      ) : null}

      {isQrOpen ? (
        <div className="qr-modal-backdrop" role="dialog" aria-modal="true" aria-label={partyInfo.qrLabel} onClick={closeQrModal}>
          <div className="qr-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="qr-modal-close" onClick={closeQrModal} aria-label="Close QR overlay">
              ×
            </button>
            <img src="/qr-placeholder.svg" alt={partyInfo.qrLabel} />
            <p>{partyInfo.qrLabel}</p>
            <p className="muted">Tap anywhere outside the card or hit Esc to dismiss.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Home
