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
  name?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

// For user creation in services (no password)
export class CreateUserServiceDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsNotEmpty()
  role!: string;
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
