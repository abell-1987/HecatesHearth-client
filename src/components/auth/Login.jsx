import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import loginImage from "../../assets/login.png"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const userDoesNotExistDialog = useRef()
    const incorrectPasswordDialog = useRef()
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        fetch("http://localhost:8000/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((authInfo) => {
                if (authInfo.valid) {
                    localStorage.setItem("HecatesHearth_token", JSON.stringify(authInfo))
                    navigate("/home")
                } else if (authInfo.reason === "incorrect_password") {
                    incorrectPasswordDialog.current.showModal()
                } else {
                    userDoesNotExistDialog.current.showModal()
                }
            })
    }

    return (
        <main className="login-page">
            <dialog className="dialog dialog--auth" ref={userDoesNotExistDialog}>
                <div>User does not exist</div>

                <button
                    className="button--close gothic-register-button"
                    onClick={() => userDoesNotExistDialog.current.close()}
                >
                    Close
                </button>
            </dialog>

            <dialog className="dialog dialog--auth" ref={incorrectPasswordDialog}>
                <div>Incorrect Password</div>

                <button
                    className="button--close gothic-register-button"
                    onClick={() => incorrectPasswordDialog.current.close()}
                >
                    Close
                </button>
            </dialog>

            <img
                className="login-page__image"
                src={loginImage}
                alt="Login to Hecate's Hearth"
            />

            <section className="login-page__content">
                <form className="form--login gothic-card login-form" onSubmit={handleLogin}>
                    <fieldset className="mb-4">
                        <label htmlFor="inputEmail">Email address</label>

                        <input
                            type="email"
                            id="inputEmail"
                            value={email}
                            onChange={(evt) => setEmail(evt.target.value)}
                            className="form-control"
                            placeholder="Email address"
                            autoComplete="new-email"
                            required
                            autoFocus
                        />
                    </fieldset>

                    <fieldset className="mb-4">
                        <label htmlFor="inputPassword">Password</label>

                        <input
                            type="password"
                            id="inputPassword"
                            value={password}
                            onChange={(evt) => setPassword(evt.target.value)}
                            className="form-control"
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />
                    </fieldset>

                    <fieldset>
                        <button type="submit" className="gothic-register-button">
                            Login
                        </button>
                    </fieldset>
                </form>

                <section className="login-page__register-link">
                    <Link className="gothic-auth-link" to="/register">
                        Not a member yet?
                    </Link>
                </section>
            </section>
        </main>
    )
}