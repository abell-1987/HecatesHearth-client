import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getLocations } from "../services/locationServices.jsx"
import { getLocationPhotos } from "../services/storyPhotoServices.jsx"
import { getStories } from "../services/storyServices.jsx"
import { getHauntingTypes } from "../services/hauntingTypeServices.jsx"
import { getStates } from "../services/stateServices.jsx"
import famousHauntingsImage from "../../assets/famous hauntings.png"
import famousFillerImage from "../../assets/famous filler.png"
import filterGhostImage from "../../assets/filter ghost.png"
import noResultsImage from "../../assets/no results.png"
import "./LocationList.css"

export const LocationList = () => {
    const [locations, setLocations] = useState([])
    const [filteredLocations, setFilteredLocations] = useState([])
    const [states, setStates] = useState([])
    const [locationPhotos, setLocationPhotos] = useState({})
    const [stories, setStories] = useState([])
    const [hauntingTypes, setHauntingTypes] = useState([])

    const [keywordFilter, setKeywordFilter] = useState("")
    const [cityFilter, setCityFilter] = useState("")
    const [stateFilter, setStateFilter] = useState("")
    const [hauntingTypeFilters, setHauntingTypeFilters] = useState([])

    useEffect(() => {
        getLocations().then((locationData) => {
            const famousLocations = locationData.filter((location) => location.is_famous)
            setLocations(famousLocations)
            setFilteredLocations(famousLocations)

            famousLocations.forEach((location) => {
                getLocationPhotos(location.id).then((photos) => {
                    setLocationPhotos((currentPhotos) => ({
                        ...currentPhotos,
                        [location.id]: photos
                    }))
                })
            })
        })

        getStories().then(setStories)
        getHauntingTypes().then(setHauntingTypes)
        getStates().then(setStates)
    }, [])

    const getLocationImage = (locationId) => {
        const photos = locationPhotos[locationId]

        if (photos && photos.length > 0) {
            const randomIndex = Math.floor(Math.random() * photos.length)
            return photos[randomIndex].image_url
        }

        return famousFillerImage
    }

    const handleHauntingTypeFilterChange = (typeId) => {
        if (hauntingTypeFilters.includes(typeId)) {
            setHauntingTypeFilters(
                hauntingTypeFilters.filter((currentTypeId) => currentTypeId !== typeId)
            )
        } else {
            setHauntingTypeFilters([...hauntingTypeFilters, typeId])
        }
    }

    const handleFilter = () => {
        let matchingLocations = [...locations]

        if (keywordFilter.trim() !== "") {
            matchingLocations = matchingLocations.filter((location) =>
                location.name.toLowerCase().includes(keywordFilter.toLowerCase())
            )
        }

        if (cityFilter.trim() !== "") {
            matchingLocations = matchingLocations.filter((location) =>
                location.city.toLowerCase().includes(cityFilter.toLowerCase())
            )
        }

        if (stateFilter !== "") {
            matchingLocations = matchingLocations.filter(
                (location) => location.state.id === parseInt(stateFilter)
            )
        }

        if (hauntingTypeFilters.length > 0) {
            matchingLocations = matchingLocations.filter((location) => {
                const storiesForLocation = stories.filter(
                    (story) => story.location.id === location.id
                )

                return storiesForLocation.some((story) =>
                    hauntingTypeFilters.every((selectedTypeId) =>
                        story.haunting_types.some((type) => type.id === selectedTypeId)
                    )
                )
            })
        }

        setFilteredLocations(matchingLocations)
    }

    const handleClear = () => {
        setKeywordFilter("")
        setCityFilter("")
        setStateFilter("")
        setHauntingTypeFilters([])
        setFilteredLocations(locations)
    }

    return (
        <main className="famous-locations-page">
            <section className="famous-locations-layout">
                <section className="famous-locations-main">
                    <img
                        className="famous-locations-page__image"
                        src={famousHauntingsImage}
                        alt="Famous hauntings"
                    />

                    <section
                        className={
                            filteredLocations.length > 0
                                ? "famous-locations-grid"
                                : "famous-locations-no-results-area"
                        }
                    >
                        {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                                <article className="famous-location-card gothic-card" key={location.id}>
                                    <img
                                        className="famous-location-card__image"
                                        src={getLocationImage(location.id)}
                                        alt={`Image for ${location.name}`}
                                    />

                                    <h2 className="famous-location-card__title">
                                        <Link to={`/locations/${location.id}`}>
                                            {location.name}
                                        </Link>
                                    </h2>

                                    <p>
                                        {location.city}, {location.state.abbreviation}
                                    </p>
                                </article>
                            ))
                        ) : (
                            <img
                                className="no-results-image"
                                src={noResultsImage}
                                alt="No results found"
                            />
                        )}
                    </section>
                </section>

                <aside className="famous-locations-filter gothic-card">
                    <img
                        className="famous-locations-filter__image"
                        src={filterGhostImage}
                        alt="Filter locations"
                    />

                    <fieldset>
                        <label htmlFor="keywordFilter">Location Keyword</label>
                        <input
                            type="text"
                            id="keywordFilter"
                            value={keywordFilter}
                            onChange={(event) => setKeywordFilter(event.target.value)}
                            placeholder="Search by name..."
                        />
                    </fieldset>

                    <section className="famous-locations-city-state-row">
                        <fieldset>
                            <label htmlFor="cityFilter">City</label>
                            <input
                                type="text"
                                id="cityFilter"
                                value={cityFilter}
                                onChange={(event) => setCityFilter(event.target.value)}
                                placeholder="Search by city..."
                            />
                        </fieldset>

                        <fieldset className="famous-locations-state-field">
                            <label htmlFor="stateFilter">State</label>
                            <select
                                id="stateFilter"
                                value={stateFilter}
                                onChange={(event) => setStateFilter(event.target.value)}
                            >
                                <option value="">All</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>
                                        {state.abbreviation}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                    </section>

                    <fieldset>
                        <legend>Haunting Type</legend>

                        <div className="famous-locations-filter__checkboxes">
                            {hauntingTypes.map((type) => (
                                <label key={type.id}>
                                    <input
                                        type="checkbox"
                                        checked={hauntingTypeFilters.includes(type.id)}
                                        onChange={() => handleHauntingTypeFilterChange(type.id)}
                                    />
                                    {type.name}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="famous-locations-filter__buttons">
                        <button
                            type="button"
                            className="gothic-story-list-button"
                            onClick={handleFilter}
                        >
                            Filter
                        </button>

                        <button
                            type="button"
                            className="gothic-story-list-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>
                </aside>
            </section>
        </main>
    )
}