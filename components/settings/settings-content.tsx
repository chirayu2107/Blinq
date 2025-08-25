"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Shield,
  Bell,
  Globe,
  Palette,
  Download,
  Trash2,
  Key,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  AlertTriangle,
} from "lucide-react"
import { useState, useEffect } from "react"

interface SettingsSectionProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}

function SettingsSection({ title, description, icon, children }: SettingsSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground font-sans">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

function ProfileSettings({ user, profile }: { user: any; profile: any }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <SettingsSection
      title="Profile Settings"
      description="Manage your personal information and profile details"
      icon={<User className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">Profile Picture</h4>
            <p className="text-sm text-muted-foreground">Update your profile photo</p>
            <Button variant="outline" size="sm" className="mt-2 border-border hover:bg-muted bg-transparent">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              defaultValue={profile?.full_name || ""}
              className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email || ""}
              className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="america/new_york">
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </SettingsSection>
  )
}

function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  return (
    <SettingsSection
      title="Security & Privacy"
      description="Manage your account security and privacy settings"
      icon={<Shield className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-6">
        {/* Password Change */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Change Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
            <Key className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </div>

        <Separator className="bg-border/50" />

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary border border-secondary/20">
              Not Enabled
            </Badge>
          </div>
          <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
            <Smartphone className="h-4 w-4 mr-2" />
            Enable 2FA
          </Button>
        </div>

        <Separator className="bg-border/50" />

        {/* Login Sessions */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Active Sessions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-muted/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-chart-4/10 rounded-lg border border-chart-4/20">
                  <Globe className="h-4 w-4 text-chart-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Current Session</p>
                  <p className="text-sm text-muted-foreground">Chrome on macOS • New York, NY</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-chart-4/10 text-chart-4 border border-chart-4/20">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  )
}

function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(false)

  return (
    <SettingsSection
      title="Notifications"
      description="Control how and when you receive notifications"
      icon={<Bell className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Budget Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
              </div>
            </div>
            <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Transaction Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified for every transaction</p>
              </div>
            </div>
            <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
          </div>
        </div>
      </div>
    </SettingsSection>
  )
}

function AppPreferences() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("inr")

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem("userCurrency") || "INR"
    setSelectedCurrency(savedCurrency.toLowerCase())
  }, [])

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value)
    localStorage.setItem("userCurrency", value.toUpperCase())
    // Trigger a page refresh to update all currency displays
    window.location.reload()
  }

  return (
    <SettingsSection
      title="App Preferences"
      description="Customize your app experience and data settings"
      icon={<Palette className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">INR (₹)</SelectItem>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="cad">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Data & Privacy</h4>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted bg-transparent">
              <Lock className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground text-destructive">Danger Zone</h4>
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  )
}

export default function SettingsContent({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="space-y-6">
      <ProfileSettings user={user} profile={profile} />
      <SecuritySettings />
      <NotificationSettings />
      <AppPreferences />
    </div>
  )
}
