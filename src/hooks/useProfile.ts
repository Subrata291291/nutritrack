import { useCallback } from 'react';
import { useAuth } from './useAuth';

let pendingProfilePromise: Promise<void> | null = null;

export function useProfile() {
  const { profile, nutritionTargets, refreshProfile, updateProfile } = useAuth();

  const ensureProfile = useCallback(async () => {
    if (profile) return;
    if (pendingProfilePromise) return pendingProfilePromise;
    pendingProfilePromise = refreshProfile().finally(() => {
      pendingProfilePromise = null;
    });
    return pendingProfilePromise;
  }, [profile, refreshProfile]);

  return { profile, nutritionTargets, ensureProfile, refreshProfile, updateProfile };
}
