import type { StorybookConfig } from '@storybook/angular';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/angular',
  webpackFinal: (webpackConfig) => {
    webpackConfig.module ??= {};
    // Source requests must bypass Angular/Babel loaders so Docs shows the file we compile.
    webpackConfig.module.rules = [
      {
        oneOf: [
          {
            test: /\.ts$/,
            include: resolve(process.cwd(), 'src/stories/numeric-field-examples'),
            resourceQuery: /^\?example-source$/,
            type: 'asset/source',
          },
          { rules: (webpackConfig.module.rules ?? []).filter((rule) => rule !== '...') },
        ],
      },
    ];
    return webpackConfig;
  },
};
export default config;
