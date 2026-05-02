"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function ResponsesPage() {
  const [notificationsEmail, setNotificationsEmail] = useState("")

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 min-h-full flex flex-1">
      <ScrollArea className="h-full w-full pr-2">
        <div className="w-full space-y-6 pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Responses</h2>
            <p className="text-sm text-muted-foreground">
              Track form submissions, notification channels, and delivery health.
            </p>
          </div>

          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Live response delivery</AlertTitle>
            <AlertDescription>
              New responses can trigger email and webhook events immediately after submission.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Total Responses</p>
              <p className="text-2xl font-semibold mt-2">0</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Webhook Success Rate</p>
              <p className="text-2xl font-semibold mt-2">100%</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Last Submission</p>
              <p className="text-2xl font-semibold mt-2">-</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-medium">Response Notifications</h3>
              <p className="text-sm text-muted-foreground">Send internal alerts whenever a new response is submitted.</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="response-email">Notification Email</Label>
              <Input
                id="response-email"
                type="email"
                placeholder="alerts@yourcompany.com"
                value={notificationsEmail}
                onChange={(event) => setNotificationsEmail(event.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-sm font-medium">Email status</p>
                <p className="text-xs text-muted-foreground">Active once an address is configured.</p>
              </div>
              <span className="text-xs rounded-full border px-2 py-1 text-muted-foreground">
                {notificationsEmail ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
