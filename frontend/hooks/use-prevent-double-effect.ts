import { useEffect, useRef } from 'react';

/**
 * Custom hook to prevent useEffect from running twice in React StrictMode
 * This is particularly useful for API calls that should only happen once
 */
export function usePreventDoubleEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList,
  key?: string
) {
  const hasRunRef = useRef(false);
  const keyRef = useRef(key);
  
  // Reset the flag if the key changes
  if (keyRef.current !== key) {
    hasRunRef.current = false;
    keyRef.current = key;
  }
  
  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }
    
    hasRunRef.current = true;
    const cleanup = effect();
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, deps);
}