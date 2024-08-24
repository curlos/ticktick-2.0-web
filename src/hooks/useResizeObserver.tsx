import { useEffect, useRef } from 'react';

// This hook now takes an additional parameter `setState` which is the state setter function for updating dimensions
const useResizeObserver = (ref, setState, dimension = 'width') => {
	const observer = useRef(null);

	useEffect(() => {
		observer.current = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const computedStyle = getComputedStyle(entry.target);
				const padTop = parseFloat(computedStyle.paddingTop);
				const padBottom = parseFloat(computedStyle.paddingBottom);
				const padLeft = parseFloat(computedStyle.paddingLeft);
				const padRight = parseFloat(computedStyle.paddingRight);
				const borderTop = parseFloat(computedStyle.borderTopWidth);
				const borderBottom = parseFloat(computedStyle.borderBottomWidth);
				const borderLeft = parseFloat(computedStyle.borderLeftWidth);
				const borderRight = parseFloat(computedStyle.borderRightWidth);
				const marginTop = parseFloat(computedStyle.marginTop);
				const marginBottom = parseFloat(computedStyle.marginBottom);
				const marginLeft = parseFloat(computedStyle.marginLeft);
				const marginRight = parseFloat(computedStyle.marginRight);

				let size = entry.contentRect[dimension];
				if (dimension === 'width') {
					size += padLeft + padRight + borderLeft + borderRight + marginLeft + marginRight;
				} else {
					size += padTop + padBottom + borderTop + borderBottom + marginTop + marginBottom;
				}

				setState(size);
			}
		});

		const currentRef = ref.current;
		if (currentRef) {
			observer.current.observe(currentRef);
		}

		return () => {
			if (observer.current && currentRef) {
				observer.current.disconnect();
			}
		};
	}, [ref, setState, dimension]); // Removed the padding dependency, now using CSS computed directly

	return observer.current;
};

export default useResizeObserver;
