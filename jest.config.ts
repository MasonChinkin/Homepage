import { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  maxWorkers: '50%',
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2|webp)$':
      'identity-obj-proxy',
  },
}

export default config
