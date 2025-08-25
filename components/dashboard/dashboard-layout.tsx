"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, CreditCard, PiggyBank, FileText, Settings, Search, Menu, X, LogOut, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: CreditCard },
  { name: "Budget", href: "/budget", icon: PiggyBank },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    // Clear all local storage data
    localStorage.clear()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-sidebar shadow-2xl border-r border-sidebar-border">
            <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground font-sans">Blinq</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-sidebar-accent/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-sidebar-border p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground font-sans">Blinq</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="px-6 py-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                />
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-sidebar-border p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 lg:hidden">
          <div className="flex h-16 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 shadow-sm">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="hover:bg-primary/10">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground font-sans">Blinq</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
