import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { Provider } from 'react-redux';
import store from './store/store.tsx';

import { registerSW } from 'virtual:pwa-register';

import './index.css';
import 'material-symbols';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);

// Register the service worker
registerSW();
