import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
  },
}); 
<<<<<<< HEAD

=======
>>>>>>> 1d79d3c8930d1f79da7cb36b8a8c7460db1ed9d5
