import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import registerImage from "../../assets/register.png"

export const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const existDialog = useRef()
    const successDialog = useRef()
    const navigate = useNavigate()

    const handleRegister = (e) => {
        e.preventDefault()

        fetch("http://localhost:8000/register", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((authInfo) => {
                if (authInfo && authInfo.token) {
                    localStorage.setItem("HecatesHearth_token", JSON.stringify(authInfo))
                    successDialog.current.showModal()
                } else {
                    existDialog.current.showModal()
                }
            })
    }

    return (
        <main className="register-page">
            <dialog className="dialog dialog--auth" ref={existDialog}>
                <div>Unable to create account</div>
                <button
                    className="button--close"
                    onClick={() => existDialog.current.close()}
                >
                    Close
                </button>
            </dialog>

            <dialog className="dialog dialog--auth register-success-dialog" ref={successDialog}>
                <div>The veil parts for a new storyteller. Welcome to Hecate&apos;s Hearth.</div>
                <button
                    className="button--close gothic-register-button"
                    onClick={() => {
                        successDialog.current.close()
                        navigate("/home")
                    }}
                >
                    Enter the Hearth
                </button>
            </dialog>

            <img
                className="register-page__image"
                src={registerImage}
                alt="Register for Hecate's Hearth"
            />

            <section className="register-page__content">
                <form className="form--login register-form gothic-card" onSubmit={handleRegister}>
                    <fieldset className="mb-4">
                        <label htmlFor="firstName">First name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(evt) => setFirstName(evt.target.value)}
                            className="form-control"
                            required
                            autoFocus
                        />
                    </fieldset>

                    <fieldset className="mb-4">
                        <label htmlFor="lastName">Last name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(evt) => setLastName(evt.target.value)}
                            className="form-control"
                            required
                        />
                    </fieldset>

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
                            Register
                        </button>
                    </fieldset>
                </form>

                <section className="register-page__login-link">
                    <Link className="gothic-auth-link" to="/login">
                        Already have an account?
                    </Link>
                </section>
            </section>
        </main>
    )
}