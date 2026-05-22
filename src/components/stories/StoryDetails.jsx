import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteStory, getStories, getStoryById } from "../services/storyServices.jsx"
import { deleteLocation } from "../services/locationServices.jsx"
import { getStoryPhotos } from "../services/storyPhotoServices.jsx"
import "./StoryDetails.css"

export const StoryDetails = () => {
    const { storyId } = useParams()
    const navigate = useNavigate()
    const [story, setStory] = useState(null)
    const [photos, setPhotos] = useState([])
    const [stories, setStories] = useState([])

    const deleteSuccessDialog = useRef()
    const lastStoryWarningDialog = useRef()

    useEffect(() => {
        getStoryById(storyId).then(setStory)
        getStoryPhotos(storyId).then(setPhotos)
        getStories().then((storyData) => {
            const userStories = storyData.filter((currentStory) => currentStory.is_owner)
            setStories(userStories)
        })
    }, [storyId])

    if (!story) {
        return <p>Loading story...</p>
    }

    const shouldShowPrivateResidenceLink =
        story.is_owner &&
        story.location.name.toLowerCase() === "private residence" &&
        story.location.user_id === story.user_id

    const isLastStoryForPrivateResidence = () => {
        const isPrivateResidence =
            story.location.name.toLowerCase() === "private residence"

        const userOwnsLocation = story.location.user_id === story.user_id

        const storiesAtSameLocation = stories.filter((currentStory) => {
            return currentStory.location.id === story.location.id
        })

        return isPrivateResidence && userOwnsLocation && storiesAtSameLocation.length === 1
    }

    const handleDelete = () => {
        if (isLastStoryForPrivateResidence()) {
            lastStoryWarningDialog.current.showModal()
        } else {
            deleteStory(story.id).then(() => {
                deleteSuccessDialog.current.showModal()
            })
        }
    }

    const handleDeleteLastPrivateResidenceStory = () => {
        deleteLocation(story.location.id).then(() => {
            lastStoryWarningDialog.current.close()
            deleteSuccessDialog.current.showModal()
        })
    }

    return (
        <section className="page">
            <dialog className="dialog dialog--auth" ref={deleteSuccessDialog}>
                <div>Story successfully deleted.</div>

                <button
                    className="button--close gothic-story-list-button"
                    onClick={() => {
                        deleteSuccessDialog.current.close()
                        navigate("/stories")
                    }}
                >
                    Return to Your Stories
                </button>
            </dialog>

            <dialog className="dialog dialog--auth" ref={lastStoryWarningDialog}>
                <div>
                    <p>
                        You are about to delete the last story from this location.
                        When you do that, it will also delete this location:
                    </p>

                    <p>
                        <strong>Location:</strong> {story.location.name}
                    </p>
                    <p>
                        <strong>City, State:</strong>{" "}
                        {story.location.city}, {story.location.state.abbreviation}
                    </p>
                    <p>
                        <strong>Created:</strong>{" "}
                        {new Date(story.location.created_at).toLocaleDateString()}
                    </p>
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
                        navigate("/stories")
                    }}
                >
                    No. Keep this story.
                </button>
            </dialog>

            <article className="story-details-card gothic-card">
                <h1 className="story-details-title">{story.title}</h1>

                <p>
                    <strong>Location:</strong>{" "}
                    <Link
                        className="story-details-link"
                        to={`/locations/${story.location.id}`}
                    >
                        {story.location.name}
                    </Link>
                    , {story.location.city}, {story.location.state.abbreviation}

                    {shouldShowPrivateResidenceLink ? (
                        <>
                            {" "}
                            <Link
                                className="story-details-link"
                                to={`/stories/new?locationId=${story.location.id}`}
                            >
                                Add another story from this same private residence?
                            </Link>
                        </>
                    ) : null}
                </p>

                <p>
                    <strong>Submitted by:</strong> {story.author_name}
                </p>

                <p>
                    <strong>Haunting Types:</strong>{" "}
                    {story.haunting_types.map((type) => type.name).join(", ")}
                </p>

                <p className="preserve-line-breaks story-details-content">
                    {story.content}
                </p>

                {photos.length > 0 ? (
                    <section className="story-photos">
                        <h2>Photos</h2>

                        <div className="story-photo-thumbnails">
                            {photos.map((photo) => (
                                <Link to={`/photos/${photo.id}`} key={photo.id}>
                                    <img
                                        className="story-photo-thumbnail"
                                        src={photo.image_url}
                                        alt={`Photo for ${story.title}`}
                                    />
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}
            </article>

            {story.is_owner ? (
                <div className="button-row story-details-button-row">
                    <Link to={`/stories/${story.id}/edit`}>
                        <button className="gothic-story-list-button">
                            Edit
                        </button>
                    </Link>

                    <button
                        className="gothic-story-list-button"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            ) : null}
        </section>
    )
}