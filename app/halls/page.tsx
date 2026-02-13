'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedLayout from '@/components/layout/protected-layout';
import { Plus } from 'lucide-react';

interface Hall {
  id: string;
  name: string;
  floor: 'GROUND' | 'FIRST' | 'BOTH';
  capacity: number;
  baseRent: number;
  isActive: boolean;
}

export default function HallsPage() {
  const { data: halls, isLoading } = useQuery<Hall[]>({
    queryKey: ['halls'],
    queryFn: async () => {
      const res = await fetch('/api/halls');
      if (!res.ok) throw new Error('Failed to fetch halls');
      return res.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Halls</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage reception halls</p>
          </div>
          <Button asChild className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
            <Link href="/halls/new">
              <Plus className="w-4 h-4 mr-2" />
              New Hall
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>{[...Array(3)].map((_, i) => (<div key={i} className="bg-white border border-slate-100 rounded-xl p-5"><div className="skeleton-shimmer h-5 w-32 rounded mb-3" /><div className="skeleton-shimmer h-4 w-full rounded mb-2" /><div className="skeleton-shimmer h-4 w-24 rounded" /></div>))}</>
          ) : halls && halls.length > 0 ? (
            halls.map((hall) => (
              <Link key={hall.id} href={`/halls/${hall.id}`}>
                <Card className="cursor-pointer border-0 shadow-sm hover:shadow-md hover:border-slate-200 transition-all active:scale-[0.99] overflow-hidden relative">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${hall.isActive ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-slate-300'}`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{hall.name}</CardTitle>
                      <Badge className={hall.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]' : 'text-[10px]'} variant={hall.isActive ? 'default' : 'secondary'}>
                        {hall.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Floor</span>
                        <span className="font-medium text-slate-900">
                          {hall.floor === 'BOTH' ? 'Both Floors' : hall.floor === 'GROUND' ? 'Ground Floor' : hall.floor === 'FIRST' ? 'First Floor' : hall.floor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capacity</span>
                        <span className="font-medium text-slate-900">{hall.capacity} guests</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base Rent</span>
                        <span className="font-semibold text-emerald-600">{formatCurrency(hall.baseRent)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No halls found.
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
