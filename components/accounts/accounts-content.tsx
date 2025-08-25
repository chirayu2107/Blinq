"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
  Plus,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Edit3,
  Trash2,
} from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import {
  getFinancialData,
  saveFinancialData,
  type UserFinancialData,
  type Account,
  type Transaction,
} from "@/lib/storage"

const accountTypes = [
  { value: "checking", label: "Checking Account" },
  { value: "savings", label: "Savings Account" },
  { value: "credit", label: "Credit Card" },
  { value: "investment", label: "Investment Account" },
]

const bankOptions = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Other",
]

function AccountCard({ account, onEdit, onDelete }: { account: Account; onEdit: () => void; onDelete: () => void }) {
  const [balanceVisible, setBalanceVisible] = useState(true)

  const getAccountIcon = () => {
    switch (account.type) {
      case "checking":
        return <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
      case "savings":
        return <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6" />
      case "credit":
        return <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
      case "investment":
        return <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
      default:
        return <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
    }
  }

  const getAccountColor = () => {
    switch (account.type) {
      case "checking":
        return "text-primary bg-primary/10 border border-primary/20"
      case "savings":
        return "text-chart-4 bg-chart-4/10 border border-chart-4/20"
      case "credit":
        return "text-secondary bg-secondary/10 border border-secondary/20"
      case "investment":
        return "text-chart-3 bg-chart-3/10 border border-chart-3/20"
      default:
        return "text-muted-foreground bg-muted border border-border"
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={`p-2 sm:p-3 rounded-xl ${getAccountColor()} flex-shrink-0`}>{getAccountIcon()}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground font-sans text-sm sm:text-base truncate">{account.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {account.bank} • {account.accountNumber}
              </p>
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

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl font-bold text-foreground">
              {balanceVisible ? formatCurrency(account.balance) : "••••••"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="hover:bg-muted h-8 w-8 p-0"
            >
              {balanceVisible ? (
                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
          <Badge
            variant="secondary"
            className={
              account.status === "active"
                ? "bg-chart-4/10 text-chart-4 border border-chart-4/20"
                : "bg-muted text-muted-foreground border border-border"
            }
          >
            {account.status}
          </Badge>
        </div>

        {account.lastTransaction && (
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {account.lastTransaction.type === "credit" ? (
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4 flex-shrink-0" />
              ) : (
                <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-chart-5 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {account.lastTransaction.type === "credit" ? "+" : ""}
                  {formatCurrency(Math.abs(account.lastTransaction.amount))}
                </p>
                <p className="text-xs text-muted-foreground truncate">{account.lastTransaction.description}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {new Date(account.lastTransaction.date).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TransactionRow({ transaction, account }: { transaction: Transaction; account?: Account }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        {transaction.type === "credit" ? (
          <div className="p-2 bg-chart-4/10 rounded-lg border border-chart-4/20 flex-shrink-0">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4" />
          </div>
        ) : (
          <div className="p-2 bg-chart-5/10 rounded-lg border border-chart-5/20 flex-shrink-0">
            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-chart-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground text-sm sm:text-base truncate">{transaction.description}</p>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {account?.name} • {transaction.category}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p
          className={`font-semibold text-sm sm:text-base ${transaction.type === "credit" ? "text-chart-4" : "text-chart-5"}`}
        >
          {transaction.type === "credit" ? "+" : "-"}
          {formatCurrency(Math.abs(transaction.amount))}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default function AccountsContent({ user, profile }: { user: any; profile: any }) {
  const [data, setData] = useState<UserFinancialData | null>(null)
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "checking" as Account["type"],
    balance: "",
    accountNumber: "",
    bank: "",
    status: "active" as Account["status"],
  })

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  const handleAddAccount = () => {
    if (!data || !formData.name || !formData.accountNumber || !formData.bank) return

    const newAccount: Account = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      balance: Number.parseFloat(formData.balance) || 0,
      accountNumber: formData.accountNumber,
      bank: formData.bank,
      status: formData.status,
    }

    const updatedData = {
      ...data,
      accounts: [...data.accounts, newAccount],
    }

    setData(updatedData)
    saveFinancialData(updatedData)
    setIsAddingAccount(false)
    resetForm()
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      accountNumber: account.accountNumber,
      bank: account.bank,
      status: account.status,
    })
  }

  const handleUpdateAccount = () => {
    if (!data || !editingAccount || !formData.name || !formData.accountNumber || !formData.bank) return

    const updatedAccounts = data.accounts.map((account) =>
      account.id === editingAccount.id
        ? {
            ...account,
            name: formData.name,
            type: formData.type,
            balance: Number.parseFloat(formData.balance) || 0,
            accountNumber: formData.accountNumber,
            bank: formData.bank,
            status: formData.status,
          }
        : account,
    )

    const updatedData = { ...data, accounts: updatedAccounts }
    setData(updatedData)
    saveFinancialData(updatedData)
    setEditingAccount(null)
    resetForm()
  }

  const handleDeleteAccount = (accountId: string) => {
    if (!data) return

    const updatedData = {
      ...data,
      accounts: data.accounts.filter((account) => account.id !== accountId),
      transactions: data.transactions.filter((transaction) => transaction.accountId !== accountId),
    }

    setData(updatedData)
    saveFinancialData(updatedData)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "checking",
      balance: "",
      accountNumber: "",
      bank: "",
      status: "active",
    })
  }

  if (!data) return null

  const totalBalance = data.accounts.reduce((sum, account) => {
    return account.type === "credit" ? sum + account.balance : sum + account.balance
  }, 0)

  return (
    <>
      <div className="space-y-6">
        {/* Account Summary */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground font-sans">Total Net Worth</h2>
                  <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                onClick={() => setIsAddingAccount(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Grid */}
        {data.accounts.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No accounts added yet</p>
              <Button onClick={() => setIsAddingAccount(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {data.accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={() => handleEditAccount(account)}
                onDelete={() => handleDeleteAccount(account.id)}
              />
            ))}
          </div>
        )}

        {/* Recent Transactions */}
        {data.transactions.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
                  Recent Transactions
                </CardTitle>
                <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0">
                {data.transactions.slice(0, 5).map((transaction) => {
                  const account = data.accounts.find((acc) => acc.id === transaction.accountId)
                  return <TransactionRow key={transaction.id} transaction={transaction} account={account} />
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog
        open={isAddingAccount || !!editingAccount}
        onOpenChange={() => {
          setIsAddingAccount(false)
          setEditingAccount(null)
          resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit" : "Add"} Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Primary Checking"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Account["type"]) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="balance">Balance (₹)</Label>
                <Input
                  id="balance"
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bank">Bank</Label>
              <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankOptions.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="****1234"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Account["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingAccount(false)
                  setEditingAccount(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingAccount ? handleUpdateAccount : handleAddAccount}>
                {editingAccount ? "Update" : "Add"} Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
