import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { itinerary } from '../data/party'
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
    eventStatus,
    eventBasePath,
    eventSlug,
    loading: isPartyInfoLoading,
    error: partyInfoError,
  } = usePartyInfo()
  const { downloadCard, isGenerating: isShareGenerating } = useShareImage()

  const basePath = eventBasePath || ''
  const buildPath = (suffix: string) => {
    const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`
    return `${basePath}${normalizedSuffix}` || normalizedSuffix
  }
  const { isBoysTheme } = useThemeClass(partyInfo.theme)
  const themeTagline = partyInfo.themeTagline ?? (isBoysTheme ? 'The fellas are up next' : partyInfo.theme)
  const crewSegment = bride.role === 'Groom' ? 'groomsman' : 'bridesmaid'
  const crewLabelPlural = bride.role === 'Groom' ? 'Groomsmen' : 'Bridesmaids'
  const heroShareRef = useRef<HTMLDivElement>(null)
  const shareFileName = eventSlug ? `${eventSlug}-weekend` : 'weekend-card'
  const [isQrOpen, setIsQrOpen] = useState(false)

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

  const openQrModal = () => setIsQrOpen(true)
  const closeQrModal = () => setIsQrOpen(false)

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
            {itinerary.map((stop) => (
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
          disabled={isShareGenerating || !heroShareRef.current}
        >
          {isShareGenerating || !heroShareRef.current ? 'Preparing card…' : 'Download weekend card'}
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
          {itinerary.map((stop) => (
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
          <p className="eyebrow">What about the boys?</p>
          <h2>Peep the bachelor plans</h2>
          <p>
            The guys have their own itinerary brewing. Check out their page for dates, details, and
            how to send them a round.
          </p>
          <div className="cta-buttons">
            <a
              className="ghost-button boys-button"
              href={`${getCoEventBasePath(basePath, isBoysTheme)}/${partyInfo.coEvent}`}
            >
              Visit the boys&apos; page
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
