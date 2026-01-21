import { Link, useParams } from 'react-router-dom'
import { brideProfile } from '../data/party'
import usePartyInfo from '../hooks/usePartyInfo'
import useThemeClass from '../hooks/useThemeClass'
import '../App.css'

const socialLabels: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  threads: 'Threads',
  website: 'Website',
}

const Bridesmaid = () => {
  const { id } = useParams<{ id: string }>()
  const { bride, bridesmaids, eventBasePath, partyInfo, hydrated } = usePartyInfo()
  const themeToken = hydrated ? partyInfo.theme : undefined
  const { isBoysTheme } = useThemeClass(themeToken)

  if (!hydrated) {
    return (
      <div className="page loading-state">
        <div className="panel soft loading-panel">
          <p className="eyebrow">Loading profile</p>
          <h2>Hold on a sec…</h2>
          <p className="muted">We&apos;re fetching their bio and socials.</p>
        </div>
      </div>
    )
  }

  const profiles = [bride ?? brideProfile, ...bridesmaids]
  const homeHref = eventBasePath || '/'
  const crewLabelPlural = bride.role === 'Groom' ? 'Groomsmen' : 'Bridesmaids'
  const crewHref = `${homeHref}#crew`
  const person = profiles.find((entry) => entry.id === id)

  if (!person) {
    return (
      <div className={`page ${isBoysTheme ? 'boys-theme' : 'ladies-theme'}`}>
        <div className="panel soft">
          <p className="eyebrow">{crewLabelPlural}</p>
          <h1>We couldn&apos;t find that page</h1>
          <p>Head back to the main crew list and try again.</p>
          <Link className="primary-button" to={homeHref}>
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`page ${isBoysTheme ? 'boys-theme' : 'ladies-theme'}`}>
      <nav className="crumbs">
        <Link to={homeHref}>Home</Link>
        <span>/</span>
        <a href={crewHref}>{crewLabelPlural}</a>
        <span>/</span>
        <span className="muted">{person.name}</span>
      </nav>

      <section className="panel detail-panel">
        <div className="detail-image">
          <img src={person.image} alt={person.name} />
        </div>
        <div className="detail-copy">
          <div className="pill">{person.role}</div>
          <h1>{person.name}</h1>
          <p>{person.bio}</p>
          {person.vibe ? <p className="muted">Vibe: {person.vibe}</p> : null}

          {person.socials ? (
            <div className="social-links">
              {Object.entries(person.socials).map(([key, value]) =>
                value ? (
                  <a key={key} href={value} target="_blank" rel="noreferrer">
                    {socialLabels[key] ?? key}
                  </a>
                ) : null,
              )}
            </div>
          ) : null}

          <div className="cta-buttons">
            <a className="ghost-button" href={crewHref}>
              Back to all {crewLabelPlural.toLowerCase()}
            </a>
            <Link className="primary-button" to={homeHref}>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Bridesmaid
