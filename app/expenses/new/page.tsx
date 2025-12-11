'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const expenseSchema = z.object({
  category: z.enum([
    'ELECTRICITY',
    'WATER',
    'SALARY',
    'REPAIR_MAINTENANCE',
    'CLEANING',
    'DECORATION_MATERIAL',
    'CATERING_MATERIAL',
    'GENERATOR_FUEL',
    'RENT',
    'MISC',
  ]),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  expenseDate: z.string().min(1, 'Expense date is required'),
  relatedBookingId: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function NewExpensePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: 'MISC',
      expenseDate: new Date().toISOString().split('T')[0],
    },
  });

  const createExpense = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(typeof error.error === 'string' ? error.error : JSON.stringify(error.error) || 'Failed to create expense');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      router.push('/expenses');
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    createExpense.mutate(data);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/expenses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Expense</h1>
            <p className="text-muted-foreground">Record a new expense</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    defaultValue="MISC"
                    onValueChange={(value) =>
                      setValue('category', value as ExpenseFormData['category'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                      <SelectItem value="WATER">Water</SelectItem>
                      <SelectItem value="SALARY">Salary</SelectItem>
                      <SelectItem value="REPAIR_MAINTENANCE">Repair & Maintenance</SelectItem>
                      <SelectItem value="CLEANING">Cleaning</SelectItem>
                      <SelectItem value="DECORATION_MATERIAL">Decoration Material</SelectItem>
                      <SelectItem value="CATERING_MATERIAL">Catering Material</SelectItem>
                      <SelectItem value="GENERATOR_FUEL">Generator Fuel</SelectItem>
                      <SelectItem value="RENT">Rent</SelectItem>
                      <SelectItem value="MISC">Miscellaneous</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="What was this expense for?"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Expense Date</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  {...register('expenseDate')}
                />
                {errors.expenseDate && (
                  <p className="text-sm text-red-500">{errors.expenseDate.message}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={createExpense.isPending}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {createExpense.isPending ? 'Recording...' : 'Record Expense'}
                </Button>
                <Link href="/expenses" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>

              {createExpense.isError && (
                <p className="text-sm text-red-500">
                  {createExpense.error?.message || 'Failed to record expense'}
                </p>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </ProtectedLayout>
  );
}
