import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string(),
  // Add other environment variables here
});

const env = envSchema.parse(process.env);

export { env };


export const FRONTEND_URL = 'https://ashy-mud-06186b40f.5.azurestaticapps.net'