// // In your test setup file or at the top of your test file
// jest.setup.js

// Mock for Notification API
global.Notification = jest.fn().mockImplementation((title, options) => {
	return { title, ...options };
});

// Mock for Notification.requestPermission
global.Notification.requestPermission = jest.fn(() => Promise.resolve('granted'));
global.Notification.permission = 'granted'; // Default permission state

global.Audio = class {
	play = jest.fn();
	pause = jest.fn();
};

jest.useFakeTimers();

// Mock HTMLMediaElement's play() and pause() methods
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
	configurable: true,
	writable: true,
	value: jest.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
	configurable: true,
	writable: true,
	value: jest.fn(),
});
