import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SettingsContent from "@/components/settings/settings-content"

export default function SettingsPage() {
  const mockUser = {
    id: "local-user",
    email: "user@example.com",
    user_metadata: { full_name: "User" },
  }

  const mockProfile = {
    id: "local-user",
    full_name: "User",
    email: "user@example.com",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-sans">Settings</h1>
            <p className="text-muted-foreground text-lg mt-1">Manage your account and app preferences</p>
          </div>
        </div>
        <SettingsContent user={mockUser} profile={mockProfile} />
      </div>
    </DashboardLayout>
  )
}
