import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.ts'],
      coverage: {
        provider: 'istanbul',
        reporter: ['cobertura', 'lcov', 'text-summary'],
        include: ['src/**/*.ts', 'src/**/*.vue'],
      },
    },
  }),
)
