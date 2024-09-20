import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import App from "../../src/App"

vi.stubEnv("VITE_APP_SUPABASE_KEY", "mocked-supabase-key")

describe("App", () => {
  it("renders the App component", () => {
    render(<App />)

    screen.debug()
  })
})
