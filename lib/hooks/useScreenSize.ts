import { useEffect, useState } from 'react'

export function useScreenSize() {
  const isServer = typeof window === 'undefined';
  const [isLarge, setIsLarge] = useState(isServer ? true : window.innerWidth >= 1024);

  useEffect(() => {
    if (isServer) return;
    const onResize = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isServer]);

  return isLarge;
}
