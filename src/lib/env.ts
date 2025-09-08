// Environment configuration
export const env = {
  SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://poke-next-generation.vercel.app',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

// Validate required environment variables
export function validateEnv() {
  const required = ['NEXT_PUBLIC_SITE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values for development');
  }
}
