'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  TrendingUp,
  Gift,
  Calendar,
  Clock,
  CheckCircle2,
  Wallet,
  Plus,
  CreditCard,
  Trash2,
  Star,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-fit bg-secondary/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-foreground">Overview</TabsTrigger>
            <TabsTrigger value="transaction-history" className="data-[state=active]:bg-primary/10 data-[state=active]:text-foreground">Transaction History</TabsTrigger>
            <TabsTrigger value="payout-history" className="data-[state=active]:bg-primary/10 data-[state=active]:text-foreground">Payout History</TabsTrigger>
            <TabsTrigger value="payment-methods" className="data-[state=active]:bg-primary/10 data-[state=active]:text-foreground">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card className="border-border/40 bg-card/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-foreground mb-4">Available Balance</h2>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold tracking-tight text-foreground">$0.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Ready for withdrawal</p>
                  </div>

                  <div className="flex items-center space-x-2 bg-transparent border border-border/50 p-3 rounded-md">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm text-foreground">
                      Payout method not connected. <Link href="#" className="text-blue-500 hover:text-blue-400 text-sm">Connect payout method</Link>
                    </p>
                  </div>

                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button disabled variant="secondary" className="w-[180px] justify-start bg-secondary/50 text-muted-foreground cursor-not-allowed">
                          <Wallet className="mr-2 h-4 w-4" />
                          Withdraw Funds
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[460px] bg-[#0a0a0a] border-border/40 p-6 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold">Withdraw Funds</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-sm mt-1.5 px-0">
                            Transfer funds from your wallet to your connected payout method
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-2 pb-6">
                          <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Available</span>
                            <div className="text-[28px] font-bold text-foreground leading-none tracking-tight">$0.00</div>
                            <p className="text-[11px] text-muted-foreground mt-1">Available for withdrawal</p>
                          </div>

                          <div className="h-[1px] bg-border/40 w-full" />

                          <div className="space-y-3">
                            <label className="text-[13px] font-medium text-foreground">Withdrawal Amount</label>
                            <div className="relative border border-border/40 rounded-md bg-transparent flex items-center h-10 px-3">
                              <span className="text-muted-foreground text-sm font-medium mr-1.5">$</span>
                              <Input className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 text-sm w-full rounded-none" placeholder="0.00" />
                            </div>
                            <div className="text-[11px] text-muted-foreground pt-1">
                              Minimum: $25.00 * Maximum: $0.00
                            </div>
                            <div className="grid grid-cols-4 gap-3 pt-2">
                              <Button variant="outline" className="bg-transparent border-border/40 h-8 text-xs font-medium hover:bg-white/5 transition-colors">25%</Button>
                              <Button variant="outline" className="bg-transparent border-border/40 h-8 text-xs font-medium hover:bg-white/5 transition-colors">50%</Button>
                              <Button variant="outline" className="bg-transparent border-border/40 h-8 text-xs font-medium hover:bg-white/5 transition-colors">75%</Button>
                              <Button variant="outline" className="bg-transparent border-border/40 h-8 text-xs font-medium hover:bg-white/5 transition-colors">Max</Button>
                            </div>
                          </div>

                          <div className="h-[1px] bg-border/40 w-full" />

                          <div className="space-y-3">
                            <label className="text-[13px] font-medium text-foreground">Payout Destination</label>
                            <div className="flex items-center space-x-3 p-3.5 rounded-md border border-border/40 bg-[#121212]">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-[13px] font-medium text-foreground">Connected Stripe Account</span>
                            </div>

                            <div className="flex items-start space-x-3 p-3.5 rounded-md border border-border/40 bg-[#121212]">
                              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-[2px]" />
                              <div className="flex flex-col text-[12px] text-foreground space-y-0.5">
                                <span>Funds typically arrive in 2-7 business days.</span>
                                <span>Processing fee: $0.00</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="flex w-full justify-between sm:justify-between items-center sm:space-x-0 pt-0">
                          <Button variant="outline" className="border-border/40 bg-transparent hover:bg-white/5 h-9 px-6 text-[13px]">Cancel</Button>
                          <Button className="bg-white text-black hover:bg-white/90 h-9 px-6 text-[13px] font-medium rounded-[6px]">
                            <Wallet className="mr-2 h-[14px] w-[14px]" />
                            Withdraw
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <p className="text-sm text-muted-foreground mt-2">
                      Minimum withdrawal is $25.00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/40 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium tracking-normal text-foreground">Lifetime Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">$50.00</div>
                  <p className="text-xs text-muted-foreground">Since account creation</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium tracking-normal text-foreground">Available Credits</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">$2.33</div>
                  <p className="text-xs text-muted-foreground">Promotional balance</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium tracking-normal text-foreground">Earned This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">$0.00</div>
                  <p className="text-xs text-muted-foreground">January 2026</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium tracking-normal text-foreground">Next Scheduled Payout</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-muted-foreground">No scheduled payout</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/40 bg-card/50 border-none shadow-none bg-transparent">
                <CardContent className="p-4 flex items-center space-x-4 px-0">
                  <div className="h-8 w-8 rounded-full border border-green-500/30 flex items-center justify-center shrink-0 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground leading-none mb-1">Last Payout Completed</h4>
                    <p className="text-xs text-muted-foreground">Dec 14, 2025 at 02:16 AM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="transaction-history">
            {/* Empty content as per current UI mockup focus */}
          </TabsContent>
          <TabsContent value="payout-history">
          </TabsContent>
          <TabsContent value="payment-methods" className="space-y-6 mt-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-foreground">Payment Methods</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your payment methods for subscriptions</p>
              </div>
              <Button className="bg-white text-black hover:bg-white/90 font-medium hidden sm:flex">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>

            <div className="space-y-4 shadow-none">
              <Card className="border-border/40 bg-card/10 shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-16 bg-[#171f2a] rounded-md flex items-center justify-center shrink-0 border border-border/20">
                        <CreditCard className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium leading-none text-foreground flex items-center">
                            Visa •••• 4242
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/10 font-normal hover:text-green-500 rounded px-2 py-0 text-[11px] shadow-none">Default</Badge>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/10 font-normal hover:text-blue-400 rounded px-2 py-0 text-[11px] shadow-none">Active</Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/10 font-normal hover:text-purple-400 rounded px-2 flex items-center py-0 text-[11px] shadow-none">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <div className="flex space-x-1"><span className="text-muted-foreground">Type:</span> <span className="font-medium text-foreground">CreditCard</span></div>
                          <div className="flex space-x-1"><span className="text-muted-foreground">Expires:</span> <span className="font-medium text-foreground">05/2067</span></div>
                          <div className="flex space-x-1"><span className="text-muted-foreground">Verified At:</span> <span className="font-medium text-foreground">Nov 29, 2025, 09:15 PM</span></div>
                        </div>
                        <div className="text-sm flex items-center">
                          <span className="text-muted-foreground mr-1">Billing:</span> <span className="font-medium text-foreground">EG</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="text-red-400 border-border/40 bg-transparent hover:bg-red-950/20 hover:text-red-400 h-8 text-xs font-normal px-3">
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/10 shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-16 bg-[#171f2a] rounded-md flex items-center justify-center shrink-0 border border-border/20">
                        <CreditCard className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium leading-none text-foreground flex items-center">
                            Mastercard •••• 4444
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/10 font-normal hover:text-blue-400 rounded px-2 py-0 text-[11px] shadow-none">Active</Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/10 font-normal hover:text-purple-400 rounded px-2 flex items-center py-0 text-[11px] shadow-none">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <div className="flex space-x-1"><span className="text-muted-foreground">Type:</span> <span className="font-medium text-foreground">CreditCard</span></div>
                          <div className="flex space-x-1"><span className="text-muted-foreground">Expires:</span> <span className="font-medium text-foreground">03/2033</span></div>
                          <div className="flex space-x-1"><span className="text-muted-foreground">Verified At:</span> <span className="font-medium text-foreground">Jan 7, 2026, 02:04 AM</span></div>
                        </div>
                        <div className="text-sm flex items-center">
                          <span className="text-muted-foreground mr-1">Billing:</span> <span className="font-medium text-foreground">EG</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" className="text-foreground border-transparent bg-transparent hover:bg-secondary h-8 text-xs font-normal px-3">
                        <Star className="mr-1.5 h-3.5 w-3.5" />
                        Set Default
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 border-border/40 bg-transparent hover:bg-red-950/20 hover:text-red-400 h-8 text-xs font-normal px-3">
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
