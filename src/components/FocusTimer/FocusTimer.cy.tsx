import React from 'react';
import FocusTimer from './FocusTimer';

describe('<FocusTimer />', () => {
	beforeEach(() => {
		cy.clock(); // Take control of timers
		cy.mount(<FocusTimer />); // Mount component
	});

	it('counts down from 45 minutes and goes into overtime', () => {
		cy.contains('Start').click();
		cy.tick(1300000); // Fast forward 45 minutes
		cy.wait(2000);
		cy.tick(10000); // Fast forward 45 minutes
		cy.get('[data-cy="timer-display"]').should('have.text', '00:00'); // Check display at zero
		cy.tick(1000); // Move 1 second into overtime
		cy.get('[data-cy="timer-display"]').should('have.text', '00:01'); // Check overtime display
	});
});
