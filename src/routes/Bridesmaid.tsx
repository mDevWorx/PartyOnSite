import { Link, useParams } from 'react-router-dom'
import { bridesmaids } from '../data/party'
import '../App.css'

const socialLabels: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  threads: 'Threads',
  website: 'Website',
}

const Bridesmaid = () => {
  const { id } = useParams<{ id: string }>()
  const person = bridesmaids.find((entry) => entry.id === id)

  if (!person) {
    return (
      <div className="page">
        <div className="panel soft">
          <p className="eyebrow">Bridesmaid</p>
          <h1>We couldn&apos;t find that page</h1>
          <p>Head back to the main crew list and try again.</p>
          <Link className="primary-button" to="/">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <a href="/#crew">Bridesmaids</a>
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
            <a className="ghost-button" href="/#crew">
              Back to all bridesmaids
            </a>
            <Link className="primary-button" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Bridesmaid
