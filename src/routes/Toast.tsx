import { Link } from 'react-router-dom'
import usePartyInfo from '../hooks/usePartyInfo'
import useThemeClass from '../hooks/useThemeClass'
import '../App.css'

const Toast = () => {
  const {
    partyInfo,
    bride,
    eventBasePath,
    loading: isPartyInfoLoading,
    error: partyInfoError,
    hydrated,
    displayTheme,
  } = usePartyInfo()
  const { isBoysTheme } = useThemeClass(displayTheme)

  if (!hydrated) {
    return (
      <div className={`page loading-state ${isBoysTheme ? 'boys-theme' : 'ladies-theme'}`} id="top">
        <div className="panel soft loading-panel">
          <p className="eyebrow">Setting up</p>
          <h2>Loading payment options…</h2>
          <p className="muted">Hang tight while we fetch the latest toast info.</p>
        </div>
      </div>
    )
  }

  const homeHref = eventBasePath || '/'
  const honoreeName = bride?.name ?? partyInfo.bride
  const honoreeRole = bride?.role ?? 'Guest of Honor'
  const honoreeLabel = honoreeRole === 'Groom' ? 'groom' : honoreeRole === 'Bride' ? 'bride' : 'guest of honor'

  return (
    <div className={`page ${isBoysTheme ? 'boys-theme' : 'ladies-theme'}`} id="top">
      <nav className="crumbs">
        <Link to={homeHref}>Home</Link>
        <span>/</span>
        <span className="muted">Send a toast</span>
      </nav>

      <section className="panel soft toast-panel">
        <p className="eyebrow">Spoil the {honoreeLabel}</p>
        <h1>Ways to send {honoreeName} a drink</h1>
        <p>{partyInfo.ctaBody}</p>
        {isPartyInfoLoading ? (
          <div className="data-status">Loading the latest payment info…</div>
        ) : null}
        {partyInfoError ? (
          <div className="data-status error">
            Unable to fetch the live list. Showing our saved handles for now.
          </div>
        ) : null}

        <div className="contribution-grid">
          {partyInfo.contributionLinks.map((link) => (
            <a
              key={link.platform}
              className="contribution-card"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="contribution-platform">
                <span className="label">Platform</span>
                <strong>{link.platform}</strong>
              </div>
              {link.handle ? <p className="contribution-handle">{link.handle}</p> : null}
              {link.note ? <p className="muted contribution-note">{link.note}</p> : null}
            </a>
          ))}
        </div>

        <div className="cta-buttons toast-cta">
          <Link className="ghost-button" to={homeHref}>
            Back to home
          </Link>
          <a className="ghost-button" href="#top">
            Back to top
          </a>
        </div>
      </section>
    </div>
  )
}

export default Toast
