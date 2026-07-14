import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      options: {
        projectConfig: {
          root: '',
          sourceRoot: 'src',
          buildOptions: {
            outputPath: 'dist/material-addons-project-cypress',
            index: 'src/index.html',
            main: 'src/main.ts',
            polyfills: ['src/polyfills.ts'],
            tsConfig: 'tsconfig.app.json',
            preserveSymlinks: true,
            assets: ['src/favicon.ico', 'src/assets', 'src/app/example-components'],
            styles: [
              'node_modules/roboto-fontface/css/roboto/roboto-fontface.css',
              'node_modules/material-icons/iconfont/material-icons.css',
              'node_modules/highlight.js/styles/github.css',
              'src/styles.scss',
              {
                input: 'src/theme-pbv.scss',
                inject: false,
                bundleName: 'theme-pbv',
              },
              {
                input: 'src/theme-poa.scss',
                inject: false,
                bundleName: 'theme-poa',
              },
              {
                input: 'src/theme-carcat.scss',
                inject: false,
                bundleName: 'theme-carcat',
              },
            ],
            stylePreprocessorOptions: {
              includePaths: ['./src', './node_modules'],
            },
            scripts: [],
            extractLicenses: false,
            sourceMap: true,
            optimization: false,
            namedChunks: true,
          },
        },
      },
    },
    specPattern: '**/*.cy.ts',
  },
});
