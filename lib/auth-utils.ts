import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export type UserRole = 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'VIEWER';

/**
 * Get the current authenticated session or redirect to login
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

/**
 * Check if user has one of the required roles
 */
export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Require user to have one of the specified roles, otherwise redirect to dashboard
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  if (!hasRole(session.user.role, allowedRoles)) {
    redirect('/dashboard');
  }
  return session;
}

/**
 * Check if user can manage bookings (create, edit, delete)
 */
export function canManageBookings(role: UserRole): boolean {
  return hasRole(role, ['ADMIN', 'MANAGER']);
}

/**
 * Check if user can view financial data
 */
export function canViewFinancials(role: UserRole): boolean {
  return hasRole(role, ['ADMIN', 'MANAGER', 'ACCOUNTANT']);
}

/**
 * Check if user can manage expenses
 */
export function canManageExpenses(role: UserRole): boolean {
  return hasRole(role, ['ADMIN', 'ACCOUNTANT']);
}

/**
 * Check if user can manage users
 */
export function canManageUsers(role: UserRole): boolean {
  return hasRole(role, ['ADMIN']);
}

/**
 * Check if user can manage system settings
 */
export function canManageSettings(role: UserRole): boolean {
  return hasRole(role, ['ADMIN']);
}

/**
 * Check if user can manage halls
 */
export function canManageHalls(role: UserRole): boolean {
  return hasRole(role, ['ADMIN', 'MANAGER']);
}
