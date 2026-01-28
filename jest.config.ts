import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets/index.js';

export default {
  ...createCjsPreset({ tsconfig: '<rootDir>/tsconfig.jest.json' }),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // uuid > version 8 is ESM only and therefore does not transpile without this config
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)',
  ],
} satisfies Config;
