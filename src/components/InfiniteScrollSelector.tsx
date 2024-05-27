import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

const InfiniteScrollSelector = ({ items, unit, selectedValue, setSelectedValue }) => {
	const scrollRef = useRef(null);

	useEffect(() => {
		const scrollElement = scrollRef.current;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollElement;
			if (scrollTop + clientHeight >= scrollHeight) {
				// At bottom, reset to the middle
				scrollElement.scrollTop = scrollHeight / 3;
			} else if (scrollTop <= 0) {
				// At top, reset to the middle
				scrollElement.scrollTop = scrollHeight / 3 - clientHeight;
			}
		};

		// Add event listener
		scrollElement.addEventListener('scroll', handleScroll);

		// Calculate the middle and the index of the selected item in the middle third
		const itemsCopy = [...items, ...items, ...items]; // Triple the items
		const middleThirdStart = items.length; // Start of the middle third
		const selectedIndex = itemsCopy.indexOf(selectedValue, middleThirdStart); // Find index in the middle third
		const itemHeight = scrollElement.firstChild.firstChild.offsetHeight; // Assuming each item has the same height

		// Scroll to the selected item
		if (selectedIndex >= 0) {
			const scrollTarget = itemHeight * selectedIndex;
			scrollElement.scrollTop = scrollTarget - scrollElement.clientHeight / 2 + itemHeight / 2;
		}

		// Remove event listener on cleanup
		return () => {
			if (scrollElement) {
				scrollElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, [items, selectedValue]); // Depend on items and selectedValue to update scroll position when they change

	return (
		<div className="overflow-auto gray-scrollbar h-40" ref={scrollRef}>
			<div>
				{[...items, ...items, ...items].map((item, index) => (
					<div
						key={`${unit}-${index}`}
						className={classNames(
							'text-center py-2 rounded cursor-pointer',
							selectedValue === item ? 'bg-blue-500' : 'bg-transparent hover:bg-color-gray-200'
						)}
						onClick={() => setSelectedValue(item)}
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
};

export default InfiniteScrollSelector;
