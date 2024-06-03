import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FocusTimer from './FocusTimer';

describe('FocusTimer', () => {
	it('counts down and updates the timer display', () => {
		render(<FocusTimer />);

		// Start the timer
		act(() => {
			fireEvent.click(screen.getByText('Start'));
		});

		// Advance timers by one second
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		// Check for the new expected time
		expect(screen.getByText('44:59')).toBeInTheDocument();

		// Prints out the current DOM
		screen.debug();

		// Simulate the timer running to zero
		act(() => {
			jest.advanceTimersByTime(2699 * 1000); // Fast-forward remaining time
		});

		// Check if the timer shows the correct overtime
		expect(screen.getByText('00:00')).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(1000); // 1 second into overtime
		});

		expect(screen.getByText('45:01')).toBeInTheDocument();
	});
});
