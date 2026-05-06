"use client"

import { useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ChartContainer, type ChartConfig, ChartTooltip } from "@/components/ui/chart"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type RangeKey = "24h" | "7d" | "30d"

export default function ResponsesPage() {
  const [notificationsEmail, setNotificationsEmail] = useState("")
  const [selectedRange, setSelectedRange] = useState<RangeKey>("24h")
  const stats = [
    { label: "Total Responses", value: "0" },
    { label: "Webhook Success Rate", value: "100%" },
    { label: "Last Submission", value: "-" },
  ]
  const chartConfig: ChartConfig = {
    responses: {
      label: "Responses",
      color: "#2563eb",
    },
  }
  const chartDataByRange: Record<RangeKey, Array<{ label: string; responses: number }>> = {
    "24h": [
      { label: "00:00", responses: 2 },
      { label: "04:00", responses: 3 },
      { label: "08:00", responses: 6 },
      { label: "12:00", responses: 9 },
      { label: "16:00", responses: 7 },
      { label: "20:00", responses: 5 },
      { label: "Now", responses: 4 },
    ],
    "7d": [
      { label: "Mon", responses: 12 },
      { label: "Tue", responses: 18 },
      { label: "Wed", responses: 14 },
      { label: "Thu", responses: 21 },
      { label: "Fri", responses: 16 },
      { label: "Sat", responses: 8 },
      { label: "Sun", responses: 11 },
    ],
    "30d": [
      { label: "W1", responses: 58 },
      { label: "W2", responses: 74 },
      { label: "W3", responses: 62 },
      { label: "W4", responses: 88 },
      { label: "W5", responses: 69 },
    ],
  }

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 min-h-full flex flex-1">
      <ScrollArea className="h-full w-full pr-2">
        <div className="w-full max-w-[760px] mx-auto space-y-6 pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Responses</h2>
            <p className="text-sm text-muted-foreground">
              Track form submissions, notification channels, and delivery health.
            </p>
          </div>

          {/* <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Live response delivery</AlertTitle>
            <AlertDescription>
              New responses can trigger email and webhook events immediately after submission.
            </AlertDescription>
          </Alert> */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl  p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-medium">Response Trend</h3>
                <p className="text-sm text-muted-foreground">Track submissions across 24 hours, 7 days, or 30 days.</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-1">
                {(["24h", "7d", "30d"] as const).map((range) => (
                  <Button
                    key={range}
                    type="button"
                    size="sm"
                    variant={selectedRange === range ? "default" : "ghost"}
                    className="h-7 px-3 text-xs"
                    onClick={() => setSelectedRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={chartDataByRange[selectedRange]} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={18} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="responses"
                  stroke="var(--color-responses)"
                  strokeWidth={3}
                  strokeOpacity={1}
                  connectNulls
                  dot={{ r: 4, fill: "var(--color-responses)", stroke: "var(--color-responses)" }}
                  activeDot={{ r: 6, fill: "var(--color-responses)", stroke: "var(--color-responses)" }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <Collapsible className="rounded-xl border bg-card px-5 py-3">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
                <div className="space-y-1 text-left">
                  <h3 className="text-base font-medium">Response Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Send internal alerts whenever a new response is submitted.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs rounded-full border px-2 py-1 text-muted-foreground">
                    {notificationsEmail.trim() ? "Enabled" : "Disabled"}
                  </span>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="response-notifications-email">Notification Email</Label>
                <Input
                  id="response-notifications-email"
                  type="email"
                  placeholder="alerts@yourcompany.com"
                  value={notificationsEmail}
                  onChange={(event) => setNotificationsEmail(event.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="button" className="rounded-full" disabled={!notificationsEmail.trim()}>
                  Update notifications
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  )
}
