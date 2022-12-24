/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

import reactRefresh from '@vitejs/plugin-react-swc';
import yaml from '@rollup/plugin-yaml';

// eslint-disable-next-line import/extensions
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    define: {
        APP_VERSION: JSON.stringify(packageJson.version),
    },
    plugins: [reactRefresh(), yaml(), visualizer()],
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
