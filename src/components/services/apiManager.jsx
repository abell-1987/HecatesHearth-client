const apiUrl = "http://localhost:8000"

export const getToken = () => {
    const tokenData = localStorage.getItem("HecatesHearth_token")

    if (!tokenData) {
        return null
    }

    return JSON.parse(tokenData).token
}

export const getAuthHeaders = () => {
    return {
        "Content-Type": "application/json",
        Authorization: `Token ${getToken()}`
    }
}

export const apiFetch = (endpoint, options = {}) => {
    return fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    })
}