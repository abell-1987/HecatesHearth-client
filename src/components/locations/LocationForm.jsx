import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    createLocation,
    getLocationById,
    getLocations,
    updateLocation
} from "../services/locationServices.jsx"
import { getStates } from "../services/stateServices.jsx"
import addLocationImage from "../../assets/add a location.png"
import "./LocationForm.css"

export const LocationForm = () => {
    const navigate = useNavigate()
    const { locationId } = useParams()

    const successDialog = useRef()
    const duplicateDialog = useRef()

    const [existingLocations, setExistingLocations] = useState([])
    const [states, setStates] = useState([])
    const [showNameSuggestions, setShowNameSuggestions] = useState(false)
    const [showCitySuggestions, setShowCitySuggestions] = useState(false)

    const [location, setLocation] = useState({
        name: "",
        city: "",
        state_id: "",
        description: "",
        history: "",
        source_url: "",
        is_famous: false
    })

    useEffect(() => {
        getLocations().then(setExistingLocations)
        getStates().then(setStates)
    }, [])

    useEffect(() => {
        if (locationId) {
            getLocationById(locationId).then((locationData) => {
                setLocation({
                    name: locationData.name,
                    city: locationData.city,
                    state_id: locationData.state.id,
                    description: locationData.description,
                    history: locationData.history || "",
                    source_url: locationData.source_url || "",
                    is_famous: locationData.is_famous || false
                })
            })
        }
    }, [locationId])

    const uniqueLocationNames = [
        ...new Set(existingLocations.map((existingLocation) => existingLocation.name))
    ]

    const uniqueLocationCities = [
        ...new Set(existingLocations.map((existingLocation) => existingLocation.city))
    ]

    const matchingNames = location.name
        ? uniqueLocationNames.filter((name) =>
            name.toLowerCase().includes(location.name.toLowerCase())
        )
        : []

    const matchingCities = location.city
        ? uniqueLocationCities.filter((city) =>
            city.toLowerCase().includes(location.city.toLowerCase())
        )
        : []

    const isEditingPrivateResidence =
        locationId && location.name.toLowerCase() === "private residence"

    const handleSave = (event) => {
        event.preventDefault()

        const locationToSend = {
            ...location,
            name: isEditingPrivateResidence ? "Private Residence" : location.name,
            state_id: parseInt(location.state_id),
            is_famous:
                !isEditingPrivateResidence &&
                location.is_famous &&
                location.history.trim() !== "" &&
                location.source_url.trim() !== ""
        }

        if (locationId) {
            updateLocation(locationId, locationToSend).then(() => navigate("/locations"))
        } else {
            createLocation(locationToSend).then((response) => {
                if (response.status === 409) {
                    duplicateDialog.current.showModal()
                } else if (response.ok) {
                    successDialog.current.showModal()
                }
            })
        }
    }

    return (
        <main className="add-location-page">
            <dialog className="dialog dialog--auth add-location-dialog" ref={successDialog}>
                <div>The path through the veil expands. Location successfully submitted.</div>

                <button
                    className="button--close gothic-location-button"
                    onClick={() => {
                        successDialog.current.close()
                        navigate("/stories/new")
                    }}
                >
                    Return to Submit a Story
                </button>
            </dialog>

            <dialog className="dialog dialog--auth add-location-dialog" ref={duplicateDialog}>
                <div>Location already exists.</div>

                <button
                    className="button--close gothic-location-button"
                    onClick={() => {
                        duplicateDialog.current.close()
                    }}
                >
                    Return to Add a Location
                </button>
            </dialog>

            <img
                className="add-location-page__image"
                src={addLocationImage}
                alt="Add a haunted location"
            />

            <form className="add-location-form gothic-card" onSubmit={handleSave}>
                <fieldset className="location-name-search">
                    <label htmlFor="locationName">Name</label>

                    {isEditingPrivateResidence ? (
                        <p className="add-location-static-value">Private Residence</p>
                    ) : (
                        <>
                            <p className="add-location-helper-text">
                                If this is your current home, or one you used to live in, begin typing
                                {" "}&#34;Private Residence&#34; and select that option from the dropdown when it appears.
                            </p>

                            <input
                                type="text"
                                id="locationName"
                                value={location.name}
                                onFocus={() => setShowNameSuggestions(true)}
                                onChange={(event) => {
                                    setShowNameSuggestions(true)
                                    setLocation({ ...location, name: event.target.value })
                                }}
                                required
                            />

                            {showNameSuggestions && location.name ? (
                                <div className="location-suggestion-results">
                                    {matchingNames.length > 0 ? (
                                        matchingNames.map((name) => (
                                            <button
                                                type="button"
                                                className="location-suggestion-result"
                                                key={name}
                                                onClick={() => {
                                                    setLocation({ ...location, name })
                                                    setShowNameSuggestions(false)
                                                }}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    ) : null}
                                </div>
                            ) : null}
                        </>
                    )}
                </fieldset>

                <section className="add-location-city-state-row">
                    <fieldset className="location-city-search">
                        <label htmlFor="locationCity">City</label>

                        <input
                            type="text"
                            id="locationCity"
                            value={location.city}
                            onFocus={() => setShowCitySuggestions(true)}
                            onChange={(event) => {
                                setShowCitySuggestions(true)
                                setLocation({ ...location, city: event.target.value })
                            }}
                            required
                        />

                        {showCitySuggestions && location.city ? (
                            <div className="location-suggestion-results">
                                {matchingCities.length > 0 ? (
                                    matchingCities.map((city) => (
                                        <button
                                            type="button"
                                            className="location-suggestion-result"
                                            key={city}
                                            onClick={() => {
                                                setLocation({ ...location, city })
                                                setShowCitySuggestions(false)
                                            }}
                                        >
                                            {city}
                                        </button>
                                    ))
                                ) : null}
                            </div>
                        ) : null}
                    </fieldset>

                    <fieldset className="add-location-state-field">
                        <label htmlFor="locationState">State</label>

                        <select
                            id="locationState"
                            value={location.state_id}
                            onChange={(event) => {
                                setLocation({ ...location, state_id: event.target.value })
                            }}
                            required
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

                <fieldset>
                    <label htmlFor="locationDescription">Description</label>
                    <p className="add-location-helper-text">
                        Here is where you give us a description of the property itself.
                        For example: Is it a house? What kind of house? Is it a hospital?
                        What kind of hospital?
                    </p>

                    <textarea
                        id="locationDescription"
                        value={location.description}
                        onChange={(event) => {
                            setLocation({ ...location, description: event.target.value })
                        }}
                        required
                    />
                </fieldset>

                {!isEditingPrivateResidence ? (
                    <fieldset className="famous-location-checkbox-field">
                        <label className="famous-location-checkbox-label">
                            <input
                                type="checkbox"
                                checked={location.is_famous}
                                onChange={(event) => {
                                    const isChecked = event.target.checked

                                    setLocation({
                                        ...location,
                                        is_famous: isChecked,
                                        history: isChecked ? location.history : "",
                                        source_url: isChecked ? location.source_url : ""
                                    })
                                }}
                            />
                            <span>
                                Would this location be considered a famous haunted location? If so,
                                check this box and fill out the additional fields.
                            </span>
                        </label>
                    </fieldset>
                ) : null}

                {location.is_famous && !isEditingPrivateResidence ? (
                    <>
                        <fieldset>
                            <label htmlFor="locationHistory">History</label>

                            <textarea
                                id="locationHistory"
                                value={location.history}
                                onChange={(event) => {
                                    setLocation({ ...location, history: event.target.value })
                                }}
                                required={location.is_famous}
                            />
                        </fieldset>

                        <fieldset>
                            <label htmlFor="locationSourceUrl">Source URL</label>

                            <input
                                type="url"
                                id="locationSourceUrl"
                                value={location.source_url}
                                onChange={(event) => {
                                    setLocation({ ...location, source_url: event.target.value })
                                }}
                                required={location.is_famous}
                            />
                        </fieldset>
                    </>
                ) : null}

                <button type="submit" className="gothic-location-button">
                    {locationId ? "Save Changes" : "Add Location"}
                </button>
            </form>
        </main>
    )
}