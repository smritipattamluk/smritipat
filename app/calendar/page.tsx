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
      INQUIRY: 'bg-gray-100 text-gray-800',
      TENTATIVE: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              View and search bookings by date
            </p>
          </div>
          <Button asChild className="w-full lg:w-auto">
            <Link href="/bookings/new">
              <CalendarIcon className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Search & Filter</span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Customer name, phone, or event type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hall</label>
                <Select value={hallFilter} onValueChange={setHallFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Halls</SelectItem>
                    {halls?.map((hall) => (
                      <SelectItem key={hall.id} value={hall.name}>
                        {hall.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  booked: (date) => datesWithBookings.has(format(date, 'yyyy-MM-dd')),
                }}
                modifiersClassNames={{
                  booked: 'bg-blue-100 font-bold text-blue-900',
                }}
              />
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? (
                  <>
                    Bookings on {format(selectedDate, 'MMMM d, yyyy')}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'booking' : 'bookings'})
                    </span>
                  </>
                ) : (
                  'All Bookings'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading bookings...</div>
              ) : selectedDate && selectedDateBookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{booking.customerName}</p>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {booking.eventType} • {booking.hall.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.startTime), 'hh:mm a')} -{' '}
                            {format(parseISO(booking.endTime), 'hh:mm a')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.customerPhone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{booking.baseRent.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : selectedDate && selectedDateBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings on this date
                </div>
              ) : null}

              {/* Filtered Results */}
              {hasActiveFilters && (
                <>
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">
                      Search Results ({filteredBookings.length})
                    </h3>
                    {filteredBookings.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredBookings.map((booking) => (
                          <Link
                            key={booking.id}
                            href={`/bookings/${booking.id}`}
                            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium truncate">{booking.customerName}</p>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {format(parseISO(booking.eventDate), 'MMM d, yyyy')} • {booking.eventType}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.hall.name} •{' '}
                                  {format(parseISO(booking.startTime), 'hh:mm a')} -{' '}
                                  {format(parseISO(booking.endTime), 'hh:mm a')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{booking.baseRent.toLocaleString()}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No bookings match your search criteria
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {bookings?.filter((b) => b.status === 'INQUIRY').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Inquiries</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings?.filter((b) => b.status === 'TENTATIVE').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Tentative</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {bookings?.filter((b) => b.status === 'CONFIRMED').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bookings?.filter((b) => b.status === 'COMPLETED').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {bookings?.filter((b) => b.status === 'CANCELLED').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
