import { TypographyH1, TypographyP } from "@/components/ui/typography"

export default function RecentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <TypographyH1>Recent Activity</TypographyH1>
        <TypographyP className="text-muted-foreground">
          View your recent activity and updates.
        </TypographyP>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Items</h2>
        <p className="text-muted-foreground">
          Your recently accessed files and projects.
        </p>
      </div>
    </div>
  )
}

