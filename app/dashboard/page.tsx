'use client';

import { useQuery } from '@tanstack/react-query';
import { format, addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProtectedLayout from '@/components/layout/protected-layout';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight, Eye, ArrowRight, Sparkles } from 'lucide-react';

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
      INQUIRY: 'bg-slate-100 text-slate-700 border border-slate-200',
      TENTATIVE: 'bg-amber-50 text-amber-700 border border-amber-200',
      CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-200',
      COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      CANCELLED: 'bg-red-50 text-red-700 border border-red-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToCurrentMonth = () => setCurrentMonth(new Date());
  const isCurrentMonth = format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  const profitMargin = data ? (data.earnings > 0 ? ((data.netProfit / data.earnings) * 100).toFixed(1) : 0) : 0;
  const totalBookings = data ? Object.values(data.bookingsByStatus).reduce((sum, count) => sum + count, 0) : 0;
  const conversionRate = data && totalBookings > 0 
    ? (((data.bookingsByStatus.CONFIRMED || 0) + (data.bookingsByStatus.COMPLETED || 0)) / totalBookings * 100).toFixed(1) 
    : 0;

  return (
    <ProtectedLayout>
      <div className="space-y-5 lg:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Overview of business performance</p>
          </div>
          
          <div className="flex items-center gap-1.5 bg-white border rounded-xl p-1 shadow-sm">
            <button
              onClick={goToPreviousMonth}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <div className="text-center min-w-[120px] px-2">
              <p className="text-sm font-semibold text-slate-900">{format(currentMonth, 'MMMM yyyy')}</p>
              {!isCurrentMonth && (
                <button onClick={goToCurrentMonth} className="text-[11px] text-blue-600 hover:text-blue-700 font-medium">
                  Current month
                </button>
              )}
            </div>
            <button
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="skeleton-shimmer h-4 w-24 rounded mb-3" />
                  <div className="skeleton-shimmer h-8 w-32 rounded mb-2" />
                  <div className="skeleton-shimmer h-3 w-20 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data ? (
          <>
            {/* Stats Cards */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Earnings</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-lg lg:text-2xl font-bold text-emerald-600">{formatCurrency(data.earnings)}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{totalBookings} bookings</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500" />
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Expenses</span>
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <p className="text-lg lg:text-2xl font-bold text-red-600">{formatCurrency(data.expenses)}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Operating costs</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Profit</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className={`text-lg lg:text-2xl font-bold ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(data.netProfit)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{profitMargin}% margin</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Confirmed</span>
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-violet-600" />
                    </div>
                  </div>
                  <p className="text-lg lg:text-2xl font-bold text-violet-600">
                    {(data.bookingsByStatus.CONFIRMED || 0) + (data.bookingsByStatus.COMPLETED || 0)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{conversionRate}% conversion</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats + Status Grid */}
            <div className="grid gap-3 lg:gap-4 grid-cols-3">
              <Card className="border-0 shadow-sm card-hover">
                <CardContent className="p-4 lg:pt-6 text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">{totalBookings}</p>
                  <p className="text-xs text-slate-500 mt-1">Total Bookings</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm card-hover">
                <CardContent className="p-4 lg:pt-6 text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-amber-600">{data.bookingsByStatus.INQUIRY || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Inquiries</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm card-hover">
                <CardContent className="p-4 lg:pt-6 text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-blue-600">{data.upcomingBookings.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Upcoming</p>
                </CardContent>
              </Card>
            </div>

            {/* Bookings by Status */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Bookings by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {Object.entries(data.bookingsByStatus).map(([status, count]) => (
                    <div key={status} className="text-center p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-2xl font-bold text-slate-900 mb-1.5">{count}</p>
                      <Badge className={`text-[10px] font-semibold ${getStatusColor(status)}`}>{status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Bookings */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
                <Link href="/calendar">
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {data.upcomingBookings.length === 0 ? (
                  <div className="text-center py-10">
                    <Sparkles className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No upcoming bookings</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.upcomingBookings.map((booking, i) => (
                      <Link
                        key={booking.id}
                        href={`/bookings/${booking.id}`}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 active:bg-slate-100/50 transition-all group"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-slate-900 truncate">{booking.customerName}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {booking.eventType} &middot; {booking.hall}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-medium text-slate-700">
                              {format(new Date(booking.eventDate), 'MMM d')}
                            </p>
                          </div>
                          <Badge className={`text-[10px] ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors hidden lg:block" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Failed to load dashboard data</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
