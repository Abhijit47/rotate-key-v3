import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(isMobileViewport);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(isMobileViewport());
    };
    mql.addEventListener('change', onChange);
    setIsMobile(isMobileViewport());
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
