const config = {
  stories: ['../stories/**/*.stories.@(js|jsx)'],
  staticDirs: [
    { from: '../assets', to: '/assets' },
    { from: '../tokens', to: '/tokens' },
    { from: '../styles.css', to: '/styles.css' },
    { from: '../_ds_bundle.js', to: '/_ds_bundle.js' },
    { from: '../templates', to: '/templates' },
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => ({
    ...config,
    build: {
      ...config.build,
      chunkSizeWarningLimit: 1200,
    },
  }),
};

export default config;
