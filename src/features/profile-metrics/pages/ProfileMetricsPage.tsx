import { useState, useEffect } from 'react';
import { PersonalMetrics } from '../components/PersonalMetrics';
import { ActivityLevelSelector } from '../components/ActivityLevelSelector';
import { HealthGoals } from '../components/HealthGoals';
import { Button } from '@components/ui/Button';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { userService } from '@services/user.service';
import type { UserProfile } from 'types/settings';
import type { ActivityLevel } from 'types/onboarding';

export function ProfileMetricsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await userService.getProfile();
        if (!cancelled) setProfile(data);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function updateField(field: keyof UserProfile, value: unknown) {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      await userService.updateProfile(profile);
      setSuccessMsg('Profile saved successfully!');
    } catch {
      setSuccessMsg('');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile…" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-0 z-10 bg-background border-b border-outline-variant/30 px-4">
        <div className="flex items-center justify-between h-16 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-primary text-xl">arrow_back</span>
            </button>
            <span className="text-lg font-semibold text-on-surface">Health Metrics</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold">
            {profile.displayName?.slice(0, 2).toUpperCase() ?? '?'}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-32 space-y-6">
        {successMsg && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium bg-primary-container/20 text-on-primary-container">
            {successMsg}
          </div>
        )}

        <PersonalMetrics
          age={profile.age}
          gender={profile.gender}
          heightCm={profile.heightCm}
          weightKg={profile.weightKg}
          onChange={(field, value) => updateField(field, value)}
        />
        <ActivityLevelSelector
          value={profile.activityLevel}
          onChange={(value: ActivityLevel) => updateField('activityLevel', value)}
        />
        <HealthGoals
          goal={profile.goal}
          targetWeightKg={profile.targetWeightKg}
          onChange={(field, value) => updateField(field, value)}
        />

        <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
          <span className="material-symbols-outlined text-tertiary-container text-xl mt-0.5">info</span>
          <p className="text-sm text-on-surface-variant">Updates to your metrics may recalculate your daily calorie and macro targets. Your current plan will be adjusted accordingly.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Button fullWidth size="lg" onClick={handleSave} loading={saving}>
            <span className="material-symbols-outlined text-xl">save</span>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
