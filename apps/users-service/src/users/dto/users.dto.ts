export interface UserCreatedEvent {
  id: string;
  email: string;
  role: string;
}

// User data for the users service (no password)
export interface CreateUserDto {
  id: string;
  email: string;
  name?: string;
  role: string;
}

// For updating user profiles
export interface UpdateUserDto {
  name?: string;
  role?: string;
}

// For responses
export interface UserResponseDto {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// For Kafka events
export interface UserCreatedEvent {
  id: string;
  email: string;
  name?: string;
  role: string;
}

// For authenticated requests
export interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}
