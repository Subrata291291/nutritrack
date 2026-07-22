import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { UserProfile, UserSettings } from 'types/settings';
import type { User } from 'types/index';

class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get(endpoints.user.profile);
    return response.data?.data ?? response.data;
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put(endpoints.user.profile, profile);
    return response.data?.data ?? response.data;
  }

  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get(endpoints.user.settings);
    return response.data?.data ?? response.data;
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await apiClient.put(endpoints.user.settings, settings);
    return response.data?.data ?? response.data;
  }

  async getMe(): Promise<User> {
    const response = await apiClient.get(endpoints.auth.me);
    return response.data;
  }

  async changePassword(password: string): Promise<void> {
    await apiClient.put(endpoints.auth.me, { password });
  }

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(endpoints.user.avatar, formData);
    return response.data?.data?.url ?? '';
  }
}

export const userService = new UserService();
