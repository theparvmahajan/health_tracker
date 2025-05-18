import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">{children}</div>
}
