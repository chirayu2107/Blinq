"use client"

import type React from "react"
import { Zap } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signup, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Signup form submitted with:", { fullName, email, password: "***" })
    setIsLoading(true)
    setError(null)

    if (password.length < 8) {
      console.log("[v0] Password too short")
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const result = await signup(fullName, email, password)
      console.log("[v0] Signup result:", result)
      if (result.success) {
        console.log("[v0] Redirecting to dashboard")
        router.push("/dashboard")
      } else {
        console.log("[v0] Signup failed:", result.error)
        setError(result.error || "Signup failed")
      }
    } catch (error: unknown) {
      console.log("[v0] Signup exception:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-sans mb-2">Join Blinq</h1>
            <p className="text-muted-foreground">Start your financial wellness journey today.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/25 transition-all duration-200"
            >
              {isLoading ? "Creating account..." : "Get started"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border text-foreground hover:bg-muted bg-transparent transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Updated Financial Dashboard Preview */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-8">
        <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground font-sans">Blinq Dashboard</h3>
            </div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-chart-5 rounded-full"></div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-chart-4 rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Balance</span>
              <span className="text-lg font-bold text-foreground">₹2,04,580.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Income</span>
              <span className="text-lg font-bold text-chart-4">₹70,420.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Expenses</span>
              <span className="text-lg font-bold text-chart-5">₹47,680.30</span>
            </div>
          </div>

          <div className="mt-6 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl flex items-end justify-center p-4 border border-primary/10">
            <div className="w-full h-16 bg-gradient-to-t from-primary to-primary/80 rounded-lg opacity-80"></div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-3 font-sans">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-4/10 rounded-full flex items-center justify-center border border-chart-4/20">
                  <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Salary Deposit</p>
                  <p className="text-xs text-muted-foreground">+₹23,840.00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-5/10 rounded-full flex items-center justify-center border border-chart-5/20">
                  <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Grocery Shopping</p>
                  <p className="text-xs text-muted-foreground">-₹1,289.50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
