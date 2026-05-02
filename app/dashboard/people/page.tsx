import { Users2 } from "lucide-react"

export default function PeoplePage() {
  return (
    <div className="flex-1 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <Users2 className="size-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">People</h1>
            <p className="text-sm text-muted-foreground">Manage collaborators, roles, and access to your workspace.</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            This page is ready for your team and permissions management UI.
          </p>
        </div>
      </div>
    </div>
  )
}
