import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Default export required by Vite.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
