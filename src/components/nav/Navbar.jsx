import { NavLink, useNavigate } from "react-router-dom"
import "./Navbar.css"

export const NavBar = () => {
    const navigate = useNavigate()
    const isLoggedIn = localStorage.getItem("HecatesHearth_token") !== null

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <NavLink className="navbar__link" to="/">
                    Home
                </NavLink>
            </div>

            <div className="navbar__right">
                {isLoggedIn ? (
                    <>
                        <NavLink className="navbar__link" to="/locations">
                            Famous Hauntings
                        </NavLink>

                        <NavLink className="navbar__link" to="/read-stories">
                            Read a Story
                        </NavLink>

                        <NavLink className="navbar__link" to="/stories/new">
                            Submit a Story
                        </NavLink>

                        <NavLink className="navbar__link" to="/stories">
                            Your Stories
                        </NavLink>

                        <button
                            className="navbar__button"
                            onClick={() => {
                                localStorage.removeItem("HecatesHearth_token")
                                navigate("/")
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink className="navbar__link" to="/register">
                            Register
                        </NavLink>

                        <NavLink className="navbar__link" to="/login">
                            Login
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}