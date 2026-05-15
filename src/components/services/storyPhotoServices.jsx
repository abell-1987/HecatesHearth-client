import { getToken } from "./apiManager.jsx"

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