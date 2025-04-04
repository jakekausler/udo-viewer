import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHashOrTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Delay to ensure DOM is updated
    requestAnimationFrame(() => {
      const hash = location.hash;

      if (hash) {
        const id = decodeURIComponent(hash.substring(1));
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If ID not found, fallback to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }, [location.pathname, location.hash]);

  return null;
};

export default ScrollToHashOrTop;
