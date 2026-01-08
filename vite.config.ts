import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [FACTORY RESET] 還原為最標準的 Vite + React 設定
// 移除所有手動分包與壓縮設定，確保系統穩定性優先
export default defineConfig({
  plugins: [react()],
  build: {
    // 保持預設，不做過度優化
    outDir: 'dist',
    sourcemap: false
  },
});