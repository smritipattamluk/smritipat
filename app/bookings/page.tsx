'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProtectedLayout from '@/components/layout/protected-layout';
import { Plus, Search, Filter, X, ArrowUpDown } from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  eventType: string;
  status: string;
  baseRent: number;
  hall: { name: string };
}

type SortField = 'eventDate' | 'customerName' | 'baseRent';
type SortOrder = 'asc' | 'desc';

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [hallFilter, setHallFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('eventDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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

  // Get unique halls for filter
  const halls = useMemo(() => {
    if (!bookings) return [];
    const uniqueHalls = Array.from(new Set(bookings.map((b) => b.hall.name)));
    return uniqueHalls.sort();
  }, [bookings]);

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    if (!bookings) return [];

    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        searchQuery === '' ||
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerPhone.includes(searchQuery) ||
        booking.eventType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
      const matchesHall = hallFilter === 'ALL' || booking.hall.name === hallFilter;

      return matchesSearch && matchesStatus && matchesHall;
    });

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'eventDate') {
        compareValue = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      } else if (sortField === 'customerName') {
        compareValue = a.customerName.localeCompare(b.customerName);
      } else if (sortField === 'baseRent') {
        compareValue = a.baseRent - b.baseRent;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [bookings, searchQuery, statusFilter, hallFilter, sortField, sortOrder]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setHallFilter('ALL');
    setSortField('eventDate');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || hallFilter !== 'ALL';

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              {filteredAndSortedBookings.length} of {bookings?.length || 0} bookings
            </p>
          </div>
          <Button asChild className="w-full lg:w-auto">
            <Link href="/bookings/new">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="INQUIRY">Inquiry</SelectItem>
                  <SelectItem value="TENTATIVE">Tentative</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Hall Filter */}
              <Select value={hallFilter} onValueChange={setHallFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Halls" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Halls</SelectItem>
                  {halls.map((hall) => (
                    <SelectItem key={hall} value={hall}>
                      {hall}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center">Sort by:</span>
              <Button
                variant={sortField === 'eventDate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('eventDate')}
              >
                Date
                <ArrowUpDown className="w-3 h-3 ml-2" />
              </Button>
              <Button
                variant={sortField === 'customerName' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('customerName')}
              >
                Name
                <ArrowUpDown className="w-3 h-3 ml-2" />
              </Button>
              <Button
                variant={sortField === 'baseRent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('baseRent')}
              >
                Amount
                <ArrowUpDown className="w-3 h-3 ml-2" />
              </Button>
              <Badge variant="secondary" className="self-center ml-auto">
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredAndSortedBookings.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {filteredAndSortedBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 lg:p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-2 lg:gap-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm lg:text-base truncate">{booking.customerName}</p>
                      <p className="text-xs lg:text-sm text-muted-foreground truncate">
                        {booking.eventType} • {booking.hall.name} • {booking.customerPhone}
                      </p>
                    </div>
                    <div className="flex items-center justify-between lg:items-end lg:flex-col lg:text-right gap-2">
                      <div>
                        <p className="text-xs lg:text-sm font-medium">
                          {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₹{booking.baseRent.toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm lg:text-base text-muted-foreground">
                {bookings && bookings.length > 0
                  ? 'No bookings match your filters.'
                  : 'No bookings found. Create your first booking to get started.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
