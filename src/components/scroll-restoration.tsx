import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top when route changes, regardless of browser history
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' for immediate scroll without animation
      });
    };

    // Small delay to ensure the route has fully changed
    const timeoutId = setTimeout(scrollToTop, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // Also handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Force scroll to top even on browser navigation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 0);
    };

    // Override browser's scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Force scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}