'use client';
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext<{ loading: boolean; setLoading: (loading: boolean) => void }>({
  loading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);

//     const timeout = setTimeout(() => {
//       setLoading(false);
//     }, 30); // adjust this for transition duration

//     return () => clearTimeout(timeout);
//   }, [pathname]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);