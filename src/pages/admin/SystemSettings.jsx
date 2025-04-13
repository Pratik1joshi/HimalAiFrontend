import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from "../../components/ui/switch";
import { AlertCircle, Save, Server, Shield, Globe, Mail } from 'lucide-react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSavedMessage('Settings saved successfully');
      setTimeout(() => setSavedMessage(''), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {savedMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>{savedMessage}</span>
        </div>
      )}

      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="FinTrack Admin" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="site-url">Site URL</Label>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-gray-500" />
                  <Input id="site-url" defaultValue="https://fintrack.example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Maintenance Mode</Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Users will see a maintenance page when enabled</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require for Admins</p>
                    <p className="text-sm text-gray-500">Force admin users to set up 2FA</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Session Security</Label>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-logout</p>
                      <p className="text-sm text-gray-500">Automatically logout inactive users</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="timeout">Session timeout (minutes)</Label>
                    <Input id="timeout" type="number" defaultValue="30" min="5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <Input id="smtp-server" defaultValue="smtp.example.com" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="smtp-security">Security</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>TLS</option>
                    <option>SSL</option>
                    <option>None</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input id="smtp-username" defaultValue="admin@example.com" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" defaultValue="password" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" defaultValue="noreply@fintrack.com" />
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
