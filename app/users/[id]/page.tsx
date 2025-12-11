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
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'ACCOUNTANT', 'VIEWER']),
  isActive: z.boolean(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'VIEWER';
  isActive: boolean;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;
  const [role, setRole] = useState<string>('');

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setRole(data.role);
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    values: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: '',
    } : undefined,
  });

  const updateUser = useMutation({
    mutationFn: async (data: UserFormData) => {
      const updateData: any = {
        name: data.name,
        email: data.email,
        role,
        isActive: data.isActive,
      };
      
      // Only include password if it's provided
      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update user');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/users');
    },
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/users');
    },
  });

  const onSubmit = (data: UserFormData) => {
    updateUser.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser.mutate();
    }
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </ProtectedLayout>
    );
  }

  if (!user) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">User not found</p>
          <Link href="/users">
            <Button>Back to Users</Button>
          </Link>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/users">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Edit User</h1>
              <p className="text-sm lg:text-base text-muted-foreground">Update user details</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteUser.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteUser.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Leave blank to keep current password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Only fill this if you want to change the user's password
                </p>
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
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/users" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>

              {updateUser.isError && (
                <p className="text-sm text-red-500">
                  {updateUser.error?.message || 'Failed to update user'}
                </p>
              )}
              {deleteUser.isError && (
                <p className="text-sm text-red-500">
                  {deleteUser.error?.message || 'Failed to delete user'}
                </p>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </ProtectedLayout>
  );
}
