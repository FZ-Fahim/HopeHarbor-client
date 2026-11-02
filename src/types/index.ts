export type EventCategory =
  | 'Cleanup'
  | 'Plantation'
  | 'Donation'
  | 'Healthcare'
  | 'Education'
  | 'Relief'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: EventCategory;
  thumbnailUrl: string;
  location: string;
  date: string; // ISO date string
  organizerEmail: string;
  organizerName: string;
  attendeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JoinedEventRecord {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
  event: EventItem;
}