import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [reactRefresh()],
    resolve: {
        alias: {
            '@plugins/': '/src/plugins/',
            '@utils/': '/src/utils/',
            '@hooks/': '/src/hooks/',
            '@components/': '/src/components/',
        },
    },
    build: {
        outDir: 'build',
    },
});
