import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function indexPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // This ensures the layout is fully mounted before attempting to navigate
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.push('/Login');
    }
  }, [isReady, router]);

  return null;  // Empty layout component since you're only doing routing
}


