import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173, // 개발 서버 포트
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
