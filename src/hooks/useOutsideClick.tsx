import { useEffect } from 'react';

/**
 * Custom hook for handling clicks outside of a specified element (ref).
 *
 * @param {React.RefObject} ref - The ref of the element to detect outside clicks for.
 * @param {Function} onOutsideClick - The callback to execute when an outside click is detected.
 */
const useOutsideClick = (ref, onOutsideClick) => {

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref && ref.current && !ref.current.contains(event.target)) {
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
