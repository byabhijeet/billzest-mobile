import { reportsService, ReportsKpis } from '../supabase/reportsService';
import { billConfigService } from '../supabase/billConfigService';
import { Platform, Share, Alert } from 'react-native';
import { logger } from '../utils/logger';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Generate HTML for reports PDF
 */
const generateReportsHTML = async (
  kpis: ReportsKpis,
  trendData: number[],
  dateRange: 'Week' | 'Month' | 'Year',
  billConfig?: any,
): Promise<string> => {
  const storeName = billConfig?.store_name || 'BillZest Retailers';
  const storeAddress = billConfig?.address || '';
  const storePhone = billConfig?.phone || '';
  const gstNumber = billConfig?.gst_number || '';
  const storeEmail = billConfig?.email || '';

  const reportDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const end = new Date();
  const start = new Date();
  switch (dateRange) {
    case 'Week':
      start.setDate(end.getDate() - 7);
      break;
    case 'Month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'Year':
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  const dateRangeText = `${formatDate(start.toISOString())} to ${formatDate(end.toISOString())}`;

  const maxValue = Math.max(...trendData, 1);
  const trendBars = trendData
    .map((value, index) => {
      const height = Math.round((value / maxValue) * 100);
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
          <div style="display: flex; flex-direction: column; justify-content: flex-end; height: 120px; width: 100%;">
            <div style="background: #3b82f6; width: 100%; height: ${height}%; border-radius: 4px 4px 0 0; min-height: 4px;"></div>
          </div>
          <div style="margin-top: 8px; font-size: 11px; color: #6b7280; font-weight: 600;">${dayLabels[index]}</div>
        </div>
      `;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Report - ${dateRange}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .brand { flex: 1; }
    .brand-name { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .brand-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .report-meta { text-align: right; }
    .report-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
    .report-date { font-size: 12px; color: #6b7280; }
    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; }
    .kpi-card { padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; }
    .kpi-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600; }
    .kpi-value { font-size: 24px; font-weight: 700; color: #111827; }
    .kpi-sales { color: #22c55e; }
    .kpi-profit { color: #3b82f6; }
    .kpi-expenses { color: #ef4444; }
    .section-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px; }
    .chart-container { background: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; margin-bottom: 30px; }
    .chart-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 150px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px; }
    .summary { margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 12px; border-left: 4px solid #3b82f6; }
    .summary-title { font-weight: 600; color: #111827; margin-bottom: 12px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .summary-label { color: #6b7280; }
    .summary-value { font-weight: 600; color: #111827; }
    @media print { body { padding: 0; } .container { max-width: 100%; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <div class="brand-name">${escapeHtml(storeName)}</div>
        ${storeAddress ? `<div class="brand-meta">${escapeHtml(storeAddress)}</div>` : ''}
        ${storePhone ? `<div class="brand-meta">Phone: ${escapeHtml(storePhone)}</div>` : ''}
        ${storeEmail ? `<div class="brand-meta">Email: ${escapeHtml(storeEmail)}</div>` : ''}
        ${gstNumber ? `<div class="brand-meta">GSTIN: ${escapeHtml(gstNumber)}</div>` : ''}
      </div>
      <div class="report-meta">
        <div class="report-title">Business Report</div>
        <div class="report-date">${dateRange} Report</div>
        <div class="report-date">${reportDate}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Total Sales</div>
        <div class="kpi-value kpi-sales">${formatCurrency(kpis.sales)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Profit</div>
        <div class="kpi-value kpi-profit">${formatCurrency(kpis.profit)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Expenses</div>
        <div class="kpi-value kpi-expenses">${formatCurrency(kpis.expenses)}</div>
      </div>
    </div>

    <div class="chart-container">
      <div class="section-title">Weekly Sales Trend</div>
      <div class="chart-bars">
        ${trendBars}
      </div>
      <div style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 8px;">
        Period: ${dateRangeText}
      </div>
    </div>

    <div class="summary">
      <div class="summary-title">Summary</div>
      <div class="summary-row">
        <span class="summary-label">Report Period:</span>
        <span class="summary-value">${dateRangeText}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Total Sales:</span>
        <span class="summary-value">${formatCurrency(kpis.sales)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Total Expenses:</span>
        <span class="summary-value">${formatCurrency(kpis.expenses)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Net Profit:</span>
        <span class="summary-value">${formatCurrency(kpis.profit)}</span>
      </div>
      <div class="summary-row" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <span class="summary-label" style="font-weight: 700;">Profit Margin:</span>
        <span class="summary-value" style="font-weight: 700;">
          ${kpis.sales > 0 ? ((kpis.profit / kpis.sales) * 100).toFixed(2) : '0.00'}%
        </span>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return html;
};

/**
 * Generate CSV content for Excel export
 */
const generateReportsCSV = (
  kpis: ReportsKpis,
  trendData: number[],
  dateRange: 'Week' | 'Month' | 'Year',
): string => {
  const end = new Date();
  const start = new Date();
  switch (dateRange) {
    case 'Week':
      start.setDate(end.getDate() - 7);
      break;
    case 'Month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'Year':
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  const dateRangeText = `${formatDate(start.toISOString())} to ${formatDate(end.toISOString())}`;
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  let csv = `Business Report - ${dateRange}\n`;
  csv += `Generated: ${new Date().toLocaleDateString('en-IN')}\n`;
  csv += `Period: ${dateRangeText}\n\n`;

  csv += `Key Performance Indicators\n`;
  csv += `Metric,Amount\n`;
  csv += `Total Sales,${kpis.sales}\n`;
  csv += `Total Expenses,${kpis.expenses}\n`;
  csv += `Net Profit,${kpis.profit}\n`;
  csv += `Profit Margin,${kpis.sales > 0 ? ((kpis.profit / kpis.sales) * 100).toFixed(2) : '0.00'}%\n\n`;

  csv += `Weekly Sales Trend\n`;
  csv += `Day,Sales Amount\n`;
  trendData.forEach((value, index) => {
    const maxSales = Math.max(...trendData, 1);
    const salesAmount = (value / 100) * maxSales;
    csv += `${dayLabels[index]},${salesAmount.toFixed(2)}\n`;
  });

  return csv;
};

export const reportsExportService = {
  /**
   * Generate PDF report using expo-print
   */
  async generatePDFReport(
    kpis: ReportsKpis,
    trendData: number[],
    dateRange: 'Week' | 'Month' | 'Year',
  ): Promise<string> {
    try {
      const billConfig = await billConfigService.getConfig('');
      const html = await generateReportsHTML(
        kpis,
        trendData,
        dateRange,
        billConfig || undefined,
      );

      try {
        const { uri } = await Print.printToFileAsync({
          html,
          width: 595,
          height: 842,
        });

        if (__DEV__) {
          logger.log('[Reports Export] Generated PDF at:', uri);
        }
        return uri;
      } catch (pdfError: any) {
        if (__DEV__) {
          logger.warn('[Reports Export] expo-print not available, falling back to HTML:', pdfError);
        }
        return html;
      }
    } catch (error) {
      logger.error('[Reports Export] Failed to generate PDF report', error);
      throw error;
    }
  },

  /**
   * Share report as PDF using expo-sharing
   */
  async shareReportAsPDF(
    kpis: ReportsKpis,
    trendData: number[],
    dateRange: 'Week' | 'Month' | 'Year',
  ): Promise<void> {
    try {
      const fileUri = await this.generatePDFReport(kpis, trendData, dateRange);

      if (fileUri.startsWith('file://') || fileUri.startsWith('/')) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: `Share Business Report - ${dateRange}`,
            UTI: 'com.adobe.pdf',
          });
          return;
        }
      }

      // Fallback: Share as text
      const textVersion = this.generateTextVersion(kpis, trendData, dateRange);
      await Share.share({
        message: textVersion,
        title: `Business Report - ${dateRange}`,
      });
    } catch (error) {
      logger.error('[Reports Export] Failed to share report', error);
      throw error;
    }
  },

  /**
   * Generate and share CSV report using expo-file-system + expo-sharing
   */
  async shareReportAsCSV(
    kpis: ReportsKpis,
    trendData: number[],
    dateRange: 'Week' | 'Month' | 'Year',
  ): Promise<void> {
    try {
      const csv = generateReportsCSV(kpis, trendData, dateRange);

      try {
        const fileName = `BusinessReport_${dateRange}_${Date.now()}.csv`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        // Write CSV to file using expo-file-system
        await FileSystem.writeAsStringAsync(fileUri, csv, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Share the file using expo-sharing
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: `Share Business Report - ${dateRange} (CSV)`,
          });
          return;
        }
      } catch (shareError: any) {
        if (__DEV__) {
          logger.warn('[Reports Export] File sharing not available, using text fallback:', shareError);
        }
      }

      // Fallback: Share as text
      await Share.share({
        message: csv,
        title: `Business Report - ${dateRange} (CSV)`,
      });
    } catch (error) {
      logger.error('[Reports Export] Failed to share CSV report', error);
      throw error;
    }
  },

  /**
   * Generate text version of report
   */
  generateTextVersion(
    kpis: ReportsKpis,
    trendData: number[],
    dateRange: 'Week' | 'Month' | 'Year',
  ): string {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case 'Week':
        start.setDate(end.getDate() - 7);
        break;
      case 'Month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'Year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    let text = `BUSINESS REPORT - ${dateRange.toUpperCase()}\n\n`;
    text += `Period: ${formatDate(start.toISOString())} to ${formatDate(end.toISOString())}\n`;
    text += `Generated: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    text += `KEY PERFORMANCE INDICATORS:\n`;
    text += `Total Sales: ${formatCurrency(kpis.sales)}\n`;
    text += `Total Expenses: ${formatCurrency(kpis.expenses)}\n`;
    text += `Net Profit: ${formatCurrency(kpis.profit)}\n`;
    text += `Profit Margin: ${kpis.sales > 0 ? ((kpis.profit / kpis.sales) * 100).toFixed(2) : '0.00'}%\n\n`;
    text += `WEEKLY TREND:\n`;
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    trendData.forEach((value, index) => {
      const maxSales = Math.max(...trendData, 1);
      const salesAmount = (value / 100) * maxSales;
      text += `${dayLabels[index]}: ${formatCurrency(salesAmount)}\n`;
    });

    return text;
  },
};
