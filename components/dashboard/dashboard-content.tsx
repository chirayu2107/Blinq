"use client"

import FinancialMetricsCards from "./financial-metrics-cards"
import SavingsGoals from "./savings-goals"
import SpendingTrendsChart from "./spending-trends-chart"
import ExpenseCategoriesChart from "./expense-categories-chart"
import MonthlyOverviewChart from "./monthly-overview-chart"
import AIInsights from "./ai-insights"

export default function DashboardContent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Financial Metrics Cards */}
      <FinancialMetricsCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 order-2 xl:order-1">
          <SavingsGoals />
        </div>
        <div className="xl:col-span-2 order-1 xl:order-2">
          <SpendingTrendsChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-1">
          <ExpenseCategoriesChart />
        </div>
        <div className="order-2">
          <MonthlyOverviewChart />
        </div>
      </div>

      <AIInsights />
    </div>
  )
}
