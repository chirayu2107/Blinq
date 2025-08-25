"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Target, Home, Car, Plane, Plus, Edit3, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { getFinancialData, saveFinancialData, type UserFinancialData, type SavingsGoal } from "@/lib/storage"

const iconOptions = [
  { name: "Target", icon: Target, value: "Target" },
  { name: "Home", icon: Home, value: "Home" },
  { name: "Car", icon: Car, value: "Car" },
  { name: "Plane", icon: Plane, value: "Plane" },
]

const colorOptions = [
  { name: "Blue", value: "bg-blue-500", color: "#3b82f6" },
  { name: "Green", value: "bg-green-500", color: "#22c55e" },
  { name: "Purple", value: "bg-purple-500", color: "#8b5cf6" },
  { name: "Orange", value: "bg-orange-500", color: "#f97316" },
  { name: "Red", value: "bg-red-500", color: "#ef4444" },
  { name: "Cyan", value: "bg-cyan-500", color: "#06b6d4" },
]

export default function SavingsGoals() {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    currentAmount: "",
    targetAmount: "",
    icon: "Target",
    color: "bg-blue-500",
  })

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  const handleAddGoal = () => {
    if (!data || !formData.name || !formData.targetAmount) return

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: formData.name,
      currentAmount: Number.parseFloat(formData.currentAmount) || 0,
      targetAmount: Number.parseFloat(formData.targetAmount),
      icon: formData.icon,
      color: formData.color,
    }

    const updatedData = {
      ...data,
      savingsGoals: [...data.savingsGoals, newGoal],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingGoal(false)
    resetForm()
  }

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      currentAmount: goal.currentAmount.toString(),
      targetAmount: goal.targetAmount.toString(),
      icon: goal.icon,
      color: goal.color,
    })
  }

  const handleUpdateGoal = () => {
    if (!data || !editingGoal || !formData.name || !formData.targetAmount) return

    const updatedGoals = data.savingsGoals.map((goal) =>
      goal.id === editingGoal.id
        ? {
            ...goal,
            name: formData.name,
            currentAmount: Number.parseFloat(formData.currentAmount) || 0,
            targetAmount: Number.parseFloat(formData.targetAmount),
            icon: formData.icon,
            color: formData.color,
          }
        : goal,
    )

    const updatedData = { ...data, savingsGoals: updatedGoals }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingGoal(null)
    resetForm()
  }

  const handleDeleteGoal = (goalId: string) => {
    if (!data) return

    const updatedData = {
      ...data,
      savingsGoals: data.savingsGoals.filter((goal) => goal.id !== goalId),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      currentAmount: "",
      targetAmount: "",
      icon: "Target",
      color: "bg-blue-500",
    })
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName)
    return iconOption ? iconOption.icon : Target
  }

  if (!data) return null

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold">Savings Goals</CardTitle>
            <Button size="sm" onClick={() => setIsAddingGoal(true)} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {data.savingsGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">No savings goals yet</p>
              <Button onClick={() => setIsAddingGoal(true)} size="sm">
                Add Your First Goal
              </Button>
            </div>
          ) : (
            data.savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const IconComponent = getIconComponent(goal.icon)

              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`p-2 ${goal.color} rounded-lg text-white flex-shrink-0`}>
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">{goal.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                      <Button variant="ghost" size="sm" onClick={() => handleEditGoal(goal)} className="h-8 w-8 p-0">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isAddingGoal || !!editingGoal}
        onOpenChange={() => {
          setIsAddingGoal(false)
          setEditingGoal(null)
          resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit" : "Add"} Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Emergency Fund"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="100000"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {iconOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.icon === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, icon: option.value })}
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
                  {colorOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, color: option.value })}
                      className={`h-10 ${formData.color === option.value ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className={`w-4 h-4 rounded-full ${option.value}`} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              {editingGoal && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteGoal(editingGoal.id)
                    setEditingGoal(null)
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
                    setIsAddingGoal(false)
                    setEditingGoal(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingGoal ? handleUpdateGoal : handleAddGoal}>
                  {editingGoal ? "Update" : "Add"} Goal
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
