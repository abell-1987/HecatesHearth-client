import { Link } from "react-router-dom"
import "./App.css"

function App() {
  return (
    <main className="home">
      <section className="hero-section">
        <h1>Hecate&apos;s Hearth</h1>
        <p>We keep the fire lit for what won&apos;t stay gone.</p>
      </section>

      <section className="home-actions">
        <Link to="/stories">
          <button>Read Ghost Stories</button>
        </Link>

        <Link to="/stories/new">
          <button>Tell Us Your Story</button>
        </Link>

        <Link to="/locations">
          <button>Browse Haunted Locations</button>
        </Link>
      </section>
    </main>
  )
}

export default App