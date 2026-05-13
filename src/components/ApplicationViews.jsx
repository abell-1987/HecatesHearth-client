import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized.jsx"
import { Login } from "./auth/Login.jsx"
import { Register } from "./auth/Register.jsx"
import { Home } from "./home/Home.jsx"
import { StoryList } from "./stories/StoryList.jsx"
import { StoryForm } from "./stories/StoryForm.jsx"
import { StoryDetails } from "./stories/StoryDetails.jsx"
import { LocationList } from "./locations/LocationList.jsx"
import { LocationForm } from "./locations/LocationForm.jsx"

const ApplicationViews = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<Authorized />}>
                    <Route path="/home" element={<Home />} />

                    <Route path="/stories" element={<StoryList />} />
                    <Route path="/stories/new" element={<StoryForm />} />
                    <Route path="/stories/:storyId" element={<StoryDetails />} />
                    <Route path="/stories/:storyId/edit" element={<StoryForm />} />

                    <Route path="/locations" element={<LocationList />} />
                    <Route path="/locations/new" element={<LocationForm />} />
                    <Route path="/locations/:locationId/edit" element={<LocationForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default ApplicationViews