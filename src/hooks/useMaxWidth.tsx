import { useState, useEffect } from 'react';

const useMaxWidth = (elemWidth, baseWidth = '100vw') => {
	const [maxWidth, setMaxWidth] = useState(`calc(${baseWidth} - ${elemWidth}px)`);

	useEffect(() => {
		function handleResize() {
			// Update the max width when the window resizes
			const updatedWidth = `calc(${baseWidth} - ${elemWidth}px)`;
			setMaxWidth(updatedWidth);
		}

		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Initial setting
		handleResize();

		// Cleanup function to remove event listener
		return () => window.removeEventListener('resize', handleResize);
	}, [elemWidth, baseWidth]); // Depend on elemWidth and baseWidth to update on their change

	return maxWidth;
};

export default useMaxWidth;
