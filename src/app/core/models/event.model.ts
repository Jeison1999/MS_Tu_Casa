/**
 * Interfaces para los eventos según el backend Rails
 */

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string; // ISO 8601 format
  location: string;
  image_url: string;
  is_upcoming: boolean;
  is_past: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventWithCountdown extends Event {
  countdown?: CountdownData;
  days_until?: number;
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface EventsIndexResponse {
  upcoming: Event[];
  recent_past: Event[];
  meta: {
    upcoming_count: number;
    past_count: number;
    total: number;
  };
}

export interface EventsListResponse {
  events: EventWithCountdown[];
  meta: {
    total: number;
    limit?: number;
  };
}

export interface EventDetailResponse {
  event: EventWithCountdown;
}
