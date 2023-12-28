import { UserConfigExport, defineConfig } from 'vite'
import { resolve } from 'path'

const isProduction = (command: string): command is 'build' =>
  command === 'build'

export default {
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'pure-context',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
} as UserConfigExport
