import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getLocations } from "../services/locationServices.jsx"
import { getHauntingTypes } from "../services/hauntingTypeServices.jsx"
import { createStory, getStoryById, updateStory } from "../services/storyServices.jsx"
import { uploadStoryPhoto } from "../services/storyPhotoServices.jsx"
import newStoryImage from "../../assets/new story.png"
import "./StoryForm.css"

export const StoryForm = () => {
    const navigate = useNavigate()
    const { storyId } = useParams()
    const successDialog = useRef()

    const [locations, setLocations] = useState([])
    const [hauntingTypes, setHauntingTypes] = useState([])
    const [photos, setPhotos] = useState([])
    const [locationSearch, setLocationSearch] = useState("")
    const [selectedLocationId, setSelectedLocationId] = useState("")

    const [story, setStory] = useState({
        title: "",
        content: "",
        location_id: "",
        haunting_type_ids: []
    })

    useEffect(() => {
        getLocations().then(setLocations)
        getHauntingTypes().then(setHauntingTypes)
    }, [])

    useEffect(() => {
        if (storyId) {
            getStoryById(storyId).then((storyData) => {
                setStory({
                    title: storyData.title,
                    content: storyData.content,
                    location_id: storyData.location.id,
                    haunting_type_ids: storyData.haunting_types.map((type) => type.id)
                })

                setSelectedLocationId(storyData.location.id)
                setLocationSearch(
                    `${storyData.location.name} - ${storyData.location.city}, ${storyData.location.state}`
                )
            })
        }
    }, [storyId])

    const matchingLocations = locationSearch
        ? locations.filter((location) => {
            const fullLocation = `${location.name} ${location.city} ${location.state}`.toLowerCase()
            return fullLocation.includes(locationSearch.toLowerCase())
        })
        : []

    const handleLocationSelect = (location) => {
        setSelectedLocationId(location.id)
        setLocationSearch(`${location.name} - ${location.city}, ${location.state}`)

        const copy = { ...story }
        copy.location_id = location.id
        setStory(copy)
    }

    const handleCheckboxChange = (typeId) => {
        const copy = { ...story }

        if (copy.haunting_type_ids.includes(typeId)) {
            copy.haunting_type_ids = copy.haunting_type_ids.filter((id) => id !== typeId)
        } else if (copy.haunting_type_ids.length < 3) {
            copy.haunting_type_ids.push(typeId)
        }

        setStory(copy)
    }

    const handlePhotoChange = (event) => {
        const selectedPhotos = Array.from(event.target.files).slice(0, 4)
        setPhotos(selectedPhotos)
    }

    const handleSave = (event) => {
        event.preventDefault()

        const storyToSend = {
            ...story,
            location_id: selectedLocationId
        }

        if (storyId) {
            updateStory(storyId, storyToSend).then(() => navigate("/stories"))
        } else {
            createStory(storyToSend).then((createdStory) => {
                const photoUploads = photos.map((photo) => {
                    return uploadStoryPhoto(createdStory.id, photo)
                })

                Promise.all(photoUploads).then(() => {
                    successDialog.current.showModal()
                })
            })
        }
    }

    return (
        <main className="new-story-page">
            <dialog className="dialog dialog--auth new-story-success-dialog" ref={successDialog}>
                <div>Hecate&apos;s fire burns brighter tonight. Story successfully submitted.</div>

                <button
                    className="button--close gothic-story-button"
                    onClick={() => {
                        successDialog.current.close()
                        navigate("/stories")
                    }}
                >
                    Return to My Stories
                </button>
            </dialog>

            <img
                className="new-story-page__image"
                src={newStoryImage}
                alt="Submit a new story"
            />

            <form className="new-story-form gothic-card" onSubmit={handleSave}>
                <section className="new-story-form__main-fields">
                    <fieldset>
                        <label htmlFor="storyTitle">Title</label>
                        <input
                            type="text"
                            id="storyTitle"
                            value={story.title}
                            onChange={(event) => {
                                const copy = { ...story }
                                copy.title = event.target.value
                                setStory(copy)
                            }}
                            required
                        />
                    </fieldset>

                    <fieldset>
                        <label htmlFor="storyContent">Story</label>
                        <textarea
                            id="storyContent"
                            value={story.content}
                            onChange={(event) => {
                                const copy = { ...story }
                                copy.content = event.target.value
                                setStory(copy)
                            }}
                            required
                        />
                    </fieldset>

                    <fieldset className="location-search">
                        <label htmlFor="locationSearch">Location</label>
                        <input
                            type="text"
                            id="locationSearch"
                            value={locationSearch}
                            onChange={(event) => {
                                setLocationSearch(event.target.value)
                                setSelectedLocationId("")

                                const copy = { ...story }
                                copy.location_id = ""
                                setStory(copy)
                            }}
                            placeholder="Start typing a location..."
                            required
                        />

                        {locationSearch && !selectedLocationId ? (
                            <div className="location-search__results">
                                {matchingLocations.length > 0 ? (
                                    matchingLocations.map((location) => (
                                        <button
                                            type="button"
                                            className="location-search__result"
                                            key={location.id}
                                            onClick={() => handleLocationSelect(location)}
                                        >
                                            {location.name} - {location.city}, {location.state}
                                        </button>
                                    ))
                                ) : (
                                    <p className="location-search__empty">
                                        Can&apos;t find a match? Submit a new location{" "}
                                        <Link to="/locations/new">here</Link>.
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </fieldset>

                    <button
                        type="submit"
                        className="gothic-story-button"
                        disabled={!selectedLocationId}
                    >
                        {storyId ? "Save Changes" : "Submit Story"}
                    </button>
                </section>

                <section className="new-story-form__haunting-types">
                    <div className="new-story-form__haunting-types-content">
                        <h2>Haunting Type</h2>
                        <p>Select up to 3 types</p>

                        <div className="haunting-type-options">
                            {hauntingTypes.map((type) => {
                                const isSelected = story.haunting_type_ids.includes(type.id)
                                const shouldDisable =
                                    story.haunting_type_ids.length >= 3 && !isSelected

                                return (
                                    <label
                                        className={shouldDisable ? "haunting-type-option disabled" : "haunting-type-option"}
                                        key={type.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={shouldDisable}
                                            onChange={() => handleCheckboxChange(type.id)}
                                        />
                                        {type.name}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <section className="new-story-form__photos">
                    <h2>Photos</h2>
                    <p>
                        Upload up to 4 photos
                        <br />
                        <span className="photo-upload-types">
                            (Accepted formats: JPG, JPEG, PNG, WEBP)
                        </span>
                    </p>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                    />

                    <div className="photo-upload-list">
                        {photos.map((photo) => (
                            <p key={photo.name}>{photo.name}</p>
                        ))}
                    </div>
                </section>
            </form>
        </main>
    )
}