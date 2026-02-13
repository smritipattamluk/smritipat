'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
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
import { Switch } from '@/components/ui/switch';
import ProtectedLayout from '@/components/layout/protected-layout';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';

const hallSchema = z.object({
  name: z.string().min(1, 'Hall name is required'),
  floor: z.enum(['GROUND', 'FIRST', 'BOTH']),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  baseRent: z.number().min(0, 'Base rent must be positive'),
  isActive: z.boolean(),
});

type HallFormData = z.infer<typeof hallSchema>;

interface Hall {
  id: string;
  name: string;
  floor: 'GROUND' | 'FIRST' | 'BOTH';
  capacity: number;
  baseRent: number;
  isActive: boolean;
}

export default function EditHallPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const hallId = params.id as string;
  const [floor, setFloor] = useState<string>('');

  const { data: hall, isLoading } = useQuery<Hall>({
    queryKey: ['hall', hallId],
    queryFn: async () => {
      const res = await fetch(`/api/halls/${hallId}`);
      if (!res.ok) throw new Error('Failed to fetch hall');
      const data = await res.json();
      setFloor(data.floor);
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HallFormData>({
    resolver: zodResolver(hallSchema),
    values: hall ? {
      name: hall.name,
      floor: hall.floor,
      capacity: hall.capacity,
      baseRent: Number(hall.baseRent),
      isActive: hall.isActive,
    } : undefined,
  });

  const updateHall = useMutation({
    mutationFn: async (data: HallFormData) => {
      const res = await fetch(`/api/halls/${hallId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, floor }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update hall');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['halls'] });
      router.push('/halls');
    },
  });

  const deleteHall = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/halls/${hallId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete hall');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['halls'] });
      router.push('/halls');
    },
  });

  const onSubmit = (data: HallFormData) => {
    updateHall.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this hall? This action cannot be undone.')) {
      deleteHall.mutate();
    }
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="space-y-4 lg:space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 animate-pulse h-80" />
        </div>
      </ProtectedLayout>
    );
  }

  if (!hall) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-slate-500">Hall not found</p>
          <Link href="/halls">
            <Button className="rounded-lg">Back to Halls</Button>
          </Link>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/halls">
              <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Edit Hall</h1>
              <p className="text-sm lg:text-base text-slate-500 mt-0.5">Update hall details</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteHall.isPending}
            className="rounded-lg"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteHall.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Hall Details</CardTitle>
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

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={updateHall.isPending}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg h-11"
                >
                  {updateHall.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {updateHall.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/halls" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full rounded-lg h-11 border-slate-200">
                    Cancel
                  </Button>
                </Link>
              </div>

              {updateHall.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    {updateHall.error?.message || 'Failed to update hall'}
                  </p>
                </div>
              )}
              {deleteHall.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    {deleteHall.error?.message || 'Failed to delete hall'}
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
