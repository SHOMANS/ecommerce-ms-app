import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// For user registration/signup
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  role?: string;
}

// For login requests
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

// For updating user profiles
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

// For API responses
export class UserResponseDto {
  id!: string;
  email!: string;
  name?: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

// For profile response with token
export class ProfileResponseDto {
  id!: string;
  email!: string;
  name?: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
  access_token!: string;
}
