import { useEffect } from 'react';

/**
 * Custom hook for handling clicks outside of a specified element (ref).
 *
 * @param {React.RefObject} ref - The ref of the element to detect outside clicks for.
 * @param {React.RefObject} innerClickElemRefs - A list of safe refs that are not necessarily within the dropdown. One example would be a Context Menu that is opened from a dropdown. Context Menu's are created through a React portal so the element is attached in the body and is NOT an inner element of the dropdown so it if it's clicked, then ordinarily the dropdown would be closed. However, by passing in the ref of the context menu in this array, it can be flagged as a safe element that will not cause the outer dropdown to close when the Context Menu is clicked even though it's not INSIDE the dropdown but outside in the body.
 * @param {Function} onOutsideClick - The callback to execute when an outside click is detected.
 */
const useOutsideClick = (ref, toggleRef, innerClickElemRefs, onOutsideClick) => {
	useEffect(() => {
		const handleClickOutside = (event) => {
			const clickedAnInnerElemRef = innerClickElemRefs?.find((innerClickElemRef) =>
				innerClickElemRef?.current?.contains(event.target)
			);

			const didNotClickASafeElement =
				ref.current &&
				!ref.current.contains(event.target) &&
				(!toggleRef.current || !toggleRef.current.contains(event.target)) &&
				!clickedAnInnerElemRef;

			if (didNotClickASafeElement) {
				onOutsideClick();
			}
		};

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, onOutsideClick]); // Only re-run if ref or callback changes
};

export default useOutsideClick;
