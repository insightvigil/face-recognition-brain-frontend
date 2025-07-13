import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/face-recognition-brain-frontend/',  
  plugins: [react()],
});