import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLocations } from "../services/locationServices.jsx"
import { getHauntingTypes } from "../services/hauntingTypeServices.jsx"
import { createStory, getStoryById, updateStory } from "../services/storyServices.jsx"

export const StoryForm = () => {
    const navigate = useNavigate()
    const { storyId } = useParams()

    const [locations, setLocations] = useState([])
    const [hauntingTypes, setHauntingTypes] = useState([])

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
            })
        }
    }, [storyId])

    const handleCheckboxChange = (typeId) => {
        const copy = { ...story }

        if (copy.haunting_type_ids.includes(typeId)) {
            copy.haunting_type_ids = copy.haunting_type_ids.filter((id) => id !== typeId)
        } else {
            copy.haunting_type_ids.push(typeId)
        }

        setStory(copy)
    }

    const handleSave = (event) => {
        event.preventDefault()

        if (storyId) {
            updateStory(storyId, story).then(() => navigate("/stories"))
        } else {
            createStory(story).then(() => navigate("/stories"))
        }
    }

    return (
        <form className="page form" onSubmit={handleSave}>
            <h1>{storyId ? "Edit Story" : "Tell Us Your Story"}</h1>

            <fieldset>
                <label>Title</label>
                <input
                    type="text"
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
                <label>Story</label>
                <textarea
                    value={story.content}
                    onChange={(event) => {
                        const copy = { ...story }
                        copy.content = event.target.value
                        setStory(copy)
                    }}
                    required
                />
            </fieldset>

            <fieldset>
                <label>Location</label>
                <select
                    value={story.location_id}
                    onChange={(event) => {
                        const copy = { ...story }
                        copy.location_id = parseInt(event.target.value)
                        setStory(copy)
                    }}
                    required
                >
                    <option value="">Choose a location</option>
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                            {location.name} — {location.city}, {location.state}
                        </option>
                    ))}
                </select>
            </fieldset>

            <fieldset>
                <label>Haunting Type</label>
                <div className="checkbox-group">
                    {hauntingTypes.map((type) => (
                        <label key={type.id}>
                            <input
                                type="checkbox"
                                checked={story.haunting_type_ids.includes(type.id)}
                                onChange={() => handleCheckboxChange(type.id)}
                            />
                            {type.name}
                        </label>
                    ))}
                </div>
            </fieldset>

            <button type="submit">{storyId ? "Save Changes" : "Submit Story"}</button>
        </form>
    )
}