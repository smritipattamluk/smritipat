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
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Halls</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Manage reception halls</p>
          </div>
          <Button asChild className="w-full lg:w-auto">
            <Link href="/halls/new">
              <Plus className="w-4 h-4 mr-2" />
              New Hall
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-8">Loading...</div>
          ) : halls && halls.length > 0 ? (
            halls.map((hall) => (
              <Link key={hall.id} href={`/halls/${hall.id}`}>
                <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{hall.name}</CardTitle>
                      <Badge variant={hall.isActive ? 'default' : 'secondary'}>
                        {hall.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Floor:</span>
                        <span className="font-medium">
                          {hall.floor === 'BOTH' ? 'Both Floors' : hall.floor === 'GROUND' ? 'Ground Floor' : hall.floor === 'FIRST' ? 'First Floor' : hall.floor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{hall.capacity} guests</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Base Rent:</span>
                        <span className="font-medium">{formatCurrency(hall.baseRent)}</span>
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
