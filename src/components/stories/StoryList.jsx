import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getStories, deleteStory } from "../services/storyServices.jsx"
import { deleteLocation } from "../services/locationServices.jsx"
import yourStoriesImage from "../../assets/your stories.png"
import "./StoryList.css"

export const StoryList = () => {
    const navigate = useNavigate()
    const [stories, setStories] = useState([])
    const [pendingDeleteStory, setPendingDeleteStory] = useState(null)

    const deleteSuccessDialog = useRef()
    const lastStoryWarningDialog = useRef()

    const getAllStories = () => {
        getStories().then((storyData) => {
            const userStories = storyData.filter((story) => story.is_owner)
            setStories(userStories)
        })
    }

    useEffect(() => {
        getAllStories()
    }, [])

    const isLastStoryForPrivateResidence = (story) => {
        const isPrivateResidence =
            story.location.name.toLowerCase() === "private residence"

        const userOwnsLocation = story.location.user_id === story.user_id

        const storiesAtSameLocation = stories.filter((currentStory) => {
            return currentStory.location.id === story.location.id
        })

        return isPrivateResidence && userOwnsLocation && storiesAtSameLocation.length === 1
    }

    const handleDelete = (story) => {
        if (isLastStoryForPrivateResidence(story)) {
            setPendingDeleteStory(story)
            lastStoryWarningDialog.current.showModal()
        } else {
            deleteStory(story.id).then(() => {
                getAllStories()
                deleteSuccessDialog.current.showModal()
            })
        }
    }

    const handleDeleteLastPrivateResidenceStory = () => {
        deleteLocation(pendingDeleteStory.location.id).then(() => {
            lastStoryWarningDialog.current.close()
            setPendingDeleteStory(null)
            getAllStories()
            deleteSuccessDialog.current.showModal()
        })
    }

    return (
        <main className="your-stories-page">
            <dialog className="dialog dialog--auth" ref={deleteSuccessDialog}>
                <div>Story successfully deleted.</div>

                <button
                    className="button--close gothic-story-list-button"
                    onClick={() => deleteSuccessDialog.current.close()}
                >
                    Close
                </button>
            </dialog>

            <dialog className="dialog dialog--auth" ref={lastStoryWarningDialog}>
                <div>
                    <p>
                        You are about to delete the last story from this location.
                        When you do that, it will also delete this location:
                    </p>

                    {pendingDeleteStory ? (
                        <>
                            <p>
                                <strong>Location:</strong> {pendingDeleteStory.location.name}
                            </p>
                            <p>
                                <strong>City, State:</strong>{" "}
                                {pendingDeleteStory.location.city}, {pendingDeleteStory.location.state.abbreviation}
                            </p>
                            <p>
                                <strong>Created:</strong>{" "}
                                {new Date(pendingDeleteStory.location.created_at).toLocaleDateString()}
                            </p>
                        </>
                    ) : null}
                </div>

                <button
                    className="button--close gothic-story-list-button"
                    onClick={handleDeleteLastPrivateResidenceStory}
                >
                    Yes, Delete
                </button>

                <button
                    className="button--close gothic-story-list-button"
                    onClick={() => {
                        lastStoryWarningDialog.current.close()
                        setPendingDeleteStory(null)
                        navigate("/stories")
                    }}
                >
                    No. Keep this story.
                </button>
            </dialog>

            <img
                className="your-stories-page__image"
                src={yourStoriesImage}
                alt="Your submitted stories"
            />

            <section className="your-stories-page__content">
                <div className="your-stories-list">
                    {stories.map((story) => (
                        <article className="your-story-card gothic-card" key={story.id}>
                            <h2 className="your-story-card__title">
                                <Link to={`/stories/${story.id}`}>{story.title}</Link>
                            </h2>

                            <p>
                                <strong>Location:</strong> {story.location.name}, {story.location.city}, {story.location.state.abbreviation}
                            </p>

                            <p>
                                <strong>Haunting Types:</strong>{" "}
                                {story.haunting_types.map((type) => type.name).join(", ")}
                            </p>

                            <p>{story.content.slice(0, 150)}...</p>

                            <div className="button-row">
                                <Link to={`/stories/${story.id}/edit`}>
                                    <button className="gothic-story-list-button">Edit</button>
                                </Link>

                                <button
                                    className="gothic-story-list-button"
                                    onClick={() => handleDelete(story)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <Link to="/stories/new" className="your-stories-page__submit-link">
                    <button className="gothic-story-list-button">
                        Submit a New Story
                    </button>
                </Link>
            </section>
        </main>
    )
}