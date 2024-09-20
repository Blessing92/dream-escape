import React from "react"
import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn((callback) => {
      callback("SIGNED_IN", { user: { id: "123", email: "test@example.com" } })
      return () => {}
    }),
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => mockSupabase,
}))

afterEach(() => {
  cleanup()
})
