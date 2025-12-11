'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProtectedLayout from '@/components/layout/protected-layout';
import { Trash2, Download, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  level: string;
  message: string;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

interface LogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function LogsPage() {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState<string>('all');
  const [action, setAction] = useState<string>('all');
  const [entity, setEntity] = useState<string>('all');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (level !== 'all') params.set('level', level);
  if (action !== 'all') params.set('action', action);
  if (entity !== 'all') params.set('entity', entity);
  params.set('page', page.toString());
  params.set('limit', '50');

  const { data, isLoading, refetch } = useQuery<LogsResponse>({
    queryKey: ['logs', level, action, entity, page],
    queryFn: async () => {
      const res = await fetch(`/api/logs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      return res.json();
    },
  });

  const clearOldLogs = useMutation({
    mutationFn: async (daysToKeep: number) => {
      const res = await fetch(`/api/logs?daysToKeep=${daysToKeep}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to clear logs');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'EXPORT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClearOldLogs = () => {
    if (confirm('Delete logs older than 90 days? This action cannot be undone.')) {
      clearOldLogs.mutate(90);
    }
  };

  const exportLogs = () => {
    if (!data?.logs) return;

    const csv = [
      ['Timestamp', 'Level', 'Action', 'Entity', 'User', 'Message', 'IP Address'].join(','),
      ...data.logs.map((log) =>
        [
          format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss'),
          log.level,
          log.action,
          log.entity,
          log.user?.name || 'System',
          `"${log.message.replace(/"/g, '""')}"`,
          log.ipAddress || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">System activity and security logs</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs} disabled={!data?.logs.length}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearOldLogs}
              disabled={clearOldLogs.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Old Logs
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARN">Warning</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="LOGOUT">Logout</SelectItem>
                    <SelectItem value="EXPORT">Export</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Entity</label>
                <Select value={entity} onValueChange={setEntity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="hall">Hall</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Activity Log
              {data && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({data.pagination.total} total entries)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading logs...</div>
            ) : data && data.logs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {data.logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getLevelColor(log.level)}>{log.level}</Badge>
                        <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        <Badge variant="outline">{log.entity}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {log.user && (
                          <span>
                            User: <span className="font-medium">{log.user.name}</span> ({log.user.email})
                          </span>
                        )}
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        {log.entityId && <span>ID: {log.entityId}</span>}
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            View metadata
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {data.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No logs found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
