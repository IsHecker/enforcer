'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ApiKeyManager } from '@/components/keys/api-key-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import {
  Key,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function ApiKeysPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              API Keys Management
            </h1>
            <p className="text-muted-foreground mt-1">
              {user.role === 'creator'
                ? 'Create and manage API keys for your products and integrations'
                : 'Create and manage API keys to access subscribed services'
              }
            </p>
          </div>

          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            <Shield className="h-3 w-3 mr-1" />
            Secure Access
          </Badge>
        </div>

        {/* Security Best Practices */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Best Practices</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Follow these guidelines to keep your API keys secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Keep Keys Private</h4>
                  <p className="text-sm text-muted-foreground">
                    Never share your API keys in public repositories or client-side code
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Use Environment Variables</h4>
                  <p className="text-sm text-muted-foreground">
                    Store API keys in environment variables, not in your source code
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Rotate Keys Regularly</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate new API keys periodically and delete old ones
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Monitor Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    Regularly review API key usage and disable unused keys
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Manager */}
        <ApiKeyManager />

        {/* Usage Guidelines */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Usage Guidelines</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Important information about API key usage and limitations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Rate Limits Apply</p>
                <p className="text-sm text-muted-foreground">
                  Each API key is subject to the rate limits defined by your current subscription plan
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Key Expiration</p>
                <p className="text-sm text-muted-foreground">
                  Expired API keys will be automatically deactivated and cannot be used for requests
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <Key className="h-5 w-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Multiple Keys Supported</p>
                <p className="text-sm text-muted-foreground">
                  You can create multiple API keys for different environments (development, production, etc.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Example */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Integration Example</CardTitle>
            <CardDescription className="text-muted-foreground">
              Example of how to use your API key in requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">JavaScript/Node.js</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-sm text-foreground overflow-x-auto">
                    <code>{`const response = await fetch('https://api.proxyapi.com/weather/current', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">cURL</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-sm text-foreground overflow-x-auto">
                    <code>{`curl -X GET "https://api.proxyapi.com/weather/current" \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json"`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}