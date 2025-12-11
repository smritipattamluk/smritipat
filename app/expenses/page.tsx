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
import { Plus, Search, Filter, X, ArrowUpDown, Download } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  createdBy: { name: string };
}

type SortField = 'expenseDate' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('expenseDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      return res.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  // Get unique categories for filter
  const categories = useMemo(() => {
    if (!expenses) return [];
    const uniqueCategories = Array.from(new Set(expenses.map((e) => e.category)));
    return uniqueCategories.sort();
  }, [expenses]);

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    if (!expenses) return [];

    let filtered = expenses.filter((expense) => {
      const matchesSearch =
        searchQuery === '' ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'ALL' || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'expenseDate') {
        compareValue = new Date(a.expenseDate).getTime() - new Date(b.expenseDate).getTime();
      } else if (sortField === 'amount') {
        compareValue = a.amount - b.amount;
      } else if (sortField === 'category') {
        compareValue = a.category.localeCompare(b.category);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [expenses, searchQuery, categoryFilter, sortField, sortOrder]);

  // Calculate total
  const totalExpenses = useMemo(() => {
    return filteredAndSortedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredAndSortedExpenses]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setSortField('expenseDate');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'ALL';

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      UTILITIES: 'bg-blue-100 text-blue-800',
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      SALARY: 'bg-green-100 text-green-800',
      SUPPLIES: 'bg-purple-100 text-purple-800',
      MARKETING: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              {filteredAndSortedExpenses.length} expenses • Total: {formatCurrency(totalExpenses)}
            </p>
          </div>
          <Link href="/expenses/new">
            <Button className="w-full lg:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Expense
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by description, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center">Sort by:</span>
              <Button
                variant={sortField === 'expenseDate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('expenseDate')}
              >
                Date
                <ArrowUpDown className="w-3 h-3 ml-2" />
              </Button>
              <Button
                variant={sortField === 'amount' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('amount')}
              >
                Amount
                <ArrowUpDown className="w-3 h-3 ml-2" />
              </Button>
              <Button
                variant={sortField === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('category')}
              >
                Category
                <ArrowUpDown className="w-3 h-3 ml-2" />
              </Button>
              <Badge variant="secondary" className="self-center ml-auto">
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredAndSortedExpenses.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{expense.description}</p>
                        <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Added by {expense.createdBy.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between lg:flex-col lg:text-right gap-2">
                      <p className="text-lg font-semibold">{formatCurrency(expense.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(expense.expenseDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {expenses && expenses.length > 0
                  ? 'No expenses match your filters.'
                  : 'No expenses recorded yet.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
