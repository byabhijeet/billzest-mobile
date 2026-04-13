import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';
import type { Notification } from '../types/domain';

/**
 * Service for in-app notifications.
 */
export const notificationsService = {
  /**
   * Fetch notifications for the current user's organization.
   */
  async getNotifications(orgId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error(
        '[NotificationsService] getNotifications failed',
        error.message,
      );
      return [];
    }

    return (data ?? []) as Notification[];
  },

  /**
   * Get count of unread notifications.
   */
  async getUnreadCount(orgId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId)
      .eq('is_read', false);

    if (error) {
      logger.error(
        '[NotificationsService] getUnreadCount failed',
        error.message,
      );
      return 0;
    }

    return count ?? 0;
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      logger.error('[NotificationsService] markAsRead failed', error.message);
      return false;
    }

    return true;
  },

  /**
   * Mark all notifications as read for an organization.
   */
  async markAllAsRead(orgId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('organization_id', orgId)
      .eq('is_read', false);

    if (error) {
      logger.error(
        '[NotificationsService] markAllAsRead failed',
        error.message,
      );
      return false;
    }

    return true;
  },
};
