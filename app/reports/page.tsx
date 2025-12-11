'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedLayout from '@/components/layout/protected-layout';
import { Download, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Financial reports and analytics</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="w-full lg:w-auto">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="w-full lg:w-auto">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Button onClick={() => refetch()} className="w-full sm:w-auto">
                  Generate
                </Button>
                {data && (
                  <>
                    <Button
                      variant="outline"
                      onClick={exportToPDF}
                      className="w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportToExcel}
                      className="w-full sm:w-auto"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && <div className="text-center py-8">Loading report...</div>}

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(data.earnings.netEarnings)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(data.expenses.total)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.netProfit)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bookings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  Total Bookings: <span className="font-bold">{data.bookingsCount}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Period: {format(new Date(startDate), 'MMM d, yyyy')} -{' '}
                  {format(new Date(endDate), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
