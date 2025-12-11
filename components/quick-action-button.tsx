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
    <div className="fixed bottom-20 right-4 z-40 lg:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/bookings/new" className="flex items-center cursor-pointer">
              <Calendar className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/expenses/new" className="flex items-center cursor-pointer">
              <DollarSign className="w-4 h-4 mr-2" />
              New Expense
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
