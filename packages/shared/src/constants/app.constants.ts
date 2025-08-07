export const APP_CONSTANTS = {
  JWT_EXPIRY: '24h',
  BCRYPT_ROUNDS: 12,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const KAFKA_EVENTS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGIN: 'user.login',
} as const;

export const HTTP_STATUS_MESSAGES = {
  200: 'Success',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
} as const;
