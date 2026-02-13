'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedLayout from '@/components/layout/protected-layout';
import { Download, FileSpreadsheet, ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign, Calendar, Users, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    bookings: false,
    payments: false,
    expenses: false,
    halls: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', startDate, endDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      return res.json();
    },
    enabled: false,
  });

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '₹0.00';
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const exportToPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Smritipat Financial Report', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Period: ${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`, 14, 32);
    
    // Summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 45);
    
    const summaryData = [
      ['Total Revenue', formatCurrency(data.earnings?.totalRevenue)],
      ['Advance Payments', formatCurrency(data.earnings?.advancePayments)],
      ['Partial Payments', formatCurrency(data.earnings?.partialPayments)],
      ['Full Payments', formatCurrency(data.earnings?.fullPayments)],
      ['Refunds', formatCurrency(data.earnings?.refunds)],
      ['Net Earnings', formatCurrency(data.earnings?.netEarnings)],
      ['', ''],
      ['Total Expenses', formatCurrency(data.expenses?.total)],
      ['', ''],
      ['Net Profit', formatCurrency(data.netProfit)],
      ['Total Bookings', data.bookingsCount?.toString() || '0'],
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 },
    });

    // Expenses breakdown if available
    if (data.expenses.byCategory && Object.keys(data.expenses.byCategory).length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      doc.setFontSize(14);
      doc.text('Expenses by Category', 14, finalY + 15);
      
      const expensesData = Object.entries(data.expenses.byCategory).map(([category, amount]) => [
        category,
        formatCurrency(amount as number),
      ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Category', 'Amount']],
        body: expensesData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 10 },
      });
    }

    doc.save(`smritipat-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportToExcel = () => {
    if (!data) return;

    // Summary sheet
    const summaryData = [
      ['Smritipat Financial Report'],
      [`Period: ${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`],
      [],
      ['Metric', 'Value'],
      ['Total Revenue', data.earnings?.totalRevenue || 0],
      ['Advance Payments', data.earnings?.advancePayments || 0],
      ['Partial Payments', data.earnings?.partialPayments || 0],
      ['Full Payments', data.earnings?.fullPayments || 0],
      ['Refunds', data.earnings?.refunds || 0],
      ['Net Earnings', data.earnings?.netEarnings || 0],
      [],
      ['Total Expenses', data.expenses?.total || 0],
      [],
      ['Net Profit', data.netProfit || 0],
      ['Total Bookings', data.bookingsCount || 0],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    ws1['!cols'] = [{ wch: 25 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    // Expenses sheet if available
    if (data.expenses.byCategory && Object.keys(data.expenses.byCategory).length > 0) {
      const expensesData = [
        ['Expenses by Category'],
        [],
        ['Category', 'Amount'],
        ...Object.entries(data.expenses.byCategory).map(([category, amount]) => [
          category,
          amount as number,
        ]),
      ];

      const ws2 = XLSX.utils.aoa_to_sheet(expensesData);
      ws2['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws2, 'Expenses');
    }

    XLSX.writeFile(wb, `smritipat-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 lg:space-y-5 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Financial reports and analytics</p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
              <div className="w-full lg:w-auto">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-colors"
                />
              </div>
              <div className="w-full lg:w-auto">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-colors"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Button onClick={() => refetch()} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
                  Generate
                </Button>
                {data && (
                  <>
                    <Button variant="outline" onClick={exportToPDF} className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" onClick={exportToExcel} className="w-full sm:w-auto">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="grid gap-3 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="skeleton-shimmer h-3 w-20 rounded mb-3" />
                  <div className="skeleton-shimmer h-7 w-32 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data && (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl lg:text-2xl font-bold text-emerald-600">
                    {formatCurrency(data.earnings.netEarnings)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500" />
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl lg:text-2xl font-bold text-red-600">
                    {formatCurrency(data.expenses.total)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm card-hover overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-xl lg:text-2xl font-bold ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(data.netProfit)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-slate-900">{data.bookingsCount}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {format(new Date(startDate), 'MMM d, yyyy')} - {format(new Date(endDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Toggle Detailed Report */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowDetailedReport(!showDetailedReport)}
                className="w-full lg:w-auto"
              >
                {showDetailedReport ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Hide Detailed Report
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show Detailed Report
                  </>
                )}
              </Button>
            </div>

            {/* Detailed Report Section */}
            {showDetailedReport && (
              <div className="space-y-6 border-t pt-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Detailed Financial Report</h2>
                  <p className="text-muted-foreground">
                    Comprehensive breakdown of all transactions and financial activities
                  </p>
                </div>

                {/* Revenue Breakdown */}
                <Card>
                  <CardHeader 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleSection('payments')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <CardTitle>Revenue Breakdown</CardTitle>
                      </div>
                      {expandedSections.payments ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections.payments && (
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Revenue</span>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(data.earnings.totalRevenue)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Gross income before refunds
                          </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Net Earnings</span>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(data.earnings.netEarnings)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            After refunds
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Payment Breakdown</h4>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Advance
                            </Badge>
                            <span className="text-sm">Advance Payments</span>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(data.earnings.advancePayments)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Partial
                            </Badge>
                            <span className="text-sm">Partial Payments</span>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(data.earnings.partialPayments)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Full
                            </Badge>
                            <span className="text-sm">Full Payments</span>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(data.earnings.fullPayments)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Refunds
                            </Badge>
                            <span className="text-sm">Total Refunds</span>
                          </div>
                          <span className="font-semibold text-red-600">
                            -{formatCurrency(data.earnings.refunds)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Net Revenue</span>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(data.earnings.netEarnings)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Expenses Breakdown */}
                <Card>
                  <CardHeader 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleSection('expenses')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <CardTitle>Expenses Breakdown</CardTitle>
                      </div>
                      {expandedSections.expenses ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections.expenses && (
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-lg bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Total Expenses</span>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(data.expenses.total)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          All operating costs
                        </p>
                      </div>

                      {data.expenses.byCategory && Object.keys(data.expenses.byCategory).length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Expenses by Category</h4>
                          
                          {Object.entries(data.expenses.byCategory)
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .map(([category, amount]) => {
                              const percentage = ((amount as number) / data.expenses.total * 100).toFixed(1);
                              return (
                                <div key={category} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{category}</Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {percentage}%
                                      </span>
                                    </div>
                                    <span className="font-semibold">
                                      {formatCurrency(amount as number)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-red-500 h-2 rounded-full transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No expenses recorded for this period
                        </p>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Bookings Details */}
                {data.bookings && data.bookings.length > 0 && (
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleSection('bookings')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <CardTitle>Booking Details ({data.bookings.length})</CardTitle>
                        </div>
                        {expandedSections.bookings ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedSections.bookings && (
                      <CardContent>
                        <div className="space-y-3">
                          {/* Status Summary */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                            {['INQUIRY', 'TENTATIVE', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => {
                              const count = data.bookings.filter((b: any) => b.status === status).length;
                              const colors = {
                                INQUIRY: 'bg-gray-100 text-gray-800',
                                TENTATIVE: 'bg-yellow-100 text-yellow-800',
                                CONFIRMED: 'bg-blue-100 text-blue-800',
                                COMPLETED: 'bg-green-100 text-green-800',
                                CANCELLED: 'bg-red-100 text-red-800',
                              };
                              return (
                                <div key={status} className="text-center p-3 border rounded-lg">
                                  <p className="text-2xl font-bold">{count}</p>
                                  <Badge className={colors[status as keyof typeof colors]}>
                                    {status}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>

                          {/* Bookings List */}
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {data.bookings.map((booking: any, index: number) => (
                              <div
                                key={index}
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors gap-2"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{booking.customerName}</p>
                                    <Badge className={
                                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                      booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                      booking.status === 'TENTATIVE' ? 'bg-yellow-100 text-yellow-800' :
                                      booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }>
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.eventType} • {booking.hall}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2">
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                                  </p>
                                  <p className="font-semibold text-green-600">
                                    {formatCurrency(booking.totalAmount)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Hall Performance */}
                {data.bookings && data.bookings.length > 0 && (
                  <Card>
                    <CardHeader 
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleSection('halls')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-purple-600" />
                          <CardTitle>Hall Performance</CardTitle>
                        </div>
                        {expandedSections.halls ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedSections.halls && (
                      <CardContent>
                        <div className="space-y-4">
                          {(() => {
                            const hallStats = data.bookings.reduce((acc: any, booking: any) => {
                              if (!acc[booking.hall]) {
                                acc[booking.hall] = {
                                  bookings: 0,
                                  revenue: 0,
                                  confirmed: 0,
                                  completed: 0,
                                };
                              }
                              acc[booking.hall].bookings++;
                              acc[booking.hall].revenue += booking.totalAmount;
                              if (booking.status === 'CONFIRMED') acc[booking.hall].confirmed++;
                              if (booking.status === 'COMPLETED') acc[booking.hall].completed++;
                              return acc;
                            }, {});

                            return Object.entries(hallStats)
                              .sort(([, a]: any, [, b]: any) => b.revenue - a.revenue)
                              .map(([hall, stats]: any) => (
                                <div key={hall} className="p-4 border rounded-lg">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-lg">{hall}</h4>
                                    <span className="text-xl font-bold text-green-600">
                                      {formatCurrency(stats.revenue)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold">{stats.bookings}</p>
                                      <p className="text-xs text-muted-foreground">Total</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                                      <p className="text-xs text-muted-foreground">Confirmed</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                                      <p className="text-xs text-muted-foreground">Completed</p>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-green-500 h-2 rounded-full transition-all"
                                        style={{ 
                                          width: `${(stats.revenue / Object.values(hallStats).reduce((sum: number, s: any) => sum + s.revenue, 0) * 100)}%` 
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ));
                          })()}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Summary Insights */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm">Profit Margin</span>
                      <span className="font-bold text-lg">
                        {data.earnings.netEarnings > 0 
                          ? ((data.netProfit / data.earnings.netEarnings) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm">Average Booking Value</span>
                      <span className="font-bold text-lg">
                        {data.bookings && data.bookings.length > 0
                          ? formatCurrency(data.earnings.totalRevenue / data.bookings.length)
                          : formatCurrency(0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm">Expense to Revenue Ratio</span>
                      <span className="font-bold text-lg">
                        {data.earnings.netEarnings > 0
                          ? ((data.expenses.total / data.earnings.netEarnings) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>

                    {data.bookings && data.bookings.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm">Completion Rate</span>
                        <span className="font-bold text-lg">
                          {((data.bookings.filter((b: any) => b.status === 'COMPLETED').length / data.bookings.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
