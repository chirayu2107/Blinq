export interface UserFinancialData {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savings: number
  investments: number
  debt: number
  savingsGoals: SavingsGoal[]
  expenseCategories: ExpenseCategory[]
  monthlyData: MonthlyData[]
  spendingData: SpendingData[]
  accounts: Account[]
  transactions: Transaction[]
  budgetCategories: BudgetCategory[]
  budgetGoals: BudgetGoal[]
}

export interface SavingsGoal {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  icon: string
  color: string
}

export interface ExpenseCategory {
  name: string
  value: number
  color: string
}

export interface MonthlyData {
  month: string
  budget: number
  actual: number
  difference: number
}

export interface SpendingData {
  month: string
  income: number
  expenses: number
  savings: number
}

export interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment"
  balance: number
  accountNumber: string
  bank: string
  status: "active" | "inactive"
  lastTransaction?: {
    amount: number
    description: string
    date: string
    type: "credit" | "debit"
  }
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  description: string
  date: string
  type: "credit" | "debit"
  category: string
}

export interface BudgetCategory {
  id: string
  name: string
  icon: string
  budgetAmount: number
  spentAmount: number
  color: string
  period: "monthly" | "weekly" | "yearly"
  status: "on-track" | "warning" | "over-budget"
}

export interface BudgetGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

const STORAGE_KEY = "blinq_financial_data"

export function getFinancialData(): UserFinancialData {
  if (typeof window === "undefined") {
    return getDefaultData()
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error("Error parsing stored financial data:", error)
    }
  }

  return getDefaultData()
}

export function saveFinancialData(data: UserFinancialData): void {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getDefaultData(): UserFinancialData {
  return {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0,
    investments: 0,
    debt: 0,
    savingsGoals: [],
    expenseCategories: [],
    monthlyData: [],
    spendingData: [],
    accounts: [],
    transactions: [],
    budgetCategories: [],
    budgetGoals: [],
  }
}
