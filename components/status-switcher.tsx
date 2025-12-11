'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CheckCircle, Clock, XCircle, HelpCircle, Calendar } from 'lucide-react';

interface StatusSwitcherProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const statusConfig = {
  INQUIRY: {
    label: 'Inquiry',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    icon: HelpCircle,
    nextSteps: ['TENTATIVE', 'CONFIRMED', 'CANCELLED'],
  },
  TENTATIVE: {
    label: 'Tentative',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    icon: Clock,
    nextSteps: ['CONFIRMED', 'CANCELLED'],
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    icon: Calendar,
    nextSteps: ['COMPLETED', 'CANCELLED'],
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    icon: CheckCircle,
    nextSteps: [],
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 hover:bg-red-200',
    icon: XCircle,
    nextSteps: [],
  },
};

export function StatusSwitcher({ currentStatus, onStatusChange, disabled }: StatusSwitcherProps) {
  const config = statusConfig[currentStatus as keyof typeof statusConfig];
  const Icon = config?.icon || HelpCircle;

  if (!config) return null;

  const availableStatuses = config.nextSteps
    .map(status => ({
      status,
      ...statusConfig[status as keyof typeof statusConfig],
    }));

  if (availableStatuses.length === 0) {
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={`${config.color} border-none`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {config.label}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableStatuses.map(({ status, label, icon: StatusIcon }) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status)}
          >
            <StatusIcon className="w-4 h-4 mr-2" />
            Change to {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
