'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { formatTime12Hour } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProtectedLayout from '@/components/layout/protected-layout';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Plus,
  Trash2,
} from 'lucide-react';
import { calculateBookingTotals } from '@/lib/calculations';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  numberOfGuests: number;
  status: string;
  baseRent: number;
  discountAmount: number;
  taxRate: number;
  notes: string | null;
  hall: {
    id: string;
    name: string;
    floor: string;
  };
  bookingCharges: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    type: string;
    paymentMethod: string;
    paymentDate: string;
    reference: string | null;
  }>;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookingId = params.id as string;

  const [isAddChargeOpen, setIsAddChargeOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [chargeType, setChargeType] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('ADVANCE');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');

  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error('Failed to fetch booking');
      return res.json();
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete booking');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      router.push('/bookings');
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsEditingStatus(false);
    },
  });

  const addCharge = useMutation({
    mutationFn: async (data: {
      type: string;
      description: string;
      amount: number;
    }) => {
      const res = await fetch(`/api/bookings/${bookingId}/charges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add charge');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsAddChargeOpen(false);
    },
  });

  const deleteCharge = useMutation({
    mutationFn: async (chargeId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}/charges/${chargeId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete charge');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const addPayment = useMutation({
    mutationFn: async (data: {
      amount: number;
      type: string;
      paymentMethod: string;
      paymentDate: string;
      reference?: string;
    }) => {
      const res = await fetch(`/api/bookings/${bookingId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add payment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsAddPaymentOpen(false);
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (paymentId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}/payments/${paymentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete payment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
    },
  });

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-10 w-10 rounded-lg" />
            <div><div className="skeleton-shimmer h-6 w-48 rounded mb-2" /><div className="skeleton-shimmer h-4 w-32 rounded" /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="skeleton-shimmer h-5 w-full rounded" />)}</div>
              <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="skeleton-shimmer h-5 w-full rounded" />)}</div>
            </div>
            <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">{[...Array(6)].map((_,i) => <div key={i} className="skeleton-shimmer h-5 w-full rounded" />)}</div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!booking) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">Booking not found</p>
          <Link href="/bookings">
            <Button>Back to Bookings</Button>
          </Link>
        </div>
      </ProtectedLayout>
    );
  }

  const totals = calculateBookingTotals(
    booking.baseRent,
    booking.discountAmount,
    booking.taxRate,
    booking.bookingCharges,
    booking.payments.map(p => ({ 
      amount: p.amount, 
      type: (p.type === 'FULL' ? 'FINAL' : p.type === 'PARTIAL' ? 'ADVANCE' : p.type) as 'ADVANCE' | 'FINAL' | 'REFUND'
    }))
  );

  const totalPaid = totals.totalPaid;
  const balance = totals.balance;

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

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Link href="/bookings">
              <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all shrink-0">
                <ArrowLeft className="h-4 w-4 text-slate-700" />
              </button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900">Booking Details</h1>
              <p className="text-sm text-slate-500 truncate">
                {booking.customerName} &middot; {booking.eventType}
              </p>
            </div>
          </div>
          <div className="flex gap-2 self-start lg:self-auto flex-wrap">
            {!isEditingStatus ? (
              <>
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewStatus(booking.status);
                    setIsEditingStatus(true);
                  }}
                >
                  Change Status
                </Button>
              </>
            ) : (
              <div className="flex gap-2 w-full lg:w-auto">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-40">
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
                <Button
                  size="sm"
                  onClick={() => updateStatus.mutate(newStatus)}
                  disabled={updateStatus.isPending || newStatus === booking.status}
                >
                  {updateStatus.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingStatus(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete this booking?')) {
                  deleteBooking.mutate();
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Customer Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-sm lg:text-base truncate">{booking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-sm lg:text-base">{booking.customerPhone}</p>
                  </div>
                </div>
                {booking.customerEmail && (
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm lg:text-base truncate">{booking.customerEmail}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Hall</p>
                    <p className="font-medium text-sm lg:text-base">{booking.hall.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.hall.floor === 'GROUND' ? 'Ground Floor' : booking.hall.floor === 'FIRST' ? 'First Floor' : 'Both Floors'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Event Date</p>
                    <p className="font-medium text-sm lg:text-base">
                      {format(new Date(booking.eventDate), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-sm lg:text-base">
                      {formatTime12Hour(booking.startTime)} -{' '}
                      {formatTime12Hour(booking.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Event Type / Guests</p>
                    <p className="font-medium text-sm lg:text-base">
                      {booking.eventType} - {booking.numberOfGuests} guests
                    </p>
                  </div>
                </div>
                {booking.notes && (
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-xs lg:text-sm bg-slate-50 p-2 lg:p-3 rounded-lg break-words">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Charges */}
            <Card>
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-lg lg:text-xl">Additional Charges</CardTitle>
                <Dialog open={isAddChargeOpen} onOpenChange={setIsAddChargeOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full lg:w-auto">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Charge
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Charge</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        addCharge.mutate({
                          type: chargeType,
                          description: formData.get('description') as string,
                          amount: Number(formData.get('amount')),
                        });
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={chargeType} onValueChange={setChargeType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="DECORATION">Decoration</SelectItem>
                            <SelectItem value="SOUND">Sound System</SelectItem>
                            <SelectItem value="CATERING">Catering</SelectItem>
                            <SelectItem value="CLEANING">Cleaning</SelectItem>
                            <SelectItem value="GENERATOR">Generator</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={addCharge.isPending} className="w-full">
                        {addCharge.isPending ? 'Adding...' : 'Add Charge'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {booking.bookingCharges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No additional charges
                  </p>
                ) : (
                  <div className="space-y-2">
                    {booking.bookingCharges.map((charge) => (
                      <div
                        key={charge.id}
                        className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between p-2 lg:p-3 bg-slate-50/70 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm lg:text-base">{charge.description}</p>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            {charge.type}
                          </p>
                        </div>
                        <div className="flex items-center justify-between lg:justify-end gap-2">
                          <p className="font-medium">₹{charge.amount.toLocaleString()}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Delete this charge?')) {
                                deleteCharge.mutate(charge.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-lg lg:text-xl">Payments</CardTitle>
                <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full lg:w-auto">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        addPayment.mutate({
                          amount: Number(formData.get('amount')),
                          type: paymentType,
                          paymentMethod: paymentMethod,
                          paymentDate: formData.get('paymentDate') as string,
                          reference: formData.get('reference') as string,
                        });
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          max={balance}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Balance due: ₹{balance.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Type</Label>
                        <Select value={paymentType} onValueChange={setPaymentType} required>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADVANCE">Advance</SelectItem>
                            <SelectItem value="FINAL">Final Payment</SelectItem>
                            <SelectItem value="REFUND">Refund</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="CARD">Card</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date</Label>
                        <Input
                          id="paymentDate"
                          name="paymentDate"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference (Optional)</Label>
                        <Input id="reference" name="reference" />
                      </div>
                      <Button type="submit" disabled={addPayment.isPending} className="w-full">
                        {addPayment.isPending ? 'Recording...' : 'Record Payment'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {booking.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No payments recorded
                  </p>
                ) : (
                  <div className="space-y-2">
                    {booking.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between p-2 lg:p-3 bg-slate-50/70 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm lg:text-base">
                            {payment.type} - {payment.paymentMethod}
                          </p>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            {format(new Date(payment.paymentDate), 'PPP')}
                          </p>
                          {payment.reference && (
                            <p className="text-xs lg:text-sm text-muted-foreground break-words">{payment.reference}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between lg:justify-end gap-2">
                          <p className="font-medium text-green-600">
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Delete this payment?')) {
                                deletePayment.mutate(payment.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4 lg:space-y-6">
            <Card className="border-0 shadow-sm sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm lg:text-base text-muted-foreground">Base Rent</span>
                  <span className="font-medium text-sm lg:text-base">₹{booking.baseRent.toLocaleString()}</span>
                </div>
                {booking.bookingCharges.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Additional Charges</span>
                    <span className="font-medium">
                      ₹{booking.bookingCharges.reduce((sum, c) => sum + Number(c.amount), 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span>-₹{booking.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Tax ({(booking.taxRate * 100).toFixed(0)}%)
                  </span>
                  <span className="font-medium">₹{totals.taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{totals.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span>Total Paid</span>
                  <span className="font-semibold">₹{totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                    Balance Due
                  </span>
                  <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                    ₹{balance.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
