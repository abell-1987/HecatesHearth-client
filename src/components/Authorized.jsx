import { Navigate, Outlet } from "react-router-dom"
import { NavBar } from "./nav/Navbar.jsx"

export const Authorized = () => {
  if (localStorage.getItem("HecatesHearth_token")) {
    return (
      <>
        <NavBar />
        <Outlet />
      </>
    )
  }

  return <Navigate to="/" replace />
}