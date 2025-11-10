 import { useNavigate } from "react-router-dom"

/**
 * Frontpage Component
 * 
 * CONCEPT: Create Components - A functional component that serves as the landing page for the weather app.
 * Components are reusable, self-contained pieces of UI that return JSX.
 * 
 * CONCEPT: Hooks - Uses the useNavigate hook from React Router to programmatically navigate between pages.
 * Hooks let you "hook into" React features from functional components. They always start with "use".
 * 
 * This component demonstrates:
 * - Component creation with arrow function syntax
 * - Event handlers for button clicks
 * - Programmatic navigation using React Router
 */
export default function Frontpage() {
    console.log('🏠 Frontpage.jsx is rendering!')
    
    // CONCEPT: Hooks - useNavigate hook provides navigation functionality
    // This hook returns a function that can be called to navigate to different routes
    const navigate = useNavigate()

  return (
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
            aria-label="Continue without signing in"
            onClick={() =>  navigate("/Homepage")}
            className="frontpage-btn secondary-btn"
          >
            Continue
          </button>
        </div>

        <p className="frontpage-footer">By continuing you agree to our terms and privacy policy.</p>
      </section>
  )
}
