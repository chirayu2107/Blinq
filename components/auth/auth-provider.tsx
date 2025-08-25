"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, authStorage } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existingUser = authStorage.getUser()
    setUser(existingUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log("[v0] Login attempt for email:", email)
    try {
      const existingUser = authStorage.findUserByEmail(email)
      console.log("[v0] Found user:", existingUser)
      if (!existingUser) {
        console.log("[v0] User not found")
        return { success: false, error: "User not found" }
      }

      const isValidPassword = authStorage.validatePassword(email, password)
      console.log("[v0] Password validation result:", isValidPassword)
      if (!isValidPassword) {
        console.log("[v0] Invalid password")
        return { success: false, error: "Invalid password" }
      }

      authStorage.setUser(existingUser)
      setUser(existingUser)
      console.log("[v0] Login successful")
      return { success: true }
    } catch (error) {
      console.log("[v0] Login error:", error)
      return { success: false, error: "Login failed" }
    }
  }

  const signup = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    console.log("[v0] Signup attempt for:", { fullName, email })
    try {
      // Check if user already exists
      const existingUser = authStorage.findUserByEmail(email)
      console.log("[v0] Existing user check:", existingUser)
      if (existingUser) {
        console.log("[v0] User already exists")
        return { success: false, error: "User already exists" }
      }

      // Create new user
      const newUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
        email,
        fullName,
        createdAt: new Date().toISOString(),
      }

      console.log("[v0] Creating new user:", newUser)
      authStorage.addUser(newUser)
      authStorage.setPassword(email, password)
      authStorage.setUser(newUser)
      setUser(newUser)
      console.log("[v0] Signup successful")
      return { success: true }
    } catch (error) {
      console.log("[v0] Signup error:", error)
      return { success: false, error: "Signup failed" }
    }
  }

  const logout = () => {
    authStorage.removeUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
