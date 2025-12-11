'use client';

import { useQuery } from '@tanstack/react-query';
import { format, addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProtectedLayout from '@/components/layout/protected-layout';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface DashboardData {
  period: { start: string; end: string };
  earnings: number;
  expenses: number;
  netProfit: number;
  bookingsByStatus: Record<string, number>;
  upcomingBookings: Array<{
    id: string;
    customerName: string;
    eventDate: string;
    eventType: string;
    hall: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard', format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const monthParam = format(currentMonth, 'yyyy-MM');
      const res = await fetch(`/api/dashboard?month=${monthParam}`);
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      INQUIRY: 'bg-gray-100 text-gray-800',
      TENTATIVE: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const isCurrentMonth = format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  // Calculate profit margin
  const profitMargin = data ? (data.earnings > 0 ? ((data.netProfit / data.earnings) * 100).toFixed(1) : 0) : 0;
  
  // Calculate total bookings
  const totalBookings = data ? Object.values(data.bookingsByStatus).reduce((sum, count) => sum + count, 0) : 0;
  
  // Calculate conversion rate (confirmed + completed / total)
  const conversionRate = data && totalBookings > 0 
    ? (((data.bookingsByStatus.CONFIRMED || 0) + (data.bookingsByStatus.COMPLETED || 0)) / totalBookings * 100).toFixed(1) 
    : 0;

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header with Month Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of business performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center min-w-[140px]">
              <p className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</p>
              {!isCurrentMonth && (
                <Button variant="link" size="sm" onClick={goToCurrentMonth} className="h-auto p-0 text-xs">
                  Go to current month
                </Button>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : data ? (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(data.earnings)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {totalBookings} bookings
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(data.expenses)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Operating costs</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.netProfit)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profitMargin}% margin
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {(data.bookingsByStatus.CONFIRMED || 0) + (data.bookingsByStatus.COMPLETED || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversionRate}% conversion rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{totalBookings}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {data.bookingsByStatus.INQUIRY || 0}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Pending Inquiries</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {data.upcomingBookings.length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Upcoming Events</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(data.bookingsByStatus).map(([status, count]) => (
                    <div key={status} className="text-center p-4 border rounded-lg">
                      <p className="text-3xl font-bold mb-2">{count}</p>
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Bookings (Next 30 Days)</CardTitle>
                <Link href="/calendar">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {data.upcomingBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No upcoming bookings
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.upcomingBookings.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/bookings/${booking.id}`}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.eventType} • {booking.hall}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                          </p>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Failed to load dashboard data
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
