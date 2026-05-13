import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { deleteLocation, getLocations } from "../services/locationServices.jsx"

export const LocationList = () => {
    const [locations, setLocations] = useState([])

    const getAllLocations = () => {
        getLocations().then(setLocations)
    }

    useEffect(() => {
        getAllLocations()
    }, [])

    const handleDelete = (locationId) => {
        deleteLocation(locationId).then(() => {
            getAllLocations()
        })
    }

    return (
        <section className="page">
            <h1>Haunted Locations</h1>

            <Link to="/locations/new">
                <button>Add Location</button>
            </Link>

            <div className="story-list">
                {locations.map((location) => (
                    <article className="card" key={location.id}>
                        <h2>{location.name}</h2>
                        <p>{location.city}, {location.state}</p>
                        <p>{location.description}</p>

                        {location.history ? (
                            <p>
                                <strong>History:</strong> {location.history}
                            </p>
                        ) : null}

                        {location.source_url ? (
                            <p>
                                <a href={location.source_url} target="_blank">
                                    Source
                                </a>
                            </p>
                        ) : null}

                        {location.is_owner ? (
                            <div className="button-row">
                                <Link to={`/locations/${location.id}/edit`}>
                                    <button>Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(location.id)}>Delete</button>
                            </div>
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    )
}