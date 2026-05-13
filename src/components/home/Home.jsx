import "./Home.css"
import logo from "../../assets/Logo.png"

export const Home = () => {
    return (
        <main className="home-page">
            <section className="home-page__hero">
                <img
                    className="home-page__logo"
                    src={logo}
                    alt="Hecate's Hearth Logo"
                />

                <article className="home-page__card">
                    <h1 className="home-page__title">Welcome to Hecate&apos;s Hearth</h1>

                    <p className="home-page__text">
                        Pull your chair closer to the fire and mind the shadows at the edge
                        of the room. Hecate&apos;s Hearth is a gathering place for ghost
                        stories, haunted folklore, strange encounters, and the lingering
                        echoes of places that refuse to be forgotten. Whether your tale is
                        chilling, mysterious, heartbreaking, or beautifully bizarre,
                        there&apos;s always room beside the hearth for one more story.
                    </p>
                </article>
            </section>
        </main>
    )
}