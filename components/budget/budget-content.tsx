"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  PiggyBank,
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Plane,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Edit3,
  Trash2,
  Coffee,
  Gamepad2,
  Heart,
  Book,
  Shirt,
  Smartphone,
} from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import {
  getFinancialData,
  saveFinancialData,
  type UserFinancialData,
  type BudgetCategory,
  type BudgetGoal,
} from "@/lib/storage"

const iconOptions = [
  { name: "Shopping Cart", icon: ShoppingCart, value: "ShoppingCart" },
  { name: "Utensils", icon: Utensils, value: "Utensils" },
  { name: "Car", icon: Car, value: "Car" },
  { name: "Home", icon: Home, value: "Home" },
  { name: "Plane", icon: Plane, value: "Plane" },
  { name: "Target", icon: Target, value: "Target" },
  { name: "Coffee", icon: Coffee, value: "Coffee" },
  { name: "Gamepad", icon: Gamepad2, value: "Gamepad2" },
  { name: "Heart", icon: Heart, value: "Heart" },
  { name: "Book", icon: Book, value: "Book" },
  { name: "Shirt", icon: Shirt, value: "Shirt" },
  { name: "Smartphone", icon: Smartphone, value: "Smartphone" },
]

const colorOptions = [
  { name: "Primary", value: "primary", color: "hsl(var(--primary))" },
  { name: "Chart 1", value: "chart-1", color: "hsl(var(--chart-1))" },
  { name: "Chart 2", value: "chart-2", color: "hsl(var(--chart-2))" },
  { name: "Chart 3", value: "chart-3", color: "hsl(var(--chart-3))" },
  { name: "Chart 4", value: "chart-4", color: "hsl(var(--chart-4))" },
  { name: "Chart 5", value: "chart-5", color: "hsl(var(--chart-5))" },
  { name: "Secondary", value: "secondary", color: "hsl(var(--secondary))" },
]

function BudgetCategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: BudgetCategory
  onEdit: () => void
  onDelete: () => void
}) {
  const percentage = (category.spentAmount / category.budgetAmount) * 100
  const remaining = category.budgetAmount - category.spentAmount

  const getStatusIcon = () => {
    switch (category.status) {
      case "on-track":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4" />
      case "warning":
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
      case "over-budget":
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-chart-5" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (category.status) {
      case "on-track":
        return "bg-chart-4/10 text-chart-4 border border-chart-4/20"
      case "warning":
        return "bg-secondary/10 text-secondary border border-secondary/20"
      case "over-budget":
        return "bg-chart-5/10 text-chart-5 border border-chart-5/20"
      default:
        return "bg-muted text-muted-foreground border border-border"
    }
  }

  const getProgressColor = () => {
    if (percentage > 100) return "bg-chart-5"
    if (percentage > 80) return "bg-secondary"
    return "bg-chart-4"
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName)
    return iconOption ? iconOption.icon : ShoppingCart
  }

  const IconComponent = getIconComponent(category.icon)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div
              className={`p-2 sm:p-3 rounded-xl text-${category.color} bg-${category.color}/10 border border-${category.color}/20 flex-shrink-0`}
            >
              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground font-sans text-sm sm:text-base truncate">{category.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground capitalize">{category.period}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0 hover:bg-muted">
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-muted-foreground">Spent</span>
            <span className="font-semibold text-foreground text-xs sm:text-sm">
              {formatCurrency(category.spentAmount)} / {formatCurrency(category.budgetAmount)}
            </span>
          </div>

          <Progress value={Math.min(percentage, 100)} className="h-2">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </Progress>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge className={`text-xs ${getStatusColor()}`}>{category.status.replace("-", " ")}</Badge>
            </div>
            <span className={`text-xs sm:text-sm font-medium ${remaining >= 0 ? "text-chart-4" : "text-chart-5"}`}>
              {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BudgetGoalCard({ goal, onEdit, onDelete }: { goal: BudgetGoal; onEdit: () => void; onDelete: () => void }) {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground font-sans text-sm sm:text-base truncate">{goal.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{goal.category}</p>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border/50 text-xs">
              {daysLeft} days
            </Badge>
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0 hover:bg-muted">
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground text-xs sm:text-sm">
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </span>
          </div>

          <Progress value={percentage} className="h-2">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
          </Progress>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-primary font-medium">{percentage.toFixed(1)}% complete</span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {formatCurrency(remaining)} to go
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BudgetContent({ user, profile }: { user: any; profile: any }) {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null)
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "ShoppingCart",
    budgetAmount: "",
    spentAmount: "",
    color: "primary",
    period: "monthly" as BudgetCategory["period"],
  })
  const [goalForm, setGoalForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "",
  })

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  const calculateStatus = (spent: number, budget: number): BudgetCategory["status"] => {
    const percentage = (spent / budget) * 100
    if (percentage > 100) return "over-budget"
    if (percentage > 80) return "warning"
    return "on-track"
  }

  const handleAddCategory = () => {
    if (!data || !categoryForm.name || !categoryForm.budgetAmount) return

    const budgetAmount = Number.parseFloat(categoryForm.budgetAmount)
    const spentAmount = Number.parseFloat(categoryForm.spentAmount) || 0

    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: categoryForm.name,
      icon: categoryForm.icon,
      budgetAmount,
      spentAmount,
      color: categoryForm.color,
      period: categoryForm.period,
      status: calculateStatus(spentAmount, budgetAmount),
    }

    const updatedData = {
      ...data,
      budgetCategories: [...data.budgetCategories, newCategory],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingCategory(false)
    resetCategoryForm()
  }

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      budgetAmount: category.budgetAmount.toString(),
      spentAmount: category.spentAmount.toString(),
      color: category.color,
      period: category.period,
    })
  }

  const handleUpdateCategory = () => {
    if (!data || !editingCategory || !categoryForm.name || !categoryForm.budgetAmount) return

    const budgetAmount = Number.parseFloat(categoryForm.budgetAmount)
    const spentAmount = Number.parseFloat(categoryForm.spentAmount) || 0

    const updatedCategories = data.budgetCategories.map((category) =>
      category.id === editingCategory.id
        ? {
            ...category,
            name: categoryForm.name,
            icon: categoryForm.icon,
            budgetAmount,
            spentAmount,
            color: categoryForm.color,
            period: categoryForm.period,
            status: calculateStatus(spentAmount, budgetAmount),
          }
        : category,
    )

    const updatedData = { ...data, budgetCategories: updatedCategories }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingCategory(null)
    resetCategoryForm()
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (!data) return

    const updatedData = {
      ...data,
      budgetCategories: data.budgetCategories.filter((category) => category.id !== categoryId),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const handleAddGoal = () => {
    if (!data || !goalForm.title || !goalForm.targetAmount || !goalForm.deadline) return

    const newGoal: BudgetGoal = {
      id: Date.now().toString(),
      title: goalForm.title,
      targetAmount: Number.parseFloat(goalForm.targetAmount),
      currentAmount: Number.parseFloat(goalForm.currentAmount) || 0,
      deadline: goalForm.deadline,
      category: goalForm.category || "General",
    }

    const updatedData = {
      ...data,
      budgetGoals: [...data.budgetGoals, newGoal],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingGoal(false)
    resetGoalForm()
  }

  const handleEditGoal = (goal: BudgetGoal) => {
    setEditingGoal(goal)
    setGoalForm({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
    })
  }

  const handleUpdateGoal = () => {
    if (!data || !editingGoal || !goalForm.title || !goalForm.targetAmount || !goalForm.deadline) return

    const updatedGoals = data.budgetGoals.map((goal) =>
      goal.id === editingGoal.id
        ? {
            ...goal,
            title: goalForm.title,
            targetAmount: Number.parseFloat(goalForm.targetAmount),
            currentAmount: Number.parseFloat(goalForm.currentAmount) || 0,
            deadline: goalForm.deadline,
            category: goalForm.category || "General",
          }
        : goal,
    )

    const updatedData = { ...data, budgetGoals: updatedGoals }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingGoal(null)
    resetGoalForm()
  }

  const handleDeleteGoal = (goalId: string) => {
    if (!data) return

    const updatedData = {
      ...data,
      budgetGoals: data.budgetGoals.filter((goal) => goal.id !== goalId),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      icon: "ShoppingCart",
      budgetAmount: "",
      spentAmount: "",
      color: "primary",
      period: "monthly",
    })
  }

  const resetGoalForm = () => {
    setGoalForm({
      title: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      category: "",
    })
  }

  if (!data) return null

  const filteredCategories = data.budgetCategories.filter((category) => category.period === selectedPeriod)
  const totalBudget = filteredCategories.reduce((sum, category) => sum + category.budgetAmount, 0)
  const totalSpent = filteredCategories.reduce((sum, category) => sum + category.spentAmount, 0)
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const periods = [
    { label: "Monthly", value: "monthly" },
    { label: "Weekly", value: "weekly" },
    { label: "Yearly", value: "yearly" },
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Budget Overview */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
                  <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-chart-5/10 to-chart-5/5 rounded-xl border border-chart-5/10">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-chart-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-chart-4/10 to-chart-4/5 rounded-xl border border-chart-4/10">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Remaining</p>
                  <p className="text-lg sm:text-2xl font-bold text-chart-4">
                    {formatCurrency(totalBudget - totalSpent)}
                  </p>
                </div>
              </div>
            </div>
            {totalBudget > 0 && (
              <div className="mt-4 sm:mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Overall Budget Usage</span>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {overallPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={overallPercentage} className="h-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      overallPercentage > 90 ? "bg-chart-5" : overallPercentage > 75 ? "bg-secondary" : "bg-chart-4"
                    }`}
                    style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  />
                </Progress>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Period Filter and Add Budget Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className={
                  selectedPeriod === period.value
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted bg-transparent"
                }
              >
                {period.label}
              </Button>
            ))}
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setIsAddingCategory(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Budget Category
          </Button>
        </div>

        {/* Budget Categories */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground font-sans mb-4">Budget Categories</h2>
          {filteredCategories.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No budget categories for {selectedPeriod} period yet</p>
                <Button onClick={() => setIsAddingCategory(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCategories.map((category) => (
                <BudgetCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => handleEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Budget Goals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-sans">Savings Goals</h2>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted bg-transparent"
              onClick={() => setIsAddingGoal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
          {data.budgetGoals.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No savings goals yet</p>
                <Button onClick={() => setIsAddingGoal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {data.budgetGoals.map((goal) => (
                <BudgetGoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => handleEditGoal(goal)}
                  onDelete={() => handleDeleteGoal(goal.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog
        open={isAddingCategory || !!editingCategory}
        onOpenChange={() => {
          setIsAddingCategory(false)
          setEditingCategory(null)
          resetCategoryForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit" : "Add"} Budget Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g., Groceries"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetAmount">Budget Amount (₹)</Label>
                <Input
                  id="budgetAmount"
                  type="number"
                  value={categoryForm.budgetAmount}
                  onChange={(e) => setCategoryForm({ ...categoryForm, budgetAmount: e.target.value })}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="spentAmount">Spent Amount (₹)</Label>
                <Input
                  id="spentAmount"
                  type="number"
                  value={categoryForm.spentAmount}
                  onChange={(e) => setCategoryForm({ ...categoryForm, spentAmount: e.target.value })}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {iconOptions.slice(0, 6).map((option) => (
                    <Button
                      key={option.value}
                      variant={categoryForm.icon === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryForm({ ...categoryForm, icon: option.value })}
                      className="h-10"
                    >
                      <option.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {colorOptions.slice(0, 6).map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      onClick={() => setCategoryForm({ ...categoryForm, color: option.value })}
                      className={`h-10 ${categoryForm.color === option.value ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Period</Label>
              <Select
                value={categoryForm.period}
                onValueChange={(value: BudgetCategory["period"]) => setCategoryForm({ ...categoryForm, period: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingCategory(false)
                  setEditingCategory(null)
                  resetCategoryForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog
        open={isAddingGoal || !!editingGoal}
        onOpenChange={() => {
          setIsAddingGoal(false)
          setEditingGoal(null)
          resetGoalForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit" : "Add"} Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalTitle">Goal Title</Label>
              <Input
                id="goalTitle"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="e.g., Emergency Fund"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={goalForm.targetAmount}
                  onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                  placeholder="100000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={goalForm.currentAmount}
                  onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={goalForm.category}
                  onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                  placeholder="e.g., Savings"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingGoal(false)
                  setEditingGoal(null)
                  resetGoalForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingGoal ? handleUpdateGoal : handleAddGoal}>
                {editingGoal ? "Update" : "Add"} Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
