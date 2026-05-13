import { apiFetch } from "./apiManager.jsx"

export const getHauntingTypes = () => {
    return apiFetch("/hauntingtypes").then((res) => res.json())
}