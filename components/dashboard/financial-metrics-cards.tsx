"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Wallet, AlertTriangle, Edit3 } from "lucide-react"
import { formatCurrencyCompact, getUserCurrency, type Currency } from "@/lib/currency"
import { getFinancialData, saveFinancialData, type UserFinancialData } from "@/lib/storage"

interface MetricCardProps {
  title: string
  value: number
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  description?: string
  onEdit: () => void
  currency: Currency
}

function MetricCard({ title, value, change, changeType, icon, description, onEdit, currency }: MetricCardProps) {
  const changeColor = {
    positive: "text-chart-4",
    negative: "text-chart-5",
    neutral: "text-muted-foreground",
  }[changeType]

  const changeBg = {
    positive: "bg-chart-4/10",
    negative: "bg-chart-5/10",
    neutral: "bg-muted/50",
  }[changeType]

  const TrendIcon = changeType === "positive" ? TrendingUp : changeType === "negative" ? TrendingDown : null

  return (
    <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10 flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground truncate">
                {formatCurrencyCompact(value, currency)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit} className="flex-shrink-0 h-8 w-8 p-0 hover:bg-primary/10">
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${changeBg} ${changeColor} border border-current/20`}
          >
            {TrendIcon && <TrendIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
            <span>{change}</span>
          </div>
          {description && <p className="text-xs text-muted-foreground hidden sm:block">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function FinancialMetricsCards() {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [editingMetric, setEditingMetric] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [currency, setCurrency] = useState<Currency>("INR")

  useEffect(() => {
    setData(getFinancialData())
    setCurrency(getUserCurrency())
  }, [])

  const handleEdit = (metric: string, currentValue: number) => {
    setEditingMetric(metric)
    setEditValue(currentValue.toString())
  }

  const handleSave = () => {
    if (!data || !editingMetric) return

    const newValue = Number.parseFloat(editValue) || 0
    const updatedData = { ...data, [editingMetric]: newValue }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingMetric(null)
    setEditValue("")
  }

  if (!data) return null

  const getCurrencySymbol = (currency: Currency) => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", CAD: "C$", INR: "₹" }
    return symbols[currency]
  }

  const metrics = [
    {
      key: "totalBalance",
      title: "Total Balance",
      value: data.totalBalance,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />,
      description: "vs last month",
    },
    {
      key: "monthlyIncome",
      title: "Monthly Income",
      value: data.monthlyIncome,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-chart-4" />,
      description: "vs last month",
    },
    {
      key: "monthlyExpenses",
      title: "Monthly Expenses",
      value: data.monthlyExpenses,
      change: "+3.1%",
      changeType: "negative" as const,
      icon: <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-chart-5" />,
      description: "vs last month",
    },
    {
      key: "savings",
      title: "Savings",
      value: data.savings,
      change: "+15.8%",
      changeType: "positive" as const,
      icon: <PiggyBank className="h-4 w-4 sm:h-6 sm:w-6 text-secondary" />,
      description: "vs last month",
    },
    {
      key: "investments",
      title: "Investments",
      value: data.investments,
      change: "+7.3%",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-chart-3" />,
      description: "vs last month",
    },
    {
      key: "debt",
      title: "Debt",
      value: data.debt,
      change: "-5.2%",
      changeType: "positive" as const,
      icon: <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-secondary" />,
      description: "vs last month",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.key}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            description={metric.description}
            onEdit={() => handleEdit(metric.key, metric.value)}
            currency={currency}
          />
        ))}
      </div>

      <Dialog open={!!editingMetric} onOpenChange={() => setEditingMetric(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit {editingMetric?.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ({getCurrencySymbol(currency)})</Label>
              <Input
                id="amount"
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Enter amount"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingMetric(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
