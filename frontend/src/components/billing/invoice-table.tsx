'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Download, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  downloadUrl?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 89.99,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-02-15',
    dueDate: '2024-03-15',
    amount: 89.99,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
  },
  {
    id: '3',
    number: 'INV-2024-003',
    date: '2024-03-15',
    dueDate: '2024-04-15',
    amount: 89.99,
    status: 'pending',
    description: 'Pro Plan - Monthly Subscription',
  },
  {
    id: '4',
    number: 'INV-2024-004',
    date: '2024-04-15',
    dueDate: '2024-05-15',
    amount: 129.99,
    status: 'overdue',
    description: 'Pro Plan + Overages',
  },
];

export function InvoiceTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDownload = (invoice: Invoice): void => {
    // Simulate PDF download
    console.log(`Downloading invoice ${invoice.number}`);
  };

  const handleView = (invoice: Invoice): void => {
    // Open invoice details modal
    console.log(`Viewing invoice ${invoice.number}`);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Invoice History</CardTitle>
            <CardDescription className="text-muted-foreground">
              View and download your billing history
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {filteredInvoices.length} invoices
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background/50 border-border/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Invoice #</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Due Date</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      {invoice.number}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.date)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(invoice.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(invoice.status)}
                          <span className="capitalize">{invoice.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {invoice.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleView(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownload(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No invoices found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              Showing {filteredInvoices.length} of {mockInvoices.length} invoices
            </span>
            <div className="flex items-center space-x-2">
              <span>Total Amount:</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}