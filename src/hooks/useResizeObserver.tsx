import { useEffect, useRef } from 'react';

// This hook now takes an additional parameter `setState` which is the state setter function for updating dimensions
const useResizeObserver = (ref, setState, dimensions = 'width') => {
	const observer = useRef(null);

	useEffect(() => {
		observer.current = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (Array.isArray(dimensions)) {
					const newState = {};

					for (let dimension of dimensions) {
						const computedStyle = getComputedStyle(entry.target);
						let size = parseFloat(computedStyle[dimension]);
						newState[dimension] = size;
					}

					setState(newState);
				} else {
					const computedStyle = getComputedStyle(entry.target);
					let size = parseFloat(computedStyle[dimensions]);
					setState(size);
				}
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
	}, [ref, setState]);

	return observer.current;
};

export default useResizeObserver;
