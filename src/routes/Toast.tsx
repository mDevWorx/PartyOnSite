import { Link } from 'react-router-dom'
import usePartyInfo from '../hooks/usePartyInfo'
import '../App.css'

const Toast = () => {
  const { partyInfo, loading: isPartyInfoLoading, error: partyInfoError } = usePartyInfo()

  return (
    <div className="page" id="top">
      <nav className="crumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span className="muted">Send a toast</span>
      </nav>

      <section className="panel soft toast-panel">
        <p className="eyebrow">Spoil the bride</p>
        <h1>Ways to send {partyInfo.bride} a drink</h1>
        <p>
          Choose whichever app you prefer. Drop a note with your name or a quick toast so we can
          share it with {partyInfo.bride} during golden hour.
        </p>
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
          <Link className="ghost-button" to="/">
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
