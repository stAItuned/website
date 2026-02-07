import { useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debouncedCallback = (...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    };

    return debouncedCallback;
}
