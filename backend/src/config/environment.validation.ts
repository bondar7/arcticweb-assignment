import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  PORT!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL!: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, {
    PORT: config.PORT ?? '3002',
    DATABASE_URL: config.DATABASE_URL,
    FRONTEND_URL: config.FRONTEND_URL ?? 'http://localhost:3000',
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  return validatedConfig;
}
