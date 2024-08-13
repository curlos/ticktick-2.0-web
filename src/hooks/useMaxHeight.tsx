import { useState, useEffect } from 'react';

function useMaxHeight(headerHeight, baseHeight = '100vh') {
	const [maxHeight, setMaxHeight] = useState(`calc(${baseHeight} - ${headerHeight}px)`);

	useEffect(() => {
		function handleResize() {
			// Update the max height when the window resizes
			const updatedHeight = `calc(${baseHeight} - ${headerHeight}px)`;
			setMaxHeight(updatedHeight);
		}

		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Initial setting
		handleResize();

		// Cleanup function to remove event listener
		return () => window.removeEventListener('resize', handleResize);
	}, [headerHeight, baseHeight]); // Depend on headerHeight and baseHeight to update on their change

	return maxHeight;
}

export default useMaxHeight;
