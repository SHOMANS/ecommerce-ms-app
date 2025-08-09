// Kafka Event Interfaces for User Domain

export interface UserCreatedEvent {
  id: string;
  email: string;
  role: string;
  createdAt?: Date;
}

export interface UserUpdatedEvent {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  updatedAt: Date;
}

export interface UserDeletedEvent {
  id: string;
  email: string;
  deletedAt: Date;
}

// New events for user lookup via Kafka
export interface UserLookupRequestEvent {
  userId: string;
}
