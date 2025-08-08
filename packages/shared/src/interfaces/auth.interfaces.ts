import { Request } from 'express';

// JWT Payload interface
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

// Authenticated User interface
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

// Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

// Login response
export interface LoginResponseDto {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  access_token: string;
}

// Signup response
export interface SignupResponseDto {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  access_token: string;
}
