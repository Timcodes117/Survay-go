import { IconFolder } from "@tabler/icons-react"

export default function AssetsPage() {
  return (
    <div className="flex-1 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <IconFolder className="size-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
            <p className="text-sm text-muted-foreground">Manage reusable files, media, and resources for your forms.</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            This page is ready for your assets library implementation.
          </p>
        </div>
      </div>
    </div>
  )
}
