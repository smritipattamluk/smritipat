'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProtectedLayout from '@/components/layout/protected-layout';

interface Settings {
  id: string;
  currencySymbol: string;
  defaultTaxRate: number;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [taxRate, setTaxRate] = useState('');

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setCurrencySymbol(data.currencySymbol);
      setTaxRate((Number(data.defaultTaxRate) * 100).toString());
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { currencySymbol: string; defaultTaxRate: number }) => {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Settings updated successfully');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      currencySymbol,
      defaultTaxRate: Number(taxRate) / 100,
    });
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage system configuration</p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4"><div className="skeleton-shimmer h-10 w-full rounded-xl" /><div className="skeleton-shimmer h-10 w-full rounded-xl" /></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency Symbol</Label>
                  <Input
                    id="currency"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    placeholder="₹"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="18"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter as percentage (e.g., 18 for 18%)
                  </p>
                </div>

                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}

