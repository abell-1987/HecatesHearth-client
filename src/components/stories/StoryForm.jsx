import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
    createLocation,
    getLocationById,
    getLocations
} from "../services/locationServices.jsx"
import { getStates } from "../services/stateServices.jsx"
import { getHauntingTypes } from "../services/hauntingTypeServices.jsx"
import { createStory, getStoryById, updateStory } from "../services/storyServices.jsx"
import {
    deleteStoryPhoto,
    getStoryPhotos,
    uploadStoryPhoto
} from "../services/storyPhotoServices.jsx"
import newStoryImage from "../../assets/new story.png"
import "./StoryForm.css"

export const StoryForm = () => {
    const navigate = useNavigate()
    const { storyId } = useParams()
    const [searchParams] = useSearchParams()
    const preselectedLocationId = searchParams.get("locationId")
    const successDialog = useRef()

    const [locations, setLocations] = useState([])
    const [states, setStates] = useState([])
    const [hauntingTypes, setHauntingTypes] = useState([])
    const [photos, setPhotos] = useState([])
    const [existingPhotos, setExistingPhotos] = useState([])
    const [locationSearch, setLocationSearch] = useState("")
    const [selectedLocationId, setSelectedLocationId] = useState("")
    const [preselectedLocation, setPreselectedLocation] = useState(null)
    const [isPrivateResidence, setIsPrivateResidence] = useState(false)

    const [privateResidence, setPrivateResidence] = useState({
        description: "",
        city: "",
        state_id: ""
    })

    const [story, setStory] = useState({
        title: "",
        content: "",
        location_id: "",
        haunting_type_ids: []
    })

    useEffect(() => {
        getLocations().then(setLocations)
        getStates().then(setStates)
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
                    `${storyData.location.name} - ${storyData.location.city}, ${storyData.location.state.abbreviation}`
                )

                if (storyData.location.name.toLowerCase() === "private residence") {
                    setPreselectedLocation(storyData.location)
                } else {
                    setPreselectedLocation(null)
                }
            })

            getStoryPhotos(storyId).then(setExistingPhotos)
        } else {
            setStory({
                title: "",
                content: "",
                location_id: "",
                haunting_type_ids: []
            })

            setPhotos([])
            setExistingPhotos([])
            setLocationSearch("")
            setSelectedLocationId("")
            setIsPrivateResidence(false)
            setPrivateResidence({
                description: "",
                city: "",
                state_id: ""
            })

            if (preselectedLocationId) {
                getLocationById(preselectedLocationId).then((locationData) => {
                    setPreselectedLocation(locationData)
                    setSelectedLocationId(locationData.id)
                    setLocationSearch(
                        `${locationData.name} - ${locationData.city}, ${locationData.state.abbreviation}`
                    )
                })
            } else {
                setPreselectedLocation(null)
            }
        }
    }, [storyId, preselectedLocationId])

    const matchingLocations = locationSearch
        ? locations.filter((location) => {
            const isPrivateResidence =
                location.name.toLowerCase() === "private residence"

            const fullLocation = `${location.name} ${location.city} ${location.state.abbreviation}`.toLowerCase()

            return (
                !isPrivateResidence &&
                fullLocation.includes(locationSearch.toLowerCase())
            )
        })
        : []

    const handleLocationSelect = (location) => {
        setSelectedLocationId(location.id)
        setLocationSearch(`${location.name} - ${location.city}, ${location.state.abbreviation}`)

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

    const removeSelectedPhoto = (photoName) => {
        const filteredPhotos = photos.filter((photo) => photo.name !== photoName)
        setPhotos(filteredPhotos)
    }

    const removeExistingPhoto = (photoId) => {
        deleteStoryPhoto(photoId).then(() => {
            getStoryPhotos(storyId).then(setExistingPhotos)
        })
    }

    const uploadPhotosForStory = (createdStoryId) => {
        const photoUploads = photos.map((photo) => {
            return uploadStoryPhoto(createdStoryId, photo)
        })

        return Promise.all(photoUploads)
    }

    const createStoryWithLocation = (locationId) => {
        const storyToSend = {
            ...story,
            location_id: locationId
        }

        return createStory(storyToSend).then((createdStory) => {
            return uploadPhotosForStory(createdStory.id).then(() => {
                successDialog.current.showModal()
            })
        })
    }

    const handleSave = (event) => {
        event.preventDefault()

        if (storyId) {
            const storyToSend = {
                ...story,
                location_id: selectedLocationId
            }

            updateStory(storyId, storyToSend).then(() => {
                uploadPhotosForStory(storyId).then(() => {
                    navigate("/stories")
                })
            })
        } else if (isPrivateResidence) {
            const privateResidenceToSend = {
                name: "Private Residence",
                city: privateResidence.city,
                state_id: parseInt(privateResidence.state_id),
                description: privateResidence.description,
                history: "",
                source_url: "",
                is_famous: false
            }

            createLocation(privateResidenceToSend).then((response) => {
                if (response.ok) {
                    createStoryWithLocation(response.data.id)
                }
            })
        } else {
            createStoryWithLocation(selectedLocationId)
        }
    }

    const canSubmitStory =
        selectedLocationId || (
            isPrivateResidence &&
            privateResidence.description.trim() !== "" &&
            privateResidence.city.trim() !== "" &&
            privateResidence.state_id !== ""
        )

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

                        {preselectedLocation ? (
                            <div className="preselected-private-location">
                                <p>
                                    <strong>
                                        {preselectedLocation.name} - {preselectedLocation.city}, {preselectedLocation.state.abbreviation}
                                    </strong>
                                </p>
                                <p>
                                    <strong>Location Created:</strong>{" "}
                                    {new Date(preselectedLocation.created_at).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Location Created By:</strong>{" "}
                                    {preselectedLocation.creator_name}
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="story-form-helper-text">
                                    Is this location open to the public? Use the field below or add the location if you do not find a match.
                                </p>

                                {!isPrivateResidence ? (
                                    <>
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
                                            required={!isPrivateResidence}
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
                                                            {location.name} - {location.city}, {location.state.abbreviation}
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
                                    </>
                                ) : null}
                            </>
                        )}
                    </fieldset>

                    {!storyId && !preselectedLocation ? (
                        <fieldset className="private-residence-checkbox-field">
                            <label className="private-residence-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isPrivateResidence}
                                    onChange={(event) => {
                                        const isChecked = event.target.checked
                                        setIsPrivateResidence(isChecked)

                                        if (isChecked) {
                                            setSelectedLocationId("")
                                            setLocationSearch("")
                                            setStory({
                                                ...story,
                                                location_id: ""
                                            })
                                        } else {
                                            setPrivateResidence({
                                                description: "",
                                                city: "",
                                                state_id: ""
                                            })
                                        }
                                    }}
                                />
                                <span>
                                    Is this location a private home you once lived in or visited? Click this check box and fill out the additional fields that appear in lieu of the location field above.
                                </span>
                            </label>
                        </fieldset>
                    ) : null}

                    {isPrivateResidence && !preselectedLocation ? (
                        <section className="private-residence-fields">
                            <fieldset>
                                <label htmlFor="privateResidenceDescription">Description</label>
                                <textarea
                                    id="privateResidenceDescription"
                                    value={privateResidence.description}
                                    onChange={(event) => {
                                        setPrivateResidence({
                                            ...privateResidence,
                                            description: event.target.value
                                        })
                                    }}
                                    required={isPrivateResidence}
                                />
                            </fieldset>

                            <section className="private-residence-city-state-row">
                                <fieldset className="private-residence-city-field">
                                    <label htmlFor="privateResidenceCity">City</label>
                                    <input
                                        type="text"
                                        id="privateResidenceCity"
                                        value={privateResidence.city}
                                        onChange={(event) => {
                                            setPrivateResidence({
                                                ...privateResidence,
                                                city: event.target.value
                                            })
                                        }}
                                        required={isPrivateResidence}
                                    />
                                </fieldset>

                                <fieldset className="private-residence-state-field">
                                    <label htmlFor="privateResidenceState">State</label>
                                    <select
                                        id="privateResidenceState"
                                        value={privateResidence.state_id}
                                        onChange={(event) => {
                                            setPrivateResidence({
                                                ...privateResidence,
                                                state_id: event.target.value
                                            })
                                        }}
                                        required={isPrivateResidence}
                                    >
                                        <option value="">State</option>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.abbreviation}
                                            </option>
                                        ))}
                                    </select>
                                </fieldset>
                            </section>
                        </section>
                    ) : null}

                    <button
                        type="submit"
                        className="gothic-story-button"
                        disabled={!canSubmitStory}
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

                    {storyId && existingPhotos.length > 0 ? (
                        <div className="existing-photo-list">
                            {existingPhotos.map((photo) => (
                                <div className="photo-upload-item" key={photo.id}>
                                    <span>{photo.image.split("/").pop()}</span>
                                    <button
                                        type="button"
                                        className="photo-remove-button"
                                        onClick={() => removeExistingPhoto(photo.id)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                    />

                    <div className="photo-upload-list">
                        {photos.map((photo) => (
                            <div className="photo-upload-item" key={photo.name}>
                                <span>{photo.name}</span>
                                <button
                                    type="button"
                                    className="photo-remove-button"
                                    onClick={() => removeSelectedPhoto(photo.name)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </form>
        </main>
    )
}