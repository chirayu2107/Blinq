"use client"

import type React from "react"
import { Zap } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login form submitted with:", { email, password: "***" })
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(email, password)
      console.log("[v0] Login result:", result)
      if (result.success) {
        console.log("[v0] Redirecting to dashboard")
        router.push("/dashboard")
      } else {
        console.log("[v0] Login failed:", result.error)
        setError(result.error || "Login failed")
      }
    } catch (error: unknown) {
      console.log("[v0] Login exception:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-sans mb-2">Welcome back to Blinq</h1>
            <p className="text-muted-foreground">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember for 30 days
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password
              </Link>
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
              {isLoading ? "Signing in..." : "Sign in"}
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
              Sign in with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Updated Gradient Background */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-secondary/20"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white p-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border border-white/30">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-sans">Welcome to Blinq</h2>
            <p className="text-lg opacity-90">Take control of your financial future with our comprehensive dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}
