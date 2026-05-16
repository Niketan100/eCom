const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: {
      '@real-app/errorHandler': join(__dirname, '../../packages/errorHandler/index.ts'),
      '@real-app/libs/prisma': join(__dirname, '../../packages/libs/prisma/index.ts'),
      '@real-app/libs/redis': join(__dirname, '../../packages/libs/redis/index.ts'),
    }
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      externalDependencies: 'none', // 👈 this is the key fix
    })
  ],
};