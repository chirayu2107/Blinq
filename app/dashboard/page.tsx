"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const profile = {
    id: user.id,
    full_name: user.fullName,
    email: user.email,
  }

  return (
    <DashboardLayout>
      <DashboardHeader user={user} profile={profile} />
      <DashboardContent />
    </DashboardLayout>
  )
}
