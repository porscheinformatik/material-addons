import type { Config } from 'jest';
import presets from 'jest-preset-angular/presets';

export default {
  ...presets.createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
} satisfies Config;
