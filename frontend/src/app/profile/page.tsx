'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  Plus,
  Trash2,
  Settings,
  Upload,
  Camera,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Creator',
    email: 'john@company.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@company.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'mike@company.com',
    role: 'editor',
    status: 'pending',
    joinedAt: '2024-01-20T00:00:00Z',
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'team'>('profile');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const { user } = useAuth();

  if (!user) return null;

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleSaveOrganization = () => {
    toast.success('Organization settings updated successfully');
  };

  const handleInviteTeamMember = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date().toISOString(),
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast.success('Team member removed');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'admin': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'editor': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Profile & Organization
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings, organization details, and team members
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-1 p-1 bg-muted/30 rounded-lg">
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('profile')}
                className="h-8"
              >
                Profile
              </Button>
              <Button
                variant={activeTab === 'organization' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('organization')}
                className="h-8"
              >
                Organization
              </Button>
              <Button
                variant={activeTab === 'team' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('team')}
                className="h-8"
              >
                Team
              </Button>
            </div>
          </div>

          {activeTab === 'profile' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue={user.name || ''}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email || ''}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about API activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of suspicious activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive product updates and tips
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add extra security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'organization' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Company Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      defaultValue="My API Company"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">Description</Label>
                    <Textarea
                      id="companyDescription"
                      placeholder="Describe your company..."
                      className="min-h-[80px]"
                      defaultValue="We build amazing APIs for developers worldwide."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted/50 border border-r-0 border-input rounded-l-md">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted/50 border border-r-0 border-input rounded-l-md">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="supportEmail"
                        type="email"
                        placeholder="support@example.com"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle>Branding & Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brand Colors</Label>
                    <div className="flex space-x-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Primary</Label>
                        <div className="w-12 h-8 bg-primary rounded border cursor-pointer"></div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Secondary</Label>
                        <div className="w-12 h-8 bg-secondary rounded border cursor-pointer"></div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Accent</Label>
                        <div className="w-12 h-8 bg-accent rounded border cursor-pointer"></div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Custom Domain</Label>
                      <p className="text-sm text-muted-foreground">
                        Use your own domain for API endpoints
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                      Pro Feature
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>White-label Documentation</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove ProxyAPI branding from docs
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                      Enterprise
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Analytics Widget</Label>
                      <p className="text-sm text-muted-foreground">
                        Embeddable analytics for your website
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Members</span>
                    <Badge variant="outline" className="ml-auto">
                      {teamMembers.length} members
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge className={getStatusBadgeColor(member.status)}>
                            {member.status}
                          </Badge>
                          {member.role !== 'owner' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTeamMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardHeader>
                  <CardTitle>Invite Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="inviteEmail" className="sr-only">Email</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <select
                        className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <Button onClick={handleInviteTeamMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>

                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p><strong>Admin:</strong> Full access except billing and team management</p>
                    <p><strong>Editor:</strong> Can create and edit API products and documentation</p>
                    <p><strong>Viewer:</strong> Read-only access to analytics and documentation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={activeTab === 'profile' ? handleSaveProfile :
                activeTab === 'organization' ? handleSaveOrganization :
                  () => toast.success('Team settings updated')}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}