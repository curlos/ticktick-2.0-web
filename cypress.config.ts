import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		viewportWidth: 1280,
		viewportHeight: 800,
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
	},
});
