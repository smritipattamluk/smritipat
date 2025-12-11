import { prisma } from './db';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';
type LogAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'VIEW';

interface LogOptions {
  userId?: string;
  action: LogAction;
  entity: string;
  entityId?: string;
  level?: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event to the database
 */
export async function createAuditLog(options: LogOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId,
        action: options.action,
        entity: options.entity,
        entityId: options.entityId,
        level: options.level || 'INFO',
        message: options.message,
        metadata: options.metadata ?? undefined,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
      },
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = options.level === 'ERROR' ? console.error : options.level === 'WARN' ? console.warn : console.log;
      logMethod(`[${options.level}] ${options.action} ${options.entity}:`, options.message);
    }
  } catch (error) {
    // If logging fails, don't break the application - just log to console
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Get client IP address and user agent from request
 */
export function getRequestInfo(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Convenience functions for common log actions
 */
export const logger = {
  /**
   * Log a successful creation
   */
  created: (entity: string, entityId: string, userId?: string, metadata?: Record<string, any>) =>
    createAuditLog({
      userId,
      action: 'CREATE',
      entity,
      entityId,
      level: 'INFO',
      message: `${entity} created successfully`,
      metadata,
    }),

  /**
   * Log a successful update
   */
  updated: (entity: string, entityId: string, userId?: string, metadata?: Record<string, any>) =>
    createAuditLog({
      userId,
      action: 'UPDATE',
      entity,
      entityId,
      level: 'INFO',
      message: `${entity} updated successfully`,
      metadata,
    }),

  /**
   * Log a successful deletion
   */
  deleted: (entity: string, entityId: string, userId?: string, metadata?: Record<string, any>) =>
    createAuditLog({
      userId,
      action: 'DELETE',
      entity,
      entityId,
      level: 'INFO',
      message: `${entity} deleted`,
      metadata,
    }),

  /**
   * Log a user login
   */
  login: (userId: string, ipAddress?: string, userAgent?: string) =>
    createAuditLog({
      userId,
      action: 'LOGIN',
      entity: 'user',
      entityId: userId,
      level: 'INFO',
      message: 'User logged in',
      ipAddress,
      userAgent,
    }),

  /**
   * Log a user logout
   */
  logout: (userId: string, ipAddress?: string) =>
    createAuditLog({
      userId,
      action: 'LOGOUT',
      entity: 'user',
      entityId: userId,
      level: 'INFO',
      message: 'User logged out',
      ipAddress,
    }),

  /**
   * Log a data export
   */
  export: (entity: string, userId?: string, metadata?: Record<string, any>) =>
    createAuditLog({
      userId,
      action: 'EXPORT',
      entity,
      level: 'INFO',
      message: `${entity} data exported`,
      metadata,
    }),

  /**
   * Log an error
   */
  error: (entity: string, message: string, userId?: string, metadata?: Record<string, any>) =>
    createAuditLog({
      userId,
      action: 'VIEW',
      entity,
      level: 'ERROR',
      message,
      metadata,
    }),

  /**
   * Log a warning
   */
  warn: (entity: string, message: string, userId?: string, metadata?: Record<string, any>) =>
    createAuditLog({
      userId,
      action: 'VIEW',
      entity,
      level: 'WARN',
      message,
      metadata,
    }),
};
