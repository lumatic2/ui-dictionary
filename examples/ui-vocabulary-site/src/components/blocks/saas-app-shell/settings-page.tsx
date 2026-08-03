/**
 * Askewly Design (M18) — original settings page for the saas-app-shell block
 * (dashboard-01 ships none). Structure informed by common admin settings
 * layouts (sectioned cards: profile / workspace / notifications); no external
 * code absorbed.
 */
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function SettingsPage({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-2 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear to other members of this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="settings-name">Name</Label>
            <Input id="settings-name" defaultValue={user.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" type="email" defaultValue={user.email} />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Defaults applied to every member of this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="settings-language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="settings-language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="settings-timezone">Timezone</Label>
            <Select defaultValue="asia-seoul">
              <SelectTrigger id="settings-timezone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-seoul">Asia/Seoul (UTC+9)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="america-la">America/Los_Angeles (UTC−8)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what this workspace is allowed to send you.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="settings-digest">Weekly digest</Label>
              <p className="text-sm text-muted-foreground">A summary of activity every Monday.</p>
            </div>
            <Switch id="settings-digest" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="settings-mentions">Mentions</Label>
              <p className="text-sm text-muted-foreground">Email me when someone mentions me.</p>
            </div>
            <Switch id="settings-mentions" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="settings-marketing">Product updates</Label>
              <p className="text-sm text-muted-foreground">Occasional news about new features.</p>
            </div>
            <Switch id="settings-marketing" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
