import { apiFetch } from "./apiManager.jsx"

export const getStates = () => {
    return apiFetch("/states").then((res) => res.json())
}