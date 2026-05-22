import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteLocation, getLocationById } from "../services/locationServices.jsx"
import { getStories } from "../services/storyServices.jsx"
import noPhotoImage from "../../assets/read no photo.png"
import "./LocationForm.css"
import "./LocationDetails.css"

export const LocationDetails = () => {
    const { locationId } = useParams()
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)
    const [recentStories, setRecentStories] = useState([])

    const deleteWarningDialog = useRef()
    const deleteSuccessDialog = useRef()

    useEffect(() => {
        getLocationById(locationId).then(setLocation)

        getStories().then((storyData) => {
            const storiesForLocation = storyData
                .filter((story) => story.location.id === parseInt(locationId))
                .slice(0, 4)

            setRecentStories(storiesForLocation)
        })
    }, [locationId])

    if (!location) {
        return <p>Loading location...</p>
    }

    const isPrivateResidence = location.name.toLowerCase() === "private residence"

    const handleDeleteLocation = () => {
        deleteLocation(location.id).then(() => {
            deleteWarningDialog.current.close()
            deleteSuccessDialog.current.showModal()
        })
    }

    return (
        <section className="page">
            <dialog className="dialog dialog--auth add-location-dialog" ref={deleteWarningDialog}>
                <div>
                    Are you sure you want to delete this location? All of your stories connected to this location will also be deleted.
                </div>

                <button
                    className="button--close gothic-location-button"
                    onClick={() => deleteWarningDialog.current.close()}
                >
                    No. Return to location details
                </button>

                <button
                    className="button--close gothic-location-button"
                    onClick={handleDeleteLocation}
                >
                    Yes. Delete this location.
                </button>
            </dialog>

            <dialog className="dialog dialog--auth add-location-dialog" ref={deleteSuccessDialog}>
                <div>Location and associated stories successfully deleted.</div>

                <button
                    className="button--close gothic-location-button"
                    onClick={() => {
                        deleteSuccessDialog.current.close()
                        navigate("/home")
                    }}
                >
                    Return to Home
                </button>
            </dialog>

            <article className="location-details-card gothic-card">
                <h1 className="location-details-title">{location.name}</h1>

                <p>
                    <strong>Location:</strong> {location.city}, {location.state.abbreviation}
                </p>

                <h2 className="location-details-heading">Description</h2>
                <p className="preserve-line-breaks">{location.description}</p>

                {location.history ? (
                    <>
                        <h2 className="location-details-heading">History</h2>
                        <p className="preserve-line-breaks">{location.history}</p>
                    </>
                ) : null}

                {location.source_url ? (
                    <p>
                        <strong>Source:</strong>{" "}
                        <a href={location.source_url} target="_blank" rel="noreferrer">
                            {location.source_url}
                        </a>
                    </p>
                ) : null}

                <h2 className="location-details-heading">Recent Stories</h2>

                {recentStories.length > 0 ? (
                    <section className="location-recent-stories">
                        {recentStories.map((story) => {
                            const storyImage =
                                story.photos && story.photos.length > 0 && story.photos[0].image_url
                                    ? story.photos[0].image_url
                                    : noPhotoImage

                            return (
                                <article className="location-recent-story-card gothic-card" key={story.id}>
                                    <img
                                        className="location-recent-story-card__image"
                                        src={storyImage}
                                        alt={`Image for ${story.title}`}
                                    />

                                    <h3 className="location-recent-story-card__title">
                                        <Link to={`/stories/${story.id}`}>
                                            {story.title}
                                        </Link>
                                    </h3>

                                    <p>
                                        {story.haunting_types.map((type) => type.name).join(", ")}
                                    </p>
                                </article>
                            )
                        })}
                    </section>
                ) : (
                    <p>No stories have been submitted for this location yet.</p>
                )}

                {location.is_owner ? (
                    <div className="button-row">
                        <Link to={`/locations/${location.id}/edit`}>
                            <button>Edit</button>
                        </Link>

                        {isPrivateResidence ? (
                            <button onClick={() => deleteWarningDialog.current.showModal()}>
                                Delete
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </article>
        </section>
    )
}