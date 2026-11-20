import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/lead_manager?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-meru-lead-manager-2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
