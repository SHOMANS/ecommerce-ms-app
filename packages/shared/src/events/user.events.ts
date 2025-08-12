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

export interface UserDeletedFromAuthEvent {
  id: string;
}

// Events from auth service to users service
export interface UserUpdateFromAuthEvent {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}
