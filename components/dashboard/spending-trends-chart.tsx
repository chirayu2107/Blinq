"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Plus, Edit3 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { getFinancialData, saveFinancialData, type UserFinancialData, type SpendingData } from "@/lib/storage"

export default function SpendingTrendsChart() {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [isAddingData, setIsAddingData] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    month: "",
    income: "",
    expenses: "",
    savings: "",
  })

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  const handleAddData = () => {
    if (!data || !formData.month) return

    const newEntry: SpendingData = {
      month: formData.month,
      income: Number.parseFloat(formData.income) || 0,
      expenses: Number.parseFloat(formData.expenses) || 0,
      savings: Number.parseFloat(formData.savings) || 0,
    }

    const updatedData = {
      ...data,
      spendingData: [...data.spendingData, newEntry],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingData(false)
    resetForm()
  }

  const handleEditData = (index: number) => {
    if (!data) return
    const entry = data.spendingData[index]
    setEditingIndex(index)
    setFormData({
      month: entry.month,
      income: entry.income.toString(),
      expenses: entry.expenses.toString(),
      savings: entry.savings.toString(),
    })
  }

  const handleUpdateData = () => {
    if (!data || editingIndex === null) return

    const updatedSpendingData = [...data.spendingData]
    updatedSpendingData[editingIndex] = {
      month: formData.month,
      income: Number.parseFloat(formData.income) || 0,
      expenses: Number.parseFloat(formData.expenses) || 0,
      savings: Number.parseFloat(formData.savings) || 0,
    }

    const updatedData = { ...data, spendingData: updatedSpendingData }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingIndex(null)
    resetForm()
  }

  const handleDeleteData = (index: number) => {
    if (!data) return

    const updatedData = {
      ...data,
      spendingData: data.spendingData.filter((_, i) => i !== index),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const resetForm = () => {
    setFormData({
      month: "",
      income: "",
      expenses: "",
      savings: "",
    })
  }

  if (!data) return null

  const hasData = data.spendingData.length > 0

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
                  Spending Trends
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Monthly income, expenses, and savings over time
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasData && (
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-chart-4/10 text-chart-4 border border-chart-4/20">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium">+8.2%</span>
                </div>
              )}
              <Button size="sm" onClick={() => setIsAddingData(true)} className="h-8 px-3">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Add Data</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!hasData ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">No spending data yet</p>
              <Button onClick={() => setIsAddingData(true)} size="sm">
                Add Your First Entry
              </Button>
            </div>
          ) : (
            <>
              <ChartContainer
                config={{
                  income: {
                    label: "Income",
                    color: "hsl(var(--chart-4))",
                  },
                  expenses: {
                    label: "Expenses",
                    color: "hsl(var(--chart-5))",
                  },
                  savings: {
                    label: "Savings",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-64 sm:h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.spendingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="var(--color-income)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "var(--color-income)",
                        strokeWidth: 2,
                        fill: "hsl(var(--background))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="var(--color-expenses)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-expenses)", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "var(--color-expenses)",
                        strokeWidth: 2,
                        fill: "hsl(var(--background))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="var(--color-savings)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-savings)", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "var(--color-savings)",
                        strokeWidth: 2,
                        fill: "hsl(var(--background))",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Recent Entries</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.spendingData.slice(-3).map((entry, index) => {
                    const actualIndex = data.spendingData.length - 3 + index
                    return (
                      <div
                        key={actualIndex}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center space-x-4 text-xs sm:text-sm">
                          <span className="font-medium">{entry.month}</span>
                          <span className="text-chart-4">₹{(entry.income / 1000).toFixed(1)}k</span>
                          <span className="text-chart-5">₹{(entry.expenses / 1000).toFixed(1)}k</span>
                          <span className="text-primary">₹{(entry.savings / 1000).toFixed(1)}k</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditData(actualIndex)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isAddingData || editingIndex !== null}
        onOpenChange={() => {
          setIsAddingData(false)
          setEditingIndex(null)
          resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit" : "Add"} Spending Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                placeholder="e.g., Jan 2024"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="income">Income (₹)</Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expenses">Expenses (₹)</Label>
                <Input
                  id="expenses"
                  type="number"
                  value={formData.expenses}
                  onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                  placeholder="35000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="savings">Savings (₹)</Label>
                <Input
                  id="savings"
                  type="number"
                  value={formData.savings}
                  onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                  placeholder="15000"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-between">
              {editingIndex !== null && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteData(editingIndex)
                    setEditingIndex(null)
                    resetForm()
                  }}
                >
                  Delete
                </Button>
              )}
              <div className="flex space-x-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingData(false)
                    setEditingIndex(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingIndex !== null ? handleUpdateData : handleAddData}>
                  {editingIndex !== null ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
