import { defineConfig } from 'vite'
import devConfig from './vite.dev.config'
import prodConfig from './vite.prod.config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

const isProduction = (command: string): command is 'build' =>
  command === 'build'

export default defineConfig(({ command }) => {
  const isProd = isProduction(command)
  const extraConfig = isProd ? prodConfig : devConfig

  return {
    plugins: [
      react(),
      AutoImport({
        imports: [
          'react',
          {
            react: [
              'lazy',
              'memo',
              'createElement',
              'cloneElement',
              'isValidElement',
              'createContext',
            ],
          },
        ],
        dts: `./typings/auto-imports.d.ts`,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: `./.eslintrc-auto-import.json`, // Default `./.eslintrc-auto-import.json`
        },
        resolvers: [() => null],
      }),
    ],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    ...extraConfig,
  }
})
