import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getStoryPhotoById } from "../services/storyPhotoServices.jsx"
import "./PhotoDetails.css"

export const PhotoDetails = () => {
    const { photoId } = useParams()
    const [photo, setPhoto] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        getStoryPhotoById(photoId).then(setPhoto)
    }, [photoId])

    if (!photo) {
        return <p>Loading photo...</p>
    }

    return (
        <main className="photo-details-page">
            <img
                className="photo-details-page__image"
                src={photo.image_url}
                alt={`Photo for ${photo.story.title}`}
            />

            <article className="photo-details-page__info gothic-card">
                <p>
                    <strong>Location:</strong>{" "}
                    {photo.location.name}, {photo.location.city}, {photo.location.state.abbreviation}
                </p>

                <p>
                    <strong>Story:</strong>{" "}
                    <Link to={`/stories/${photo.story.id}`}>{photo.story.title}</Link>
                </p>

                <p>
                    <strong>Haunting Types:</strong>{" "}
                    {photo.haunting_types.map((type) => type.name).join(", ")}
                </p>
            </article>
        </main>
    )
}