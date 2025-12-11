'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
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
import ProtectedLayout from '@/components/layout/protected-layout';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const hallSchema = z.object({
  name: z.string().min(1, 'Hall name is required'),
  floor: z.enum(['GROUND', 'FIRST', 'BOTH']),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  baseRent: z.number().min(0, 'Base rent must be positive'),
  isActive: z.boolean().optional(),
});

type HallFormData = z.infer<typeof hallSchema>;

export default function NewHallPage() {
  const router = useRouter();
  const [floor, setFloor] = useState<string>('GROUND');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HallFormData>({
    resolver: zodResolver(hallSchema),
    defaultValues: {
      isActive: true,
      capacity: 100,
      baseRent: 15000,
    },
  });

  const createHall = useMutation({
    mutationFn: async (data: HallFormData) => {
      const res = await fetch('/api/halls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, floor }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create hall');
      }
      return res.json();
    },
    onSuccess: () => {
      router.push('/halls');
    },
  });

  const onSubmit = (data: HallFormData) => {
    createHall.mutate(data);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/halls">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">New Hall</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Create a new hall</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Hall Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hall Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Hall Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Smritipat Ground Floor"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Floor Selection */}
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select value={floor} onValueChange={setFloor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GROUND">Ground Floor</SelectItem>
                    <SelectItem value="FIRST">First Floor</SelectItem>
                    <SelectItem value="BOTH">Both Floors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Capacity and Base Rent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Guests)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register('capacity', { valueAsNumber: true })}
                    placeholder="100"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500">{errors.capacity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseRent">Base Rent (₹)</Label>
                  <Input
                    id="baseRent"
                    type="number"
                    step="0.01"
                    {...register('baseRent', { valueAsNumber: true })}
                    placeholder="15000"
                  />
                  {errors.baseRent && (
                    <p className="text-sm text-red-500">{errors.baseRent.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={createHall.isPending}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {createHall.isPending ? 'Creating...' : 'Create Hall'}
                </Button>
                <Link href="/halls" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>

              {createHall.isError && (
                <p className="text-sm text-red-500">
                  {createHall.error?.message || 'Failed to create hall'}
                </p>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </ProtectedLayout>
  );
}
