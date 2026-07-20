export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

const STORAGE_KEY = 'javid_hrm_notification_preferences';

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: false,
  sms: true,
};

export function loadNotificationPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      email: parsed.email ?? defaultPreferences.email,
      push: parsed.push ?? defaultPreferences.push,
      sms: parsed.sms ?? defaultPreferences.sms,
    };
  } catch {
    return defaultPreferences;
  }
}

export function saveNotificationPreferences(preferences: NotificationPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
