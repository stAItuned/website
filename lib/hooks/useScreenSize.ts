import { useEffect, useState } from 'react'

export function useScreenSize() {
  const [isLarge, setIsLarge] = useState(true); // Default to true for SSR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    // Set initial value
    setIsLarge(window.innerWidth >= 1024);
    
    const onResize = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // During SSR and first render, return true to match server
  // After hydration, return actual screen size
  return isClient ? isLarge : true;
}
