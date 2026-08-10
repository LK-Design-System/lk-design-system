const config = {
  stories: ['../stories/**/*.stories.@(js|jsx)'],
  staticDirs: [
    { from: '../assets', to: '/assets' },
    { from: '../tokens', to: '/tokens' },
    { from: '../styles.css', to: '/styles.css' },
    { from: '../packages/core/docs', to: '/' },
    { from: '../packages/core/docs/manifest.json', to: '/design-system.json' },
    { from: '../packages/core/docs/LDS_UI_ADOPTION_CONTRACT.schema.json', to: '/schemas/lds-ui-adoption-contract.schema.json' },
    { from: '../packages/core/docs/adoption-report.schema.json', to: '/schemas/lds-ui-adoption-report.schema.json' },
    { from: '../packages/core/docs/adoption-config.schema.json', to: '/schemas/lds-ui-adoption-config.schema.json' },
    { from: '../packages/theme/docs', to: '/packages/theme' },
    { from: '../packages/product/docs', to: '/packages/product' },
    { from: '../packages/compat/docs', to: '/packages/compat' },
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  features: {
    // LDS consumers need the system navigation, not Storybook's product tutorial.
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  core: {
    allowedHosts: ['localhost', '127.0.0.1'],
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    const allowedHosts = config.server?.allowedHosts === true
      ? true
      : Array.from(new Set([...(config.server?.allowedHosts || []), 'localhost', '127.0.0.1']));

    return {
      ...config,
      server: {
        ...config.server,
        allowedHosts,
        watch: {
          ...config.server?.watch,
          // Build output and caches are written by `storybook build` / gate
          // scripts (often from a parallel process). A dev server that reloads
          // on those writes can churn the preview iframe continuously, so keep
          // them out of the watcher.
          ignored: [
            '**/storybook-static/**',
            '**/node_modules/.cache/**',
            '**/dist/**',
          ],
        },
      },
      build: {
        ...config.build,
        assetsDir: '_sb-vite-assets',
        chunkSizeWarningLimit: 1200,
      },
    };
  },
};

export default config;
