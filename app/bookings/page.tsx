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

  const halls = useMemo(() => {
    if (!bookings) return [];
    const uniqueHalls = Array.from(new Set(bookings.map((b) => b.hall.name)));
    return uniqueHalls.sort();
  }, [bookings]);

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
      INQUIRY: 'bg-slate-100 text-slate-700 border border-slate-200',
      TENTATIVE: 'bg-amber-50 text-amber-700 border border-amber-200',
      CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-200',
      COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      CANCELLED: 'bg-red-50 text-red-700 border border-red-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
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
      <div className="space-y-4 lg:space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Bookings</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {filteredAndSortedBookings.length} of {bookings?.length || 0} bookings
            </p>
          </div>
          <Button asChild className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
            <Link href="/bookings/new">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Search & Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name, phone, event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
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

              <Select value={hallFilter} onValueChange={setHallFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                  <SelectValue placeholder="All Halls" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Halls</SelectItem>
                  {halls.map((hall) => (
                    <SelectItem key={hall} value={hall}>{hall}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="h-10 border-dashed">
                  <X className="w-4 h-4 mr-1.5" />
                  Clear
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400 mr-1">Sort:</span>
              {(['eventDate', 'customerName', 'baseRent'] as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    sortField === field
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {field === 'eventDate' ? 'Date' : field === 'customerName' ? 'Name' : 'Amount'}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
              <span className="text-[11px] text-slate-400 ml-auto">
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="skeleton-shimmer h-4 w-40 rounded" />
                    <div className="skeleton-shimmer h-3 w-56 rounded" />
                  </div>
                  <div className="skeleton-shimmer h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedBookings.length > 0 ? (
          <div className="space-y-2">
            {filteredAndSortedBookings.map((booking, i) => (
              <Link
                key={booking.id}
                href={`/bookings/${booking.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 lg:p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm active:bg-slate-50/50 transition-all group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-slate-900 truncate">{booking.customerName}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {booking.eventType} &middot; {booking.hall.name} &middot; {booking.customerPhone}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0 sm:ml-4">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-slate-700">
                      {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-[11px] text-slate-400">₹{booking.baseRent.toLocaleString()}</p>
                  </div>
                  <Badge className={`text-[10px] font-semibold shrink-0 ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-xl">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {bookings && bookings.length > 0
                ? 'No bookings match your filters.'
                : 'No bookings yet. Create your first booking!'}
            </p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
