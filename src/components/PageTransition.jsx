import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DinoLoader from './DinoLoader';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [prevKey, setPrevKey] = useState(location.key);

  useEffect(() => {
    if (location.key !== prevKey) {
      setLoading(true);
      const t = setTimeout(() => {
        setPrevKey(location.key);
        setLoading(false);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [location.key]);

  return (
    <>
      <DinoLoader isVisible={loading} />
      <div className="page-enter">{children}</div>
    </>
  );
};

export default PageTransition;
