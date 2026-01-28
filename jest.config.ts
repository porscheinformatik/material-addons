import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets/index.js';

export default {
  ...createCjsPreset({ tsconfig: '<rootDir>/tsconfig.jest.json' }),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // those packages are ESM only and therefore do not transpile without this config
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@angular|@ngx-translate)/)',
  ],
} satisfies Config;
