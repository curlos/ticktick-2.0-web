import React, { useEffect, useRef } from 'react';

const InfiniteScrollSelector = ({ items, unit, setSelected }) => {
	const scrollRef = useRef(null);

	useEffect(() => {
		const scrollElement = scrollRef.current;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollElement;
			if (scrollTop + clientHeight === scrollHeight) {
				// At bottom, reset to the middle
				scrollElement.scrollTop = scrollHeight / 3;
			} else if (scrollTop === 0) {
				// At top, reset to the middle
				scrollElement.scrollTop = scrollHeight / 3 - clientHeight;
			}
		};

		// Add event listener
		scrollElement.addEventListener('scroll', handleScroll);

		// Reset scroll position to middle on initial load
		const middle = scrollElement.scrollHeight / 3;
		scrollElement.scrollTop = middle - scrollElement.clientHeight / 2;

		// Remove event listener on cleanup
		return () => {
			if (scrollElement) {
				scrollElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, []); // Empty dependency array ensures this effect runs only once after initial render

	return (
		<div className="overflow-auto gray-scrollbar h-40" ref={scrollRef}>
			<div>
				{[...items, ...items, ...items].map((item, index) => (
					<div
						key={`${unit}-${index}`}
						className="text-center py-2 cursor-pointer hover:bg-gray-200"
						onClick={() => setSelected(item)}
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
};

export default InfiniteScrollSelector;
