import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    createLocation,
    getLocationById,
    updateLocation
} from "../services/locationServices.jsx"

export const LocationForm = () => {
    const navigate = useNavigate()
    const { locationId } = useParams()

    const [location, setLocation] = useState({
        name: "",
        city: "",
        state: "",
        description: "",
        history: "",
        source_url: ""
    })

    useEffect(() => {
        if (locationId) {
            getLocationById(locationId).then((locationData) => {
                setLocation({
                    name: locationData.name,
                    city: locationData.city,
                    state: locationData.state,
                    description: locationData.description,
                    history: locationData.history || "",
                    source_url: locationData.source_url || ""
                })
            })
        }
    }, [locationId])

    const handleSave = (event) => {
        event.preventDefault()

        if (locationId) {
            updateLocation(locationId, location).then(() => navigate("/locations"))
        } else {
            createLocation(location).then(() => navigate("/locations"))
        }
    }

    return (
        <form className="page form" onSubmit={handleSave}>
            <h1>{locationId ? "Edit Location" : "Add Haunted Location"}</h1>

            <fieldset>
                <label>Name</label>
                <input
                    type="text"
                    value={location.name}
                    onChange={(event) => setLocation({ ...location, name: event.target.value })}
                    required
                />
            </fieldset>

            <fieldset>
                <label>City</label>
                <input
                    type="text"
                    value={location.city}
                    onChange={(event) => setLocation({ ...location, city: event.target.value })}
                    required
                />
            </fieldset>

            <fieldset>
                <label>State</label>
                <input
                    type="text"
                    value={location.state}
                    onChange={(event) => setLocation({ ...location, state: event.target.value })}
                    required
                />
            </fieldset>

            <fieldset>
                <label>Description</label>
                <textarea
                    value={location.description}
                    onChange={(event) => setLocation({ ...location, description: event.target.value })}
                    required
                />
            </fieldset>

            <fieldset>
                <label>History</label>
                <textarea
                    value={location.history}
                    onChange={(event) => setLocation({ ...location, history: event.target.value })}
                />
            </fieldset>

            <fieldset>
                <label>Source URL</label>
                <input
                    type="url"
                    value={location.source_url}
                    onChange={(event) => setLocation({ ...location, source_url: event.target.value })}
                />
            </fieldset>

            <button type="submit">{locationId ? "Save Changes" : "Add Location"}</button>
        </form>
    )
}