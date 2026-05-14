import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getStories } from "../services/storyServices.jsx"
import "./ReadStories.css"

export const ReadStories = () => {
    const [stories, setStories] = useState([])

    useEffect(() => {
        getStories().then((storyData) => {
            const otherUsersStories = storyData.filter((story) => !story.is_owner)
            setStories(otherUsersStories)
        })
    }, [])

    return (
        <section className="page read-stories">
            <article className="gothic-card read-stories__intro">
                <h1 className="gothic-title">Read a Story</h1>

                <p className="gothic-card-text">
                    Wander through the strange, sorrowful, and spine-tingling tales left
                    beside the hearth by other visitors.
                </p>
            </article>

            <div className="read-stories__list">
                {stories.length > 0 ? (
                    stories.map((story) => (
                        <article className="gothic-card read-stories__card" key={story.id}>
                            <h2 className="read-stories__story-title">
                                <Link to={`/stories/${story.id}`}>{story.title}</Link>
                            </h2>

                            <p className="read-stories__location">
                                {story.location.name} — {story.location.city}, {story.location.state}
                            </p>

                            <p className="read-stories__preview">
                                {story.content.slice(0, 180)}...
                            </p>

                            <p className="read-stories__types">
                                {story.haunting_types.map((type) => type.name).join(", ")}
                            </p>
                        </article>
                    ))
                ) : (
                    <article className="gothic-card read-stories__card">
                        <p className="gothic-card-text">
                            No other stories have been left by the hearth yet.
                        </p>
                    </article>
                )}
            </div>
        </section>
    )
}