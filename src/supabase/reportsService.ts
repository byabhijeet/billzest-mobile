import { supabase } from './supabaseClient';
import { expensesService } from './expensesService';
import { toAppError } from '../utils/appError';
import { logger } from '../utils/logger';

export type ReportsKpis = {
  sales: number;
  profit: number;
  expenses: number;
};

const getDateRange = (
  range: 'Week' | 'Month' | 'Year',
): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();

  switch (range) {
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

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

const getWeeklyTrendDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const reportsService = {
  async getKpis(
    orgId: string,
    range: 'Week' | 'Month' | 'Year',
  ): Promise<ReportsKpis> {
    const { start, end } = getDateRange(range);

    // Fetch orders (sales) for the date range
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, subtotal, tax_amount')
      .eq('organization_id', orgId)
      .eq('is_cancelled', false)
      .gte('created_at', start)
      .lte('created_at', end);

    if (ordersError) {
      logger.error('[Reports] Failed to fetch orders', ordersError);
      throw toAppError(
        'reports.orders',
        ordersError,
        'Unable to load sales data.',
      );
    }

    // Fetch expenses for the date range
    const totalExpenses = await expensesService.getTotalExpenses(orgId, {
      startDate: start,
      endDate: end,
    });

    const sales = (orders ?? []).reduce(
      (sum, inv) => sum + (inv.total_amount ?? 0),
      0,
    );
    const profit = Math.max(0, sales - totalExpenses);

    return { sales, profit, expenses: totalExpenses };
  },

  async getWeeklyTrend(orgId: string): Promise<number[]> {
    const dates = getWeeklyTrendDates();
    const trendData: number[] = [];

    for (const date of dates) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('organization_id', orgId)
        .eq('is_cancelled', false)
        .gte('created_at', date)
        .lt('created_at', nextDate.toISOString().split('T')[0]);

      if (error) {
        logger.error(`[Reports] Failed to fetch sales for ${date}`, error);
        trendData.push(0);
        continue;
      }

      const daySales = (orders ?? []).reduce(
        (sum, o) => sum + (o.total_amount ?? 0),
        0,
      );
      trendData.push(daySales);
    }

    const maxSales = Math.max(...trendData, 1);
    return trendData.map(sales => Math.round((sales / maxSales) * 100));
  },
};
