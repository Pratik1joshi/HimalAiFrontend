import React, { useState } from "react";
import { Save, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    pointsPerBankStatement: 100,
    pointsPerCreditCardStatement: 50,
    bonusPointsForMultiple: 50,
    minPointsForRedemption: 500,
    maintenanceMode: false,
    newUserRegistration: true,
    autoApproveAccounts: false,
    emailNotifications: true,
    apiKey: "sk_test_abcdefghijklmnopqrstuvwxyz"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      
      // Reset saved state after a moment
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            "Saving..."
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Points Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Points System</CardTitle>
            <CardDescription>Configure how points are earned and redeemed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pointsPerBankStatement">Points per Bank Statement</Label>
              <Input 
                id="pointsPerBankStatement"
                type="number"
                value={settings.pointsPerBankStatement}
                onChange={(e) => setSettings({...settings, pointsPerBankStatement: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pointsPerCreditCardStatement">Points per Credit Card Statement</Label>
              <Input 
                id="pointsPerCreditCardStatement"
                type="number"
                value={settings.pointsPerCreditCardStatement}
                onChange={(e) => setSettings({...settings, pointsPerCreditCardStatement: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bonusPointsForMultiple">Bonus Points for Multiple Statements</Label>
              <Input 
                id="bonusPointsForMultiple"
                type="number"
                value={settings.bonusPointsForMultiple}
                onChange={(e) => setSettings({...settings, bonusPointsForMultiple: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPointsForRedemption">Minimum Points for Redemption</Label>
              <Input 
                id="minPointsForRedemption"
                type="number"
                value={settings.minPointsForRedemption}
                onChange={(e) => setSettings({...settings, minPointsForRedemption: parseInt(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Put the entire site into maintenance mode
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newUserRegistration">New User Registration</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow new users to sign up
                </p>
              </div>
              <Switch
                id="newUserRegistration"
                checked={settings.newUserRegistration}
                onCheckedChange={(checked) => setSettings({...settings, newUserRegistration: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoApproveAccounts">Auto-approve New Accounts</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Skip manual approval step for new users
                </p>
              </div>
              <Switch
                id="autoApproveAccounts"
                checked={settings.autoApproveAccounts}
                onCheckedChange={(checked) => setSettings({...settings, autoApproveAccounts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Send email notifications to users and admins
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage API keys and external integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input 
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                />
                <Button variant="outline">Regenerate</Button>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Keep this key secret. Don't share it in client-side code.
              </p>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t p-4 flex justify-end">
            <Button variant="outline" size="sm">Advanced Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
