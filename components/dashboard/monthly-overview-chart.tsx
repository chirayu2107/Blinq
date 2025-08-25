"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, Plus, Edit3, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { getFinancialData, saveFinancialData, type UserFinancialData, type MonthlyData } from "@/lib/storage"

export default function MonthlyOverviewChart() {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [isAddingData, setIsAddingData] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    month: "",
    budget: "",
    actual: "",
  })

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  const handleAddData = () => {
    if (!data || !formData.month || !formData.budget || !formData.actual) return

    const budget = Number.parseFloat(formData.budget)
    const actual = Number.parseFloat(formData.actual)

    const newEntry: MonthlyData = {
      month: formData.month,
      budget,
      actual,
      difference: budget - actual,
    }

    const updatedData = {
      ...data,
      monthlyData: [...data.monthlyData, newEntry],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingData(false)
    resetForm()
  }

  const handleEditData = (index: number) => {
    if (!data) return
    const entry = data.monthlyData[index]
    setEditingIndex(index)
    setFormData({
      month: entry.month,
      budget: entry.budget.toString(),
      actual: entry.actual.toString(),
    })
  }

  const handleUpdateData = () => {
    if (!data || editingIndex === null) return

    const budget = Number.parseFloat(formData.budget)
    const actual = Number.parseFloat(formData.actual)

    const updatedMonthlyData = [...data.monthlyData]
    updatedMonthlyData[editingIndex] = {
      month: formData.month,
      budget,
      actual,
      difference: budget - actual,
    }

    const updatedData = { ...data, monthlyData: updatedMonthlyData }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingIndex(null)
    resetForm()
  }

  const handleDeleteData = (index: number) => {
    if (!data) return

    const updatedData = {
      ...data,
      monthlyData: data.monthlyData.filter((_, i) => i !== index),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const resetForm = () => {
    setFormData({
      month: "",
      budget: "",
      actual: "",
    })
  }

  if (!data) return null

  const hasData = data.monthlyData.length > 0

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
                  Budget vs Actual
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monthly budget performance</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setIsAddingData(true)} className="h-8 px-3">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Add Data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!hasData ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">No budget data yet</p>
              <Button onClick={() => setIsAddingData(true)} size="sm">
                Add Your First Entry
              </Button>
            </div>
          ) : (
            <>
              <ChartContainer
                config={{
                  budget: {
                    label: "Budget",
                    color: "hsl(var(--primary))",
                  },
                  actual: {
                    label: "Actual",
                    color: "hsl(var(--chart-5))",
                  },
                }}
                className="h-64 sm:h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Recent Entries</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.monthlyData.slice(-3).map((entry, index) => {
                    const actualIndex = data.monthlyData.length - 3 + index
                    const isOverBudget = entry.actual > entry.budget
                    return (
                      <div
                        key={actualIndex}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center space-x-4 text-xs sm:text-sm">
                          <span className="font-medium">{entry.month}</span>
                          <span className="text-primary">Budget: ₹{(entry.budget / 1000).toFixed(1)}k</span>
                          <span className={isOverBudget ? "text-chart-5" : "text-chart-4"}>
                            Actual: ₹{(entry.actual / 1000).toFixed(1)}k
                          </span>
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
            <DialogTitle>{editingIndex !== null ? "Edit" : "Add"} Budget Data</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="actual">Actual (₹)</Label>
                <Input
                  id="actual"
                  type="number"
                  value={formData.actual}
                  onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                  placeholder="45000"
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
                  <Trash2 className="h-4 w-4 mr-2" />
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
