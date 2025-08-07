// Base user data that's shared between services
export interface BaseUserDto {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// For creating users (used in auth service)
export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

// For user data without sensitive info (used between services)
export interface UserPublicDto {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// For authentication responses
export interface AuthUserDto {
  id: string;
  email: string;
  name?: string;
  role: string;
}
