 import { useNavigate } from "react-router-dom"


export default function Frontpage() {
    const navigate = useNavigate()

  return (
      <section className="frontpage-section">
        <h1 className="frontpage-title">
          Welcome to Cloudy with a chance of AI
        </h1>

        <p className="frontpage-subtext">weather app</p>

        <div className="frontpage-buttons">
          <button
            type="button"
            aria-label="Sign in or Sign up"
            onClick={() => console.log("Sign in / Sign up clicked")}
            className="frontpage-btn primary-btn"
          >
            Sign in / Sign up
          </button>

          <button
            type="button"
            aria-label="Continue without signing in"
            onClick={() => console.log("Continue without signing up/in clicked")}
            className="frontpage-btn secondary-btn"
          >
            Continue without signing up/in
          </button>
        </div>

        <p className="frontpage-footer">By continuing you agree to our terms and privacy policy.</p>
      </section>
  )
}
