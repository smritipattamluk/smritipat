'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  X,
  ChevronRight,
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
import { useState, useEffect, useCallback } from 'react';

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center animate-fade-in">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-50 text-red-700 border border-red-200';
      case 'MANAGER': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'ACCOUNTANT': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const currentPage = filteredNavigation.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 glass border-b border-slate-200/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 active:scale-95 transition-all"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-base font-bold text-slate-900 truncate">
            {currentPage?.name || 'Smritipat'}
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-white shadow-sm">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-semibold">{session?.user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${getRoleColor(userRole)}`}>
                  {userRole}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-14 px-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">Smritipat</h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Hall Management</p>
              </div>
            </div>
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                  }`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="p-3 border-t border-slate-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
                  <Avatar className="w-9 h-9 ring-2 ring-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${getRoleColor(userRole)}`}>
                      {userRole}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="min-h-screen p-4 lg:p-8 pt-[4.5rem] lg:pt-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      <QuickActionButton />
      <KeyboardShortcuts />

      {/* Bottom tab bar for mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-slate-200/60 safe-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {filteredNavigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[56px] transition-all ${
                  isActive ? 'text-blue-600' : 'text-slate-400 active:text-slate-600'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
