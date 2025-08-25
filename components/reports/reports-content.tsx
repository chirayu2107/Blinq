"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChartIcon,
  Download,
  CalendarIcon,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/currency"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ReactNode
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
              {icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          <div
            className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
              changeType === "positive"
                ? "bg-chart-4/10 text-chart-4 border border-chart-4/20"
                : "bg-chart-5/10 text-chart-5 border border-chart-5/20"
            }`}
          >
            {changeType === "positive" ? (
              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IncomeExpenseChart({ data }: { data: any[] }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
                Income vs Expenses
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monthly comparison over time</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            income: { label: "Income", color: "hsl(var(--chart-4))" },
            expenses: { label: "Expenses", color: "hsl(var(--chart-5))" },
          }}
          className="h-64 sm:h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => formatCurrency(value / 1000) + "k"}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function ExpenseCategoriesChart({ data }: { data: any[] }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
            <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">Expense Categories</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Spending breakdown by category</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 space-y-3">
            {data.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-xs sm:text-sm font-medium text-foreground">{category.name}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  {formatCurrency(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TopMerchantsTable({ data }: { data: any[] }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">Top Merchants</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">Your most frequent spending destinations</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {data.map((merchant, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center border border-primary/10">
                  <span className="text-xs sm:text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{merchant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {merchant.transactions} transactions • {merchant.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatCurrency(merchant.amount)}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReportsContent({ user, profile }: { user: any; profile: any }) {
  const [selectedPeriod, setSelectedPeriod] = useState("12m")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [accountFilter, setAccountFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [weeklySpendingData, setWeeklySpendingData] = useState<any[]>([])
  const [topMerchantsData, setTopMerchantsData] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    // Load data from localStorage
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    const accountsData = JSON.parse(localStorage.getItem("accounts") || "[]")
    const budgets = JSON.parse(localStorage.getItem("budgets") || "[]")

    setAccounts(accountsData)

    // Generate monthly data from transactions
    const monthlyStats = generateMonthlyData(transactions)
    setMonthlyData(monthlyStats)

    // Generate category data from budgets and transactions
    const categoryStats = generateCategoryData(transactions, budgets)
    setCategoryData(categoryStats)

    // Generate weekly spending data
    const weeklyStats = generateWeeklyData(transactions)
    setWeeklySpendingData(weeklyStats)

    // Generate top merchants data
    const merchantStats = generateMerchantData(transactions)
    setTopMerchantsData(merchantStats)
  }, [selectedPeriod, categoryFilter, accountFilter, dateRange])

  const generateMonthlyData = (transactions: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()

    return months.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getFullYear() === currentYear && months[transactionDate.getMonth()] === month
      })

      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      return {
        month,
        income,
        expenses,
        savings: income - expenses,
        investments: income * 0.15, // Assume 15% goes to investments
      }
    })
  }

  const generateCategoryData = (transactions: any[], budgets: any[]) => {
    const categoryTotals: { [key: string]: number } = {}
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--secondary))",
      "hsl(var(--muted-foreground))",
    ]

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      })

    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }))
  }

  const generateWeeklyData = (transactions: any[]) => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return weeks.map((week, index) => {
      const weekStart = new Date(currentYear, currentMonth, index * 7 + 1)
      const weekEnd = new Date(currentYear, currentMonth, (index + 1) * 7)

      const weekTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate >= weekStart && transactionDate <= weekEnd && t.type === "expense"
      })

      const amount = weekTransactions.reduce((sum, t) => sum + t.amount, 0)

      return { week, amount }
    })
  }

  const generateMerchantData = (transactions: any[]) => {
    const merchantTotals: { [key: string]: { amount: number; transactions: number; category: string } } = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const merchant = t.description || "Unknown Merchant"
        if (!merchantTotals[merchant]) {
          merchantTotals[merchant] = { amount: 0, transactions: 0, category: t.category }
        }
        merchantTotals[merchant].amount += t.amount
        merchantTotals[merchant].transactions += 1
      })

    return Object.entries(merchantTotals)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }

  const periods = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "3 Months", value: "3m" },
    { label: "12 Months", value: "12m" },
  ]

  const categories = ["all", "Food", "Transportation", "Shopping", "Entertainment", "Healthcare", "Other"]

  const exportData = () => {
    const data = {
      monthlyData,
      categoryData,
      weeklySpendingData,
      topMerchantsData,
      filters: { period: selectedPeriod, category: categoryFilter, account: accountFilter, dateRange },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-report-${format(new Date(), "yyyy-MM-dd")}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate metrics from current data
  const avgIncome = monthlyData.reduce((sum, m) => sum + m.income, 0) / Math.max(monthlyData.length, 1)
  const avgExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0) / Math.max(monthlyData.length, 1)
  const savingsRate = avgIncome > 0 ? ((avgIncome - avgExpenses) / avgIncome) * 100 : 0
  const netWorthGrowth = monthlyData.reduce((sum, m) => sum + m.savings, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
              className={
                selectedPeriod === period.value
                  ? "bg-primary text-primary-foreground text-xs sm:text-sm"
                  : "border-border hover:bg-muted bg-transparent text-xs sm:text-sm"
              }
            >
              {period.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-muted bg-transparent text-xs sm:text-sm"
              >
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Custom Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>

          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-muted bg-transparent text-xs sm:text-sm"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filter Reports</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="account">Account</Label>
                  <Select value={accountFilter} onValueChange={setAccountFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCategoryFilter("all")
                      setAccountFilter("all")
                      setDateRange({})
                    }}
                  >
                    Clear All
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>Apply</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={exportData}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(categoryFilter !== "all" || accountFilter !== "all" || dateRange.from) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {categoryFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              <span>Category: {categoryFilter}</span>
              <button onClick={() => setCategoryFilter("all")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {accountFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              <span>Account: {accounts.find((a) => a.id === accountFilter)?.name || accountFilter}</span>
              <button onClick={() => setAccountFilter("all")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {dateRange.from && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              <span>
                {format(dateRange.from, "MMM dd")} - {dateRange.to ? format(dateRange.to, "MMM dd") : "Present"}
              </span>
              <button onClick={() => setDateRange({})}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Average Monthly Income"
          value={formatCurrency(avgIncome)}
          change="+5.2%"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />}
        />
        <MetricCard
          title="Average Monthly Expenses"
          value={formatCurrency(avgExpenses)}
          change="+2.1%"
          changeType="negative"
          icon={<TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />}
        />
        <MetricCard
          title="Monthly Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          change="+3.4%"
          changeType="positive"
          icon={<Target className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />}
        />
        <MetricCard
          title="Net Worth Growth"
          value={formatCurrency(netWorthGrowth)}
          change="+8.7%"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <IncomeExpenseChart data={monthlyData} />
        <ExpenseCategoriesChart data={categoryData} />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <TopMerchantsTable data={topMerchantsData} />
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
              Weekly Spending Trend
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">Spending pattern over the last 4 weeks</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklySpendingData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Amount"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
