const config = {
  stories: ['../stories/**/*.stories.@(js|jsx)'],
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
