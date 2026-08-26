import { useEffect, useState } from 'react';
import {
  clearInfinitySession,
  InfinitySession,
  loadInfinitySession,
  saveInfinitySession,
  signInToInfinity,
} from '../lib/infinityAuth';

export function useInfinityAuth() {
  const [session, setSession] = useState<InfinitySession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void loadInfinitySession().then(stored => {
      setSession(stored);
      setIsChecking(false);
    });
  }, []);

  const signIn = async () => {
    const next = await signInToInfinity();
    if (next) {
      await saveInfinitySession(next);
      setSession(next);
    }
    return next;
  };

  const signOut = async () => {
    await clearInfinitySession();
    setSession(null);
  };

  return { session, isChecking, signIn, signOut };
}