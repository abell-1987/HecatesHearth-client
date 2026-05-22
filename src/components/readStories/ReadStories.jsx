import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getStories } from "../services/storyServices.jsx"
import { getHauntingTypes } from "../services/hauntingTypeServices.jsx"
import { getStates } from "../services/stateServices.jsx"
import readStoryImage from "../../assets/read a story.png"
import noPhotoImage from "../../assets/read no photo.png"
import filterGhostImage from "../../assets/filter ghost.png"
import noResultsImage from "../../assets/no results.png"
import "./ReadStories.css"

export const ReadStories = () => {
    const [stories, setStories] = useState([])
    const [filteredStories, setFilteredStories] = useState([])
    const [states, setStates] = useState([])
    const [hauntingTypes, setHauntingTypes] = useState([])

    const [cityFilter, setCityFilter] = useState("")
    const [stateFilter, setStateFilter] = useState("")
    const [hauntingTypeFilters, setHauntingTypeFilters] = useState([])

    useEffect(() => {
        getStories().then((storyData) => {
            setStories(storyData)
            setFilteredStories(storyData)
        })

        getStates().then(setStates)
        getHauntingTypes().then(setHauntingTypes)
    }, [])

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
        let matchingStories = [...stories]

        if (cityFilter.trim() !== "") {
            matchingStories = matchingStories.filter((story) =>
                story.location.city.toLowerCase().includes(cityFilter.toLowerCase())
            )
        }

        if (stateFilter !== "") {
            matchingStories = matchingStories.filter(
                (story) => story.location.state.id === parseInt(stateFilter)
            )
        }

        if (hauntingTypeFilters.length > 0) {
            matchingStories = matchingStories.filter((story) =>
                hauntingTypeFilters.every((selectedTypeId) =>
                    story.haunting_types.some((type) => type.id === selectedTypeId)
                )
            )
        }

        setFilteredStories(matchingStories)
    }

    const handleClear = () => {
        setCityFilter("")
        setStateFilter("")
        setHauntingTypeFilters([])
        setFilteredStories(stories)
    }

    return (
        <main className="read-stories-page">
            <section className="read-stories-layout">
                <section className="read-stories-main">
                    <img
                        className="read-stories-page__image"
                        src={readStoryImage}
                        alt="Read a story"
                    />

                    <section
                        className={
                            filteredStories.length > 0
                                ? "read-stories-grid"
                                : "read-stories-no-results-area"
                        }
                    >
                        {filteredStories.length > 0 ? (
                            filteredStories.map((story) => {
                                const storyImage =
                                    story.photos && story.photos.length > 0 && story.photos[0].image_url
                                        ? story.photos[0].image_url
                                        : noPhotoImage

                                return (
                                    <article className="read-story-card gothic-card" key={story.id}>
                                        <img
                                            className="read-story-card__image"
                                            src={storyImage}
                                            alt={`Image for ${story.title}`}
                                        />

                                        <h2 className="read-story-card__title">
                                            <Link to={`/stories/${story.id}`}>
                                                {story.title}
                                            </Link>
                                        </h2>

                                        <p className="read-story-card__location-name">
                                            {story.location.name}
                                        </p>

                                        <p>
                                            {story.location.city}, {story.location.state.abbreviation}
                                        </p>

                                        <p>
                                            {story.haunting_types.map((type) => type.name).join(", ")}
                                        </p>
                                    </article>
                                )
                            })
                        ) : (
                            <img
                                className="no-results-image"
                                src={noResultsImage}
                                alt="No results found"
                            />
                        )}
                    </section>
                </section>

                <aside className="read-stories-filter gothic-card">
                    <img
                        className="read-stories-filter__image"
                        src={filterGhostImage}
                        alt="Filter stories"
                    />

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

                    <fieldset>
                        <label htmlFor="stateFilter">State</label>
                        <select
                            id="stateFilter"
                            value={stateFilter}
                            onChange={(event) => setStateFilter(event.target.value)}
                        >
                            <option value="">All States</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.abbreviation}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset>
                        <legend>Haunting Type</legend>

                        <div className="read-stories-filter__checkboxes">
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

                    <div className="read-stories-filter__buttons">
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