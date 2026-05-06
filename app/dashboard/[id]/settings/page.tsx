"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, ChevronDown, Save, Webhook } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookSecret, setWebhookSecret] = useState("")
  const [isVerifyingWebhook, setIsVerifyingWebhook] = useState(false)
  const [visibility, setVisibility] = useState("only-me")
  const [successRedirectUrl, setSuccessRedirectUrl] = useState("")
  const [responseRetentionDays, setResponseRetentionDays] = useState("90")
  const [customHeaders, setCustomHeaders] = useState('{\n  "x-source": "survay-go"\n}')
  const isWebhookConnected = Boolean(webhookUrl.trim())

  const handleVerifyWebhook = async () => {
    if (!webhookUrl || !webhookSecret) return
    setIsVerifyingWebhook(true)
    setTimeout(() => {
      setIsVerifyingWebhook(false)
    }, 900)
  }

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 min-h-full flex flex-1">
      <ScrollArea className="h-full w-full pr-2">
        <div className="w-full max-w-[760px] mx-auto space-y-5 pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
            <p className="text-sm text-muted-foreground">Configure webhook delivery and form submission behavior.</p>
          </div>

          <Collapsible className="my-2 ">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-between px-0 hover:bg-transparent"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <Webhook size={16} />
                    <h3 className="text-base font-medium">Outgoing Webhooks</h3>
                    <span
                      className={
                        isWebhookConnected
                          ? "inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                      }
                    >
                      {isWebhookConnected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send each new form response to your own API endpoint using an HTTP POST request.
                  </p>
                </div>
                <ChevronDown size={16} className="text-muted-foreground" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-5 px-6 pt-10">
              {/* <Alert className="py-2">
                {webhookUrl ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{webhookUrl ? "Endpoint configured" : "Add your endpoint URL"}</AlertTitle>
                <AlertDescription>
                  {webhookUrl
                    ? "Responses will be delivered as JSON payloads to your API."
                    : "Configure a webhook URL to enable automated response forwarding."}
                </AlertDescription>
              </Alert> */}

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://api.yourdomain.com/webhooks/form-responses"
                  value={webhookUrl}
                  onChange={(event) => setWebhookUrl(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We will send `application/json` payloads for each successful submission.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Signing Secret</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="Required for signed webhook delivery"
                  value={webhookSecret}
                  onChange={(event) => setWebhookSecret(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Important: your endpoint should verify this signature for every webhook request.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-headers">Custom Headers (optional JSON)</Label>
                <Textarea
                  id="custom-headers"
                  rows={4}
                  value={customHeaders}
                  onChange={(event) => setCustomHeaders(event.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={handleVerifyWebhook}
                  disabled={!webhookUrl || !webhookSecret || isVerifyingWebhook}
                >
                  {isVerifyingWebhook ? "Verifying..." : "Verify webhook"}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <hr className="my-4" />

          <div className="p-6 space-y-4">
            <h3 className="text-base font-medium">Submission Defaults</h3>
            <p className="text-sm text-muted-foreground">Basic behavior applied after a user submits your form.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="only-me">Only me</SelectItem>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirect-url">Success Redirect URL</Label>
                <Input
                  id="redirect-url"
                  type="url"
                  placeholder="https://yourdomain.com/thank-you"
                  value={successRedirectUrl}
                  onChange={(event) => setSuccessRedirectUrl(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-days">Response Retention (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  min={1}
                  max={3650}
                  value={responseRetentionDays}
                  onChange={(event) => setResponseRetentionDays(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="rounded-full">
              <Save size={15} />
              Save settings
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
