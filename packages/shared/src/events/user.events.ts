// Kafka Event Interfaces for User Domain

export interface UserCreatedEvent {
  id: string;
  email: string;
  name?: string;
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

export interface UserLoginEvent {
  id: string;
  email: string;
  loginAt: Date;
  ip?: string;
  userAgent?: string;
}
