import { Outlet } from "react-router-dom"
import { NavBar } from "./nav/Navbar.jsx"

export const AppLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}