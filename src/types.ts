export interface Activity {
  id: string;
  title: string;
  price: number;
  duration: string;
  availability: 'Available' | 'Limited' | 'Full';
  image: string;
  category: 'Surf' | 'Boat' | 'Tours';
  rating: number;
  reviewsCount: number;
  description: string;
  tags: string[];
  maxGroupSize: number;
  slots: {
    id: string;
    date: string;
    time: string;
    spotsLeft: number;
    full: boolean;
  }[];
}

export interface Booking {
  id: string;
  activityId: string;
  activityTitle: string;
  activityCategory: 'Surf' | 'Boat' | 'Tours';
  activityImage: string;
  date: string;
  time: string;
  peopleCount: number;
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled';
  preparationGuide: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface BookingAttempt {
  date: string;
  time: string;
  people: number;
  readyToConfirm: boolean;
}
