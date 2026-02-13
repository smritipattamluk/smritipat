'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import ProtectedLayout from '@/components/layout/protected-layout';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  status: string;
  baseRent: number;
  hall: { name: string; floor: string };
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hallFilter, setHallFilter] = useState<string>('all');

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  const { data: halls } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ['halls'],
    queryFn: async () => {
      const res = await fetch('/api/halls');
      if (!res.ok) throw new Error('Failed to fetch halls');
      return res.json();
    },
  });

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

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    if (!bookings) return [];
    return bookings.filter((booking) => {
      const bookingDate = parseISO(booking.eventDate);
      return isSameDay(bookingDate, date);
    });
  };

  // Get all dates that have bookings
  const getDatesWithBookings = () => {
    if (!bookings) return new Set<string>();
    return new Set(
      bookings.map((booking) => format(parseISO(booking.eventDate), 'yyyy-MM-dd'))
    );
  };

  const datesWithBookings = getDatesWithBookings();

  // Filter bookings based on search and filters
  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch = searchQuery === '' || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery) ||
      booking.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesHall = hallFilter === 'all' || booking.hall.name === hallFilter;
    
    return matchesSearch && matchesStatus && matchesHall;
  }) || [];

  // Get bookings for selected date
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setHallFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || hallFilter !== 'all';

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-5 animate-fade-in">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Calendar</h1>
            <p className="text-sm text-slate-500 mt-0.5">View and search bookings by date</p>
          </div>
          <Button asChild className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
            <Link href="/bookings/new">
              <CalendarIcon className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Search & Filter</span>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Customer, phone, or event type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="INQUIRY">Inquiry</SelectItem>
                  <SelectItem value="TENTATIVE">Tentative</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hallFilter} onValueChange={setHallFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Halls</SelectItem>
                  {halls?.map((hall) => (
                    <SelectItem key={hall.id} value={hall.name}>{hall.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Calendar */}
          <Card className="lg:col-span-1 border-0 shadow-sm">
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border-0"
                modifiers={{
                  booked: (date) => datesWithBookings.has(format(date, 'yyyy-MM-dd')),
                }}
                modifiersClassNames={{
                  booked: 'bg-blue-100 font-bold text-blue-900',
                }}
              />
            </CardContent>
          </Card>

          {/* Bookings for selected date */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {selectedDate ? (
                  <span className="flex items-center gap-2 flex-wrap">
                    {format(selectedDate, 'MMMM d, yyyy')}
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'booking' : 'bookings'}
                    </span>
                  </span>
                ) : (
                  'Select a date'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 border border-slate-100 rounded-xl">
                      <div className="skeleton-shimmer h-4 w-32 rounded mb-2" />
                      <div className="skeleton-shimmer h-3 w-48 rounded" />
                    </div>
                  ))}
                </div>
              ) : selectedDate && selectedDateBookings.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateBookings.map((booking, i) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="block p-3.5 border border-slate-100 rounded-xl hover:border-slate-200 hover:bg-slate-50/50 active:bg-slate-100/50 transition-all"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-slate-900 truncate">{booking.customerName}</p>
                            <Badge className={`text-[10px] font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            {booking.eventType} &middot; {booking.hall.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {format(parseISO(booking.startTime), 'hh:mm a')} - {format(parseISO(booking.endTime), 'hh:mm a')}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 shrink-0">₹{booking.baseRent.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No bookings on this date</p>
                </div>
              ) : null}

              {hasActiveFilters && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Search Results ({filteredBookings.length})
                  </h3>
                  {filteredBookings.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredBookings.map((booking, i) => (
                        <Link
                          key={booking.id}
                          href={`/bookings/${booking.id}`}
                          className="block p-3 border border-slate-100 rounded-xl hover:border-slate-200 hover:bg-slate-50/50 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">{booking.customerName}</p>
                                <Badge className={`text-[10px] font-semibold ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500">
                                {format(parseISO(booking.eventDate), 'MMM d, yyyy')} &middot; {booking.eventType}
                              </p>
                              <p className="text-xs text-slate-400">
                                {booking.hall.name} &middot; {format(parseISO(booking.startTime), 'hh:mm a')} - {format(parseISO(booking.endTime), 'hh:mm a')}
                              </p>
                            </div>
                            <p className="font-medium text-sm shrink-0">₹{booking.baseRent.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-sm text-slate-500">No bookings match your search</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { status: 'INQUIRY', color: 'text-slate-700' },
            { status: 'TENTATIVE', color: 'text-amber-600' },
            { status: 'CONFIRMED', color: 'text-blue-600' },
            { status: 'COMPLETED', color: 'text-emerald-600' },
            { status: 'CANCELLED', color: 'text-red-600' },
          ].map(({ status, color }) => (
            <Card key={status} className="border-0 shadow-sm card-hover">
              <CardContent className="p-3 lg:pt-5 text-center">
                <p className={`text-xl lg:text-2xl font-bold ${color}`}>
                  {bookings?.filter((b) => b.status === status).length || 0}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{status.charAt(0) + status.slice(1).toLowerCase()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}
