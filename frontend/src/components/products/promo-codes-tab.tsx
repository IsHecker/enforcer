'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Tag, Trash2, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  duration: 'once' | 'forever' | 'repeating';
  durationMonths?: number;
  maxRedemptions?: number;
  redemptionsCount: number;
  expiryDate?: string;
  isActive: boolean;
}

const mockPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME2024',
    discountType: 'percentage',
    discountValue: 20,
    duration: 'once',
    redemptionsCount: 15,
    maxRedemptions: 100,
    isActive: true,
  },
  {
    id: '2',
    code: 'LAUNCH_OFFER',
    discountType: 'fixed_amount',
    discountValue: 10,
    duration: 'repeating',
    durationMonths: 3,
    redemptionsCount: 42,
    isActive: true,
  }
];

export function PromoCodesTab() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(mockPromoCodes);

  const handleDelete = (id: string) => {
    setPromoCodes(prev => prev.filter(pc => pc.id !== id));
    toast.success('Promo code deleted');
  };

  const toggleStatus = (id: string) => {
    setPromoCodes(prev => prev.map(pc =>
      pc.id === id ? { ...pc, isActive: !pc.isActive } : pc
    ));
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Promo Codes</h3>
          <p className="text-muted-foreground text-sm">
            Manage discount codes and promotional offers for your API product.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Promo Code
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No promo codes created yet.
                  </TableCell>
                </TableRow>
              ) : (
                promoCodes.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell className="font-mono font-medium">{pc.code}</TableCell>
                    <TableCell>
                      {pc.discountType === 'percentage'
                        ? `${pc.discountValue}% off`
                        : `$${pc.discountValue} off`}
                    </TableCell>
                    <TableCell>
                      {pc.duration === 'once' ? 'Once' :
                        pc.duration === 'forever' ? 'Forever' :
                          `${pc.durationMonths} months`}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{pc.redemptionsCount} used</span>
                        {pc.maxRedemptions && (
                          <span className="text-xs text-muted-foreground">Limit: {pc.maxRedemptions}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pc.isActive ? "secondary" : "outline"}
                        className={pc.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                        onClick={() => toggleStatus(pc.id)}
                        role="button"
                      >
                        {pc.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(pc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
