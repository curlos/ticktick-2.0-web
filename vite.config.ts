import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'], // Add additional assets here
			manifest: {
				name: 'My React PWA',
				short_name: 'ReactPWA',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'pwa-192x192.png', // Place this image in the public folder
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png', // Place this image in the public folder
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
		}),
	],
});
