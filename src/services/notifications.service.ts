import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';

export interface AppNotification {
  id: number;
  icon: string;
  text: string;
  time: string;
  color: string;
  unread: boolean;
}

interface NotificationsResponse {
  success: boolean;
  data: AppNotification[];
  unread: number;
}

class NotificationsService {
  async getNotifications(): Promise<{ notifications: AppNotification[]; unread: number }> {
    const response = await apiClient.get<NotificationsResponse>(endpoints.notifications.list);
    const body = response.data;
    return { notifications: body.data ?? [], unread: body.unread ?? 0 };
  }

  async markAllRead(): Promise<void> {
    await apiClient.post(endpoints.notifications.markRead);
  }
}

export const notificationsService = new NotificationsService();
