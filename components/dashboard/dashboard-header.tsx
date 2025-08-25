"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter, Sparkles, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  user: any
  profile: any
}

const timeFilters = [
  { label: "12 months", value: "12m" },
  { label: "30 days", value: "30d", active: true },
  { label: "7 days", value: "7d" },
  { label: "24 hours", value: "24h" },
]

const exportOptions = [
  { label: "Export as PDF", value: "pdf" },
  { label: "Export as CSV", value: "csv" },
  { label: "Export as Excel", value: "excel" },
]

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const [activeFilter, setActiveFilter] = useState("30d")
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User"

  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`)
    // TODO: Implement actual export functionality
  }

  const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue)
    console.log(`Filter changed to: ${filterValue}`)
    // TODO: Implement actual filtering logic
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sans mb-2">
              Welcome back, {displayName}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Track your financial wellness and manage your money effectively.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted hover:border-primary/50 transition-colors bg-transparent text-xs sm:text-sm"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Select dates</span>
              <span className="sm:hidden">Dates</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted hover:border-primary/50 transition-colors bg-transparent text-xs sm:text-sm"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:bg-muted hover:border-primary/50 transition-colors bg-transparent text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {exportOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleExport(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 text-xs sm:text-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">AI Insights</span>
              <span className="sm:hidden">Insights</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(filter.value)}
              className={`transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md hover:shadow-lg"
                  : "border-border hover:bg-muted hover:border-primary/50 bg-transparent"
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
