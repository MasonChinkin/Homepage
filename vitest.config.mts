import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    alias: {
      'src/': '/src/',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        '**.d.ts',
        '**d3sankey.ts',
      ],
    },
  },
})
