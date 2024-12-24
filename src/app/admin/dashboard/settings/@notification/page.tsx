"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Notification() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your notification settings and preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch id="push-notifications" />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <Switch id="marketing-emails" />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="security-alerts">Security Alerts</Label>
            <Switch id="security-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
