import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getStories, deleteStory } from "../services/storyServices.jsx"

export const StoryList = () => {
    const [stories, setStories] = useState([])

    const getAllStories = () => {
        getStories().then(setStories)
    }

    useEffect(() => {
        getAllStories()
    }, [])

    const handleDelete = (storyId) => {
        deleteStory(storyId).then(() => {
            getAllStories()
        })
    }

    return (
        <section className="page">
            <h1>Ghost Stories</h1>

            <Link to="/stories/new">
                <button>Tell Us Your Story</button>
            </Link>

            <div className="story-list">
                {stories.map((story) => (
                    <article className="card" key={story.id}>
                        <h2>
                            <Link to={`/stories/${story.id}`}>{story.title}</Link>
                        </h2>

                        <p>
                            <strong>Location:</strong> {story.location.name}, {story.location.city}, {story.location.state}
                        </p>

                        <p>
                            <strong>Haunting Types:</strong>{" "}
                            {story.haunting_types.map((type) => type.name).join(", ")}
                        </p>

                        <p>{story.content.slice(0, 150)}...</p>

                        {story.is_owner ? (
                            <div className="button-row">
                                <Link to={`/stories/${story.id}/edit`}>
                                    <button>Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(story.id)}>Delete</button>
                            </div>
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    )
}