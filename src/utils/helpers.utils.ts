export function millisecondsToHoursAndMinutes(milliseconds: number) {
    // Convert milliseconds to minutes
    const totalMinutes = milliseconds / (1000 * 60);

    // Calculate hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return {
        hours: hours,
        minutes: minutes
    };
}

/**
 * Transforms an array of objects into an object with keys based on a specified property.
 * @param {Object[]} array - The array of objects to transform.
 * @param {string} keyProperty - The property of the objects to use as keys in the resulting object.
 * @returns {Object} An object with keys derived from each object's specified property and values as the objects themselves.
 */
export function arrayToObjectByKey(array: any[], keyProperty: string) {
    return array.reduce((acc, obj) => {
        // Use the value of the specified property as the key
        const key = obj[keyProperty];
        // Assign the entire object as the value for this key
        acc[key] = obj;
        return acc;
    }, {});
}

export function areDatesEqual(date1: Date | null, date2: Date | null) {
    if (!date1 || !date2) {
        return false;
    }

    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export function debounce(func, wait, immediate = null) {
    var timeout;
    var cancelled = false; // flag to check if the debounce was cancelled

    var debounced = function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate && !cancelled) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };

    debounced.cancel = function () {
        clearTimeout(timeout);
        cancelled = true; // set the flag
    };

    return debounced;
}