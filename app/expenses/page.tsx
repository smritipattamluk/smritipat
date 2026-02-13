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
import { Plus, Search, Filter, X, ArrowUpDown, Download, DollarSign } from 'lucide-react';

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
      UTILITIES: 'bg-blue-50 text-blue-700 border border-blue-200',
      MAINTENANCE: 'bg-orange-50 text-orange-700 border border-orange-200',
      SALARY: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      SUPPLIES: 'bg-violet-50 text-violet-700 border border-violet-200',
      MARKETING: 'bg-pink-50 text-pink-700 border border-pink-200',
      OTHER: 'bg-slate-100 text-slate-700 border border-slate-200',
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-5 animate-fade-in">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Expenses</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {filteredAndSortedExpenses.length} expenses &middot; Total: {formatCurrency(totalExpenses)}
            </p>
          </div>
          <Link href="/expenses/new">
            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" />
              New Expense
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search description, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="h-10 border-dashed">
                  <X className="w-4 h-4 mr-1.5" />
                  Clear
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400 mr-1">Sort:</span>
              {(['expenseDate', 'amount', 'category'] as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    sortField === field
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {field === 'expenseDate' ? 'Date' : field === 'amount' ? 'Amount' : 'Category'}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
              <span className="text-[11px] text-slate-400 ml-auto">
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="skeleton-shimmer h-4 w-48 rounded" />
                    <div className="skeleton-shimmer h-3 w-32 rounded" />
                  </div>
                  <div className="skeleton-shimmer h-6 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedExpenses.length > 0 ? (
          <div className="space-y-2">
            {filteredAndSortedExpenses.map((expense, i) => (
              <div
                key={expense.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 lg:p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm text-slate-900 truncate">{expense.description}</p>
                    <Badge className={`text-[10px] font-semibold shrink-0 ${getCategoryColor(expense.category)}`}>{expense.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Added by {expense.createdBy.name}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 sm:ml-4">
                  <p className="text-base font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(expense.expenseDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-xl">
            <DollarSign className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {expenses && expenses.length > 0 ? 'No expenses match your filters.' : 'No expenses recorded yet.'}
            </p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
