import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-swc';
import yaml from '@rollup/plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [reactRefresh(), yaml()],
    resolve: {
        alias: {
            '@plugins/': '/src/plugins/',
            '@utils/': '/src/utils/',
            '@hooks/': '/src/hooks/',
            '@components/': '/src/components/',
        },
    },
    build: {
        target: 'esnext',
        outDir: 'build',
    },
    server: {
        port: 3000,
        fs: {
            strict: false,
        },
    },
});
