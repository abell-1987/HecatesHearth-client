import { apiFetch, getToken } from "./apiManager.jsx"

const apiUrl = "http://localhost:8000"

export const uploadStoryPhoto = (storyId, imageFile) => {
    const formData = new FormData()
    formData.append("story_id", storyId)
    formData.append("image", imageFile)

    return fetch(`${apiUrl}/storyphotos`, {
        method: "POST",
        headers: {
            Authorization: `Token ${getToken()}`
        },
        body: formData
    }).then((res) => res.json())
}

export const getStoryPhotos = (storyId) => {
    return apiFetch(`/storyphotos?story_id=${storyId}`).then((res) => res.json())
}

export const getStoryPhotoById = (photoId) => {
    return apiFetch(`/storyphotos/${photoId}`).then((res) => res.json())
}

export const deleteStoryPhoto = (photoId) => {
    return apiFetch(`/storyphotos/${photoId}`, {
        method: "DELETE"
    })
}

export const getLocationPhotos = (locationId) => {
    return apiFetch(`/storyphotos?location_id=${locationId}`).then((res) => res.json())
}