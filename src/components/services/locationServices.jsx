import { apiFetch } from "./apiManager.jsx"

export const getLocations = () => {
    return apiFetch("/locations").then((res) => res.json())
}

export const getLocationById = (id) => {
    return apiFetch(`/locations/${id}`).then((res) => res.json())
}

export const createLocation = (location) => {
    return apiFetch("/locations", {
        method: "POST",
        body: JSON.stringify(location)
    }).then((res) => {
        return res.json().then((data) => ({
            ok: res.ok,
            status: res.status,
            data
        }))
    })
}

export const updateLocation = (id, location) => {
    return apiFetch(`/locations/${id}`, {
        method: "PUT",
        body: JSON.stringify(location)
    })
}

export const deleteLocation = (id) => {
    return apiFetch(`/locations/${id}`, {
        method: "DELETE"
    })
}