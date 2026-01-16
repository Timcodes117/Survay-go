import { TypographyH1, TypographyP } from "@/components/ui/typography"

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <TypographyH1>Account Settings</TypographyH1>
        <TypographyP className="text-muted-foreground">
          Manage your account settings and preferences.
        </TypographyP>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <p className="text-muted-foreground">
          Update your profile information and account details.
        </p>
      </div>
    </div>
  )
}

