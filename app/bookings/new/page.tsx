'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ProtectedLayout from '@/components/layout/protected-layout';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const bookingSchema = z.object({
  hallId: z.string().min(1, 'Hall is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  customerEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
  eventDate: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  eventType: z.string().min(1, 'Event type is required'),
  status: z.enum(['INQUIRY', 'TENTATIVE', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  baseRent: z.number().min(0, 'Base rent must be positive'),
  discountAmount: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Hall {
  id: string;
  name: string;
  floor: 'GROUND' | 'FIRST' | 'BOTH';
  baseRent: number;
}

export default function NewBookingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedHallRent, setSelectedHallRent] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: 'CONFIRMED',
      baseRent: 0,
      startTime: '10:00',
      endTime: '22:00',
      discountAmount: 0,
      taxRate: 0,
    },
  });

  const { data: halls } = useQuery<Hall[]>({
    queryKey: ['halls'],
    queryFn: async () => {
      const res = await fetch('/api/halls');
      if (!res.ok) throw new Error('Failed to fetch halls');
      return res.json();
    },
  });

  const createBooking = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create booking');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      router.push('/bookings');
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBooking.mutate(data);
  };

  const handleHallChange = (hallId: string) => {
    setValue('hallId', hallId);
    const hall = halls?.find((h) => h.id === hallId);
    if (hall) {
      setSelectedHallRent(hall.baseRent);
      setValue('baseRent', hall.baseRent);
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href="/bookings">
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">New Booking</h1>
            <p className="text-sm text-slate-500 mt-0.5">Create a new hall booking</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hall Selection */}
              <div className="space-y-2">
                <Label>Hall</Label>
                <Select onValueChange={handleHallChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hall" />
                  </SelectTrigger>
                  <SelectContent>
                    {halls?.map((hall) => (
                      <SelectItem key={hall.id} value={hall.id}>
                        {hall.name} ({hall.floor === 'GROUND' ? 'Ground Floor' : hall.floor === 'FIRST' ? 'First Floor' : 'Both Floors'}) - ₹{hall.baseRent.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hallId && (
                  <p className="text-sm text-red-500">{errors.hallId.message}</p>
                )}
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    placeholder="Full name"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500">{errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    {...register('customerPhone')}
                    placeholder="10-digit phone number"
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-red-500">{errors.customerPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email (Optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register('customerEmail')}
                    placeholder="email@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    {...register('eventDate')}
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-red-500">{errors.eventDate.message}</p>
                  )}
                </div>
              </div>

              {/* Event Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-red-500">{errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-red-500">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input
                    id="eventType"
                    {...register('eventType')}
                    placeholder="Wedding, Birthday, etc."
                  />
                  {errors.eventType && (
                    <p className="text-sm text-red-500">{errors.eventType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    defaultValue="CONFIRMED"
                    onValueChange={(value) =>
                      setValue('status', value as BookingFormData['status'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INQUIRY">Inquiry</SelectItem>
                      <SelectItem value="TENTATIVE">Tentative</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseRent">Base Rent (₹)</Label>
                  <Input
                    id="baseRent"
                    type="number"
                    {...register('baseRent', { valueAsNumber: true })}
                    placeholder="Base hall rent"
                  />
                  {errors.baseRent && (
                    <p className="text-sm text-red-500">{errors.baseRent.message}</p>
                  )}
                  {selectedHallRent > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Default: ₹{selectedHallRent.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountAmount">Discount (₹)</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    step="0.01"
                    {...register('discountAmount', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    {...register('taxRate', { valueAsNumber: true })}
                    placeholder="0"
                  />
                  <p className="text-sm text-muted-foreground">Enter as decimal (e.g., 0.18 for 18%)</p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Additional notes about the booking"
                  rows={4}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg h-11"
                >
                  {createBooking.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {createBooking.isPending ? 'Creating...' : 'Create Booking'}
                </Button>
                <Link href="/bookings" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full rounded-lg h-11 border-slate-200">
                    Cancel
                  </Button>
                </Link>
              </div>

              {createBooking.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    {createBooking.error?.message || 'Failed to create booking'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </ProtectedLayout>
  );
}
