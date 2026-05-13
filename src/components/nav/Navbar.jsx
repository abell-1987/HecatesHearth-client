import { NavLink, useNavigate } from "react-router-dom"
import "./Navbar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            {localStorage.getItem("HecatesHearth_token") !== null ? (
                <>
                    <li className="navbar__item">
                        <NavLink to="/home">Home</NavLink>
                    </li>
                    <li className="navbar__item">
                        <NavLink to="/stories">Stories</NavLink>
                    </li>
                    <li className="navbar__item">
                        <NavLink to="/locations">Locations</NavLink>
                    </li>
                    <li className="navbar__item">
                        <NavLink to="/stories/new">Submit Story</NavLink>
                    </li>
                    <li className="navbar__item">
                        <button
                            onClick={() => {
                                localStorage.removeItem("HecatesHearth_token")
                                navigate("/login")
                            }}
                        >
                            Logout
                        </button>
                    </li>
                </>
            ) : (
                <>
                    <li className="navbar__item">
                        <NavLink to="/login">Login</NavLink>
                    </li>
                    <li className="navbar__item">
                        <NavLink to="/register">Register</NavLink>
                    </li>
                </>
            )}
        </ul>
    )
}