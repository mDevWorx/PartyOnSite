import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { itinerary } from '../data/party'
import usePartyInfo from '../hooks/usePartyInfo'
import '../App.css'

const Home = () => {
  const {
    partyInfo,
    bride,
    bridesmaids: bridesmaidsList,
    loading: isPartyInfoLoading,
    error: partyInfoError,
  } = usePartyInfo()
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
    <div className="page" id="top">
      <header className="hero">
        <div className="eyebrow">Bachelorette Weekend • {partyInfo.location}</div>
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
            <Link className="primary-button" to="/toast">
              Buy the bride a drink
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
      </header>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">What to expect</p>
            <h2>Weekend highlights</h2>
          </div>
          <div className="tagline">{partyInfo.theme}</div>
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
            <p className="eyebrow">The bride</p>
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
              <Link className="primary-button" to={`/bridesmaid/${bride.id}`}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" id="crew">
        <p className="eyebrow">The bridesmaids</p>
        <h2>Meet the crew</h2>
        <div className="crew-grid">
          {bridesmaidsList.map((person) => (
            <Link key={person.id} to={`/bridesmaid/${person.id}`} className="crew-card">
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
          <p className="eyebrow">Spoil the bride</p>
          <h2>Send Shibby a toast</h2>
          <p>
            If you can&apos;t make it in person or want to send a pre-weekend treat, use the link
            below. We&apos;ll surprise her during golden hour and share the cheers.
          </p>
          <div className="cta-buttons">
            <Link className="primary-button" to="/toast">
              Buy the bride a drink
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
