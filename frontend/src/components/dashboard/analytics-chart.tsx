'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dailyData = [
  { name: 'Mon', requests: 2400, revenue: 240, errors: 24 },
  { name: 'Tue', requests: 1398, revenue: 139, errors: 13 },
  { name: 'Wed', requests: 9800, revenue: 980, errors: 98 },
  { name: 'Thu', requests: 3908, revenue: 390, errors: 39 },
  { name: 'Fri', requests: 4800, revenue: 480, errors: 48 },
  { name: 'Sat', requests: 3800, revenue: 380, errors: 38 },
  { name: 'Sun', requests: 4300, revenue: 430, errors: 43 },
];

const weeklyData = [
  { name: 'Week 1', requests: 24000, revenue: 2400, errors: 240 },
  { name: 'Week 2', requests: 19800, revenue: 1980, errors: 198 },
  { name: 'Week 3', requests: 32000, revenue: 3200, errors: 320 },
  { name: 'Week 4', requests: 28000, revenue: 2800, errors: 280 },
];

const monthlyData = [
  { name: 'Jan', requests: 120000, revenue: 12000, errors: 1200 },
  { name: 'Feb', requests: 95000, revenue: 9500, errors: 950 },
  { name: 'Mar', requests: 140000, revenue: 14000, errors: 1400 },
  { name: 'Apr', requests: 125000, revenue: 12500, errors: 1250 },
  { name: 'May', requests: 160000, revenue: 16000, errors: 1600 },
  { name: 'Jun', requests: 145000, revenue: 14500, errors: 1450 },
];

type TimeRange = 'daily' | 'weekly' | 'monthly';
type ChartType = 'requests' | 'revenue' | 'errors';

interface AnalyticsChartProps {
  role: 'creator' | 'consumer' | 'admin';
}

export function AnalyticsChart({ role }: AnalyticsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [chartType, setChartType] = useState<ChartType>('requests');

  const getData = () => {
    switch (timeRange) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const getChartConfig = () => {
    switch (chartType) {
      case 'requests':
        return {
          dataKey: 'requests',
          color: '#3b82f6',
          title: 'API Requests',
          format: (value: number) => value.toLocaleString(),
        };
      case 'revenue':
        return {
          dataKey: 'revenue',
          color: '#10b981',
          title: 'Revenue',
          format: (value: number) => `$${value.toLocaleString()}`,
        };
      case 'errors':
        return {
          dataKey: 'errors',
          color: '#ef4444',
          title: 'Error Count',
          format: (value: number) => value.toLocaleString(),
        };
      default:
        return {
          dataKey: 'requests',
          color: '#3b82f6',
          title: 'API Requests',
          format: (value: number) => value.toLocaleString(),
        };
    }
  };

  const data = getData();
  const config = getChartConfig();

  const shouldShowRevenue = role === 'creator' || role === 'admin';

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Analytics Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              {config.title} over time
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Live Data
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex space-x-1">
            {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>

          <div className="flex space-x-1">
            <Button
              variant={chartType === 'requests' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('requests')}
            >
              Requests
            </Button>
            {shouldShowRevenue && (
              <Button
                variant={chartType === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('revenue')}
              >
                Revenue
              </Button>
            )}
            <Button
              variant={chartType === 'errors' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('errors')}
            >
              Errors
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full h-[300px]">
          {timeRange === 'daily' ? (
            <LineChart width={700} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={config.format} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [config.format(value), config.title]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={2}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart width={700} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={config.format} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [config.format(value), config.title]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey={config.dataKey} fill={config.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}