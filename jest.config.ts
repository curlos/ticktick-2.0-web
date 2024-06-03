import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	moduleNameMapper: {
		'\\.(mp3|mp4|jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.ts',
		'\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.ts',
	},
	globals: {
		// TODO: Bring this back later when I start fixing the TypeScript errors in this project.
		'ts-jest': {
			diagnostics: false, // This tells ts-jest to ignore all TypeScript errors
		},
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
