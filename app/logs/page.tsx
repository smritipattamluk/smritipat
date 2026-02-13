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
import { Trash2, Download, RefreshCw, FileText, Shield } from 'lucide-react';

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
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'WARN':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'INFO':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'DELETE':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'LOGIN':
        return 'bg-violet-50 text-violet-700 border border-violet-200';
      case 'EXPORT':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
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
      <div className="space-y-4 lg:space-y-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
              <p className="text-sm text-slate-500 mt-0.5">System activity and security logs</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-lg border-slate-200">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs} disabled={!data?.logs.length} className="rounded-lg border-slate-200">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearOldLogs}
              disabled={clearOldLogs.isPending}
              className="rounded-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Old
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
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
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <CardTitle className="text-base font-semibold">
                Activity Log
              </CardTitle>
              {data && (
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {data.pagination.total}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 animate-pulse space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-14 bg-slate-200 rounded-full" />
                      <div className="h-5 w-16 bg-slate-200 rounded-full" />
                      <div className="h-5 w-20 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : data && data.logs.length > 0 ? (
              <>
                <div className="space-y-3">
                  {data.logs.map((log, index) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge className={`${getLevelColor(log.level)} text-[10px] font-semibold px-2 py-0.5`}>{log.level}</Badge>
                        <Badge className={`${getActionColor(log.action)} text-[10px] font-semibold px-2 py-0.5`}>{log.action}</Badge>
                        <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 border-slate-200">{log.entity}</Badge>
                        <span className="text-xs text-slate-400 ml-auto">
                          {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{log.message}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        {log.user && (
                          <span>
                            User: <span className="font-medium text-slate-600">{log.user.name}</span> ({log.user.email})
                          </span>
                        )}
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        {log.entityId && <span>ID: {log.entityId}</span>}
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors">
                            View metadata
                          </summary>
                          <pre className="mt-2 p-2 bg-white rounded-lg border border-slate-100 overflow-x-auto text-slate-600">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg border-slate-200"
                    >
                      Previous
                    </Button>
                    <span className="text-xs font-medium text-slate-500">
                      Page {page} of {data.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.pagination.totalPages}
                      className="rounded-lg border-slate-200"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No logs found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
