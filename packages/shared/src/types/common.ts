export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface KafkaMessage<T = any> {
  event: string;
  data: T;
  timestamp: Date;
  source: string;
}
