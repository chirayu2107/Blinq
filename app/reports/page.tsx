import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ReportsContent from "@/components/reports/reports-content"

export default function ReportsPage() {
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
            <h1 className="text-3xl font-bold text-foreground font-sans">Reports & Analytics</h1>
            <p className="text-muted-foreground text-lg mt-1">Detailed insights into your financial patterns</p>
          </div>
        </div>
        <ReportsContent user={mockUser} profile={mockProfile} />
      </div>
    </DashboardLayout>
  )
}
