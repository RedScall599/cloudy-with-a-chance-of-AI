 import { useNavigate } from "react-router-dom"
export default function Frontpage() {
    // This hook returns a function that can be called to navigate to different routes
    const navigate = useNavigate()

  return (
    <div className="frontpage-container">
      <section className="frontpage-section">
        <h1 className="frontpage-title">
          Welcome to Cloudy with a chance of AI
        </h1>

        <p className="frontpage-subtext">weather app</p>

        <div className="frontpage-buttons">
          

          {/* 
            CONCEPT: Hooks in Action - Using the navigate function from useNavigate hook
            to programmatically change routes when user clicks the button
          */}
          <button
            type="button"
            aria-label="Continue"
            onClick={() =>  navigate("/Homepage")}
            className="frontpage-btn secondary-btn"
          >
            Continue
          </button>
        </div>

        <p className="frontpage-footer">By continuing you agree to our terms and privacy policy.</p>
      </section>
    </div>
  )
}
