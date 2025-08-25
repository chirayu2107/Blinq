"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChartIcon, Plus, Edit3, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { getFinancialData, saveFinancialData, type UserFinancialData, type ExpenseCategory } from "@/lib/storage"

const colorOptions = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#64748b",
  "#ec4899",
  "#10b981",
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null // Don't show labels for slices less than 5%

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ExpenseCategoriesChart() {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    color: colorOptions[0],
  })

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  const handleAddCategory = () => {
    if (!data || !formData.name || !formData.value) return

    const newCategory: ExpenseCategory = {
      name: formData.name,
      value: Number.parseFloat(formData.value),
      color: formData.color,
    }

    const updatedData = {
      ...data,
      expenseCategories: [...data.expenseCategories, newCategory],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingCategory(false)
    resetForm()
  }

  const handleEditCategory = (index: number) => {
    if (!data) return
    const category = data.expenseCategories[index]
    setEditingIndex(index)
    setFormData({
      name: category.name,
      value: category.value.toString(),
      color: category.color,
    })
  }

  const handleUpdateCategory = () => {
    if (!data || editingIndex === null) return

    const updatedCategories = [...data.expenseCategories]
    updatedCategories[editingIndex] = {
      name: formData.name,
      value: Number.parseFloat(formData.value),
      color: formData.color,
    }

    const updatedData = { ...data, expenseCategories: updatedCategories }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingIndex(null)
    resetForm()
  }

  const handleDeleteCategory = (index: number) => {
    if (!data) return

    const updatedData = {
      ...data,
      expenseCategories: data.expenseCategories.filter((_, i) => i !== index),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      color: colorOptions[0],
    })
  }

  if (!data) return null

  const hasData = data.expenseCategories.length > 0
  const totalExpenses = data.expenseCategories.reduce((sum, item) => sum + item.value, 0)

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
                <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
                  Expense Categories
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monthly spending breakdown by category</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setIsAddingCategory(true)} className="h-8 px-3">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {!hasData ? (
            <div className="text-center py-12">
              <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">No expense categories yet</p>
              <Button onClick={() => setIsAddingCategory(true)} size="sm">
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              <div className="w-full">
                <ChartContainer
                  config={{
                    expenses: {
                      label: "Expenses",
                    },
                  }}
                  className="h-48 sm:h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.expenseCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {data.expenseCategories.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-border/50 transition-colors"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold">{formatCurrency(item.value)}</p>
                        <p className="text-xs text-muted-foreground">
                          {totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isAddingCategory || editingIndex !== null}
        onOpenChange={() => {
          setIsAddingCategory(false)
          setEditingIndex(null)
          resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit" : "Add"} Expense Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Food & Dining"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="15000"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-10 p-0 ${formData.color === color ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              {editingIndex !== null && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteCategory(editingIndex)
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
                    setIsAddingCategory(false)
                    setEditingIndex(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingIndex !== null ? handleUpdateCategory : handleAddCategory}>
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
