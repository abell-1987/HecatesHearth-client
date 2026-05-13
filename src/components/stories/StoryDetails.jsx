import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteStory, getStoryById } from "../services/storyServices.jsx"

export const StoryDetails = () => {
    const { storyId } = useParams()
    const navigate = useNavigate()
    const [story, setStory] = useState(null)

    useEffect(() => {
        getStoryById(storyId).then(setStory)
    }, [storyId])

    if (!story) {
        return <p>Loading story...</p>
    }

    const handleDelete = () => {
        deleteStory(story.id).then(() => {
            navigate("/stories")
        })
    }

    return (
        <section className="page">
            <article className="card">
                <h1>{story.title}</h1>

                <p>
                    <strong>Location:</strong> {story.location.name}, {story.location.city}, {story.location.state}
                </p>

                <p>
                    <strong>Submitted by:</strong> {story.author_name}
                </p>

                <p>
                    <strong>Haunting Types:</strong>{" "}
                    {story.haunting_types.map((type) => type.name).join(", ")}
                </p>

                <p>{story.content}</p>

                {story.is_owner ? (
                    <div className="button-row">
                        <Link to={`/stories/${story.id}/edit`}>
                            <button>Edit</button>
                        </Link>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                ) : null}
            </article>
        </section>
    )
}