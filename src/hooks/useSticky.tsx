import { useState, useEffect } from 'react';

const useSticky = (scrollableElementRef, stickyElementRef) => {
	const [isSticky, setSticky] = useState(false);

	useEffect(() => {
		// Handle scroll event
		const handleScroll = () => {
			if (stickyElementRef.current) {
				// Get the bounding rectangle of the sticky element relative to the viewport
				const stickyElementRect = stickyElementRef.current.getBoundingClientRect();
				// Check if the element is sticky
				setSticky(stickyElementRect.top <= 0);
			}
		};

		// Get the current scrollable element
		const scrollableElement = scrollableElementRef.current;

		// Add the event listener to the scrollable element
		scrollableElement?.addEventListener('scroll', handleScroll);

		// Clean up the event listener
		return () => {
			scrollableElement?.removeEventListener('scroll', handleScroll);
		};
	}, [scrollableElementRef, stickyElementRef]);

	return isSticky;
};

export default useSticky;
