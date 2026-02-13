'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Calendar, DollarSign, X } from 'lucide-react';

export function QuickActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-[5.5rem] right-4 z-30 lg:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="rounded-2xl h-14 w-14 shadow-lg shadow-blue-500/25 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-transform"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
          <DropdownMenuItem asChild>
            <Link href="/bookings/new" className="flex items-center cursor-pointer py-2.5">
              <Calendar className="w-4 h-4 mr-2.5 text-blue-600" />
              New Booking
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/expenses/new" className="flex items-center cursor-pointer py-2.5">
              <DollarSign className="w-4 h-4 mr-2.5 text-emerald-600" />
              New Expense
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
