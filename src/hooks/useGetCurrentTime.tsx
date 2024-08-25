import { useEffect } from 'react';

const useGetCurrentTime = (callbackFunction) => {
	useEffect(() => {
		// Function to update both currentDateObj and currentDayTopValue
		const updateDateTime = (callbackFunction) => {
			const newDate = new Date();
			callbackFunction(newDate);
		};

		// Calculate how long to wait until the next minute starts
		const now = new Date();
		const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

		// Update immediately at the next minute mark
		const timeoutId = setTimeout(() => {
			updateDateTime(callbackFunction);
			// Then set an interval to continue updating every minute
			const intervalId = setInterval(updateDateTime, 60000);
			// Clear this interval on cleanup
			return () => {
				clearInterval(intervalId);
			};
		}, msUntilNextMinute);

		// Clean up the timeout and interval
		return () => {
			clearTimeout(timeoutId);
		};
	}, []); // Empty dependency array ensures this effect runs only once after initial render
};

export default useGetCurrentTime;
