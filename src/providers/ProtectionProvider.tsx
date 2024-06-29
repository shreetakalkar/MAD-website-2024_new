// ProtectedRoute.tsx
import React from 'react';
import { useUser } from './UserProvider';
import { useRouter } from 'next/navigation';

const ProtectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/'); // Adjust the path to your sign-in page
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectionProvider;
