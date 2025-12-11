'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Users,
  Building2,
  LogOut,
  Menu,
  FileText,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { QuickActionButton } from '@/components/quick-action-button';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'VIEWER'] },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays, roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'VIEWER'] },
  { name: 'Bookings', href: '/bookings', icon: Calendar, roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'VIEWER'] },
  { name: 'Expenses', href: '/expenses', icon: DollarSign, roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'Halls', href: '/halls', icon: Building2, roles: ['ADMIN'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
  { name: 'Logs', href: '/logs', icon: FileText, roles: ['ADMIN'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = session?.user?.role || 'VIEWER';
  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole));

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Smritipat</h1>
          <p className="text-xs text-gray-500">Hall Management</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smritipat</h1>
              <p className="text-xs text-gray-500">Hall Management</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-6 pt-20 lg:pt-6">{children}</main>
      </div>

      {/* Quick Action Button (Mobile) */}
      <QuickActionButton />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />
    </div>
  );
}
