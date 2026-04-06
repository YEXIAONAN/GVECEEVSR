import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // GitHub Pages 兼容方案：
  // 1) 生产环境默认使用当前仓库名路径（此仓库默认为 /GVECEEVSR/）
  // 2) 可通过 VITE_BASE_PATH 覆盖（建议在 CI 中注入）
  // 3) 本地开发固定为 /
  const defaultBase = mode === 'production' ? '/GVECEEVSR/' : '/'
  const basePath = process.env.VITE_BASE_PATH || defaultBase

  return {
    plugins: [vue()],
    base: basePath
  }
})
