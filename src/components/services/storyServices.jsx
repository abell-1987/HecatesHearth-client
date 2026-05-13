import { apiFetch } from "./apiManager.jsx"

export const getStories = () => {
    return apiFetch("/stories").then((res) => res.json())
}

export const getStoryById = (id) => {
    return apiFetch(`/stories/${id}`).then((res) => res.json())
}

export const createStory = (story) => {
    return apiFetch("/stories", {
        method: "POST",
        body: JSON.stringify(story)
    }).then((res) => res.json())
}

export const updateStory = (id, story) => {
    return apiFetch(`/stories/${id}`, {
        method: "PUT",
        body: JSON.stringify(story)
    })
}

export const deleteStory = (id) => {
    return apiFetch(`/stories/${id}`, {
        method: "DELETE"
    })
}