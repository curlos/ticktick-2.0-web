import { useCallback, useRef } from 'react';

/**
 * Custom hook that creates a debounced function that delays invoking the provided function
 * until after wait milliseconds have elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @param {Array} deps - Dependencies array for useCallback to control the memoization.
 * @returns {Function} A debounced version of the passed function.
 */
export const useDebouncedCallback = (func, delay, deps) => {
    const timeoutRef = useRef(null);

    const debouncedFunction = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            func(...args);
        }, delay);
    }, [delay, ...deps]);  // Ensure function updates if delay or deps change

    return debouncedFunction;
};