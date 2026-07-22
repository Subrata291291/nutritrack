import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { userService } from '@services/user.service';
import { authService } from '@services/auth.service';
import type { UserProfile, UserSettings } from 'types/settings';

type ModalType = 'personalInfo' | 'password' | 'tdee' | 'macros' | 'help' | 'privacy' | 'about' | null;

interface SettingsItemProps {
  icon: string;
  label: string;
  rightContent?: React.ReactNode;
  onClick?: () => void;
}

function SettingsItem({ icon, label, rightContent, onClick }: SettingsItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-4 px-5 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
        <span className="text-sm font-medium text-on-surface">{label}</span>
      </div>
      {rightContent ?? (
        <span className="material-symbols-outlined text-secondary text-xl">chevron_right</span>
      )}
    </div>
  );
}

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function SettingsGroup({ title, children, className }: SettingsGroupProps) {
  return (
    <div className={cn("bg-surface-container-lowest rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden", className)}>
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">{title}</h3>
      </div>
      <div className="divide-y divide-surface-container">{children}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-outline-variant/40">
          <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

type FeedbackType = { type: 'success' | 'error'; message: string } | null;

export function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storedAuth = authService.getStoredAuth();

  const [editName, setEditName] = useState('');
  const editEmail = storedAuth?.user?.email ?? '';
  const [editEmailDraft, setEditEmailDraft] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPasswordConfirm, setEditPasswordConfirm] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!cancelled) setLoading(true);
        const [prof, sett] = await Promise.all([
          userService.getProfile(),
          userService.getSettings(),
        ]);
        if (!cancelled) {
          setProfile(prof);
          setSettings(sett);
          setEditName(prof.displayName || '');
        }
      } catch {
        if (!cancelled) setFeedback({ type: 'error', message: 'Failed to load settings.' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSaveSettings(patch: Partial<UserSettings>) {
    if (!settings) return;
    setFeedback(null);
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      await userService.updateSettings(next);
      setFeedback({ type: 'success', message: 'Settings saved.' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save settings.' });
    }
  }

  function toggleNotifications() {
    if (!settings) return;
    handleSaveSettings({ notifications: !settings.notifications });
  }

  function handleLogout() {
    authService.logout();
  }

  async function handleSavePersonalInfo() {
    if (!profile) return;
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await userService.updateProfile({ displayName: editName });
      setProfile({ ...profile, ...updated, displayName: editName });
      setFeedback({ type: 'success', message: 'Profile updated.' });
      setModal(null);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (editPassword !== editPasswordConfirm) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (editPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      await userService.changePassword(editPassword);
      setFeedback({ type: 'success', message: 'Password changed.' });
      setEditPassword('');
      setEditPasswordConfirm('');
      setModal(null);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setFeedback(null);
    try {
      const url = await userService.uploadAvatar(file);
      if (url) {
        await userService.updateProfile({ avatar: url });
        if (profile) setProfile({ ...profile, avatar: url });
        setFeedback({ type: 'success', message: 'Avatar updated.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to upload avatar.' });
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const initials = profile?.displayName
    ? profile.displayName.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const membershipLabel = storedAuth?.user?.membership === 'pro' ? 'Premium User' : storedAuth?.user?.membership === 'team' ? 'Team User' : 'Free User';

  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="sticky top-0 z-10 bg-background border-b border-outline-variant/30 px-4">
        <div className="flex items-center justify-between h-16 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold">{initials}</div>
            <span className="text-lg font-semibold text-on-surface">NutriTrack</span>
          </div>
          <button className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-primary text-xl">notifications</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <h1 className="text-[32px] font-bold text-on-surface">Settings</h1>
        {loading && <LoadingSpinner size="lg" text="Loading settings..." />}
        {!loading && feedback && (
          <div className={cn(
            'px-4 py-3 rounded-xl text-sm font-medium',
            feedback.type === 'success' ? 'bg-primary-container/20 text-on-primary-container' : 'bg-error-container/20 text-on-error-container'
          )}>
            {feedback.message}
          </div>
        )}

        <div className="flex flex-col items-center py-6">
          <div className="relative mb-3 group">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary text-3xl font-bold">{initials}</div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">photo_camera</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <h2 className="text-xl font-bold text-on-surface">{profile?.displayName ?? 'User'}</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">{storedAuth?.user?.email ?? ''}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container/10 text-on-primary-container text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">workspace_premium</span>
            {membershipLabel}
          </span>
        </div>

        <SettingsGroup title="Account">
          <SettingsItem icon="person" label="Personal Info" onClick={() => { setEditName(profile?.displayName || ''); setEditEmailDraft(editEmail); setModal('personalInfo'); }} />
          <SettingsItem icon="lock" label="Password & Security" onClick={() => { setEditPassword(''); setEditPasswordConfirm(''); setModal('password'); }} />
        </SettingsGroup>

        <SettingsGroup title="App Preferences">
          <SettingsItem icon="notifications_active" label="Notifications" rightContent={
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className={cn(
                  'w-10 h-6 rounded-full relative cursor-pointer transition-colors',
                  settings?.notifications ? 'bg-primary' : 'bg-outline'
                )}
              >
                <div className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all',
                  settings?.notifications ? 'right-0.5' : 'left-0.5'
                )} />
              </button>
            </div>
          } />
          <SettingsItem icon="straighten" label="Units" rightContent={
            <div className="flex items-center gap-2">
              <select
                value={settings?.units ?? 'metric'}
                onChange={(e) => handleSaveSettings({ units: e.target.value as 'metric' | 'imperial' })}
                className="text-sm text-on-surface-variant bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>
            </div>
          } />
          <SettingsItem icon="light_mode" label="Theme" rightContent={
            <div className="flex items-center gap-2">
              <select
                value={settings?.theme ?? 'light'}
                onChange={(e) => handleSaveSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                className="text-sm text-on-surface-variant bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          } />
        </SettingsGroup>

        <SettingsGroup title="Health & Goals">
          <SettingsItem icon="monitor_heart" label="TDEE Settings" onClick={() => setModal('tdee')} />
          <SettingsItem icon="track_changes" label="Goal Type" rightContent={
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface-variant">
                {profile?.goal === 'lose-weight' ? 'Lose Weight' : profile?.goal === 'gain-muscle' ? 'Gain Muscle' : 'Maintain Weight'}
              </span>
              <span className="material-symbols-outlined text-secondary text-xl">chevron_right</span>
            </div>
          } />
          <SettingsItem icon="pie_chart" label="Macros" onClick={() => setModal('macros')} />
        </SettingsGroup>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <h3 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">Subscription</h3>
          </div>
          <div className="divide-y divide-surface-container">
            <div
              onClick={() => navigate('/pricing')}
              className="flex items-center justify-between py-4 px-5 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors bg-primary-container/5"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-2xl">stars</span>
                <span className="text-sm font-semibold text-primary">Manage NutriTrack Pro</span>
              </div>
              <span className="material-symbols-outlined text-secondary text-xl">chevron_right</span>
            </div>
          </div>
        </div>

        <SettingsGroup title="Support & Legal">
          <SettingsItem icon="help" label="Help Center" onClick={() => setModal('help')} />
          <SettingsItem icon="policy" label="Privacy Policy" onClick={() => setModal('privacy')} />
          <SettingsItem icon="info" label="About" onClick={() => setModal('about')} />
        </SettingsGroup>

        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            className="border border-error text-error hover:bg-error-container gap-2 px-6"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Logout
          </Button>
        </div>

        <p className="text-center text-xs text-secondary pb-6">Version 2.4.0 (Build 1084)</p>
      </div>

      {/* Personal Info Modal */}
      <Modal open={modal === 'personalInfo'} onClose={() => setModal(null)} title="Personal Info">
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Email"
            type="email"
            value={editEmailDraft}
            onChange={(e) => setEditEmailDraft(e.target.value)}
            placeholder="your@email.com"
          />
          <div className="pt-2">
            <Button fullWidth onClick={handleSavePersonalInfo} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal open={modal === 'password'} onClose={() => setModal(null)} title="Change Password">
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder="Min. 6 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={editPasswordConfirm}
            onChange={(e) => setEditPasswordConfirm(e.target.value)}
            placeholder="Re-enter new password"
          />
          <div className="pt-2">
            <Button fullWidth onClick={handleChangePassword} loading={saving}>
              Update Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* TDEE Modal */}
      <Modal open={modal === 'tdee'} onClose={() => setModal(null)} title="TDEE Settings">
        <div className="space-y-4">
          {profile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Age</p>
                  <p className="text-xl font-bold text-on-surface mt-1">{profile.age || '-'}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Gender</p>
                  <p className="text-xl font-bold text-on-surface mt-1 capitalize">{profile.gender?.replace('-', ' ') || '-'}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Height</p>
                  <p className="text-xl font-bold text-on-surface mt-1">{profile.heightCm ? `${profile.heightCm} cm` : '-'}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Weight</p>
                  <p className="text-xl font-bold text-on-surface mt-1">{profile.weightKg ? `${profile.weightKg} kg` : '-'}</p>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Activity Level</p>
                    <p className="text-sm font-semibold text-on-surface mt-1 capitalize">{profile.activityLevel?.replace('-', ' ') || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Goal</p>
                    <p className="text-sm font-semibold text-on-surface mt-1 capitalize">{profile.goal?.replace('-', ' ') || '-'}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant">Visit Profile Metrics to update your health data and recalculate TDEE.</p>
              <Button fullWidth variant="secondary" onClick={() => navigate('/profile')}>
                Edit in Profile Metrics
              </Button>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant">No profile data available.</p>
          )}
        </div>
      </Modal>

      {/* Macros Modal */}
      <Modal open={modal === 'macros'} onClose={() => setModal(null)} title="Macro Targets">
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Your daily macronutrient targets are calculated based on your TDEE and goals. Visit Profile Metrics to update.</p>
          <div className="bg-surface-container-low rounded-xl p-4 text-center">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Target Weight</p>
            <p className="text-xl font-bold text-on-surface mt-1">{profile?.targetWeightKg ? `${profile.targetWeightKg} kg` : 'Not set'}</p>
          </div>
          <Button fullWidth variant="secondary" onClick={() => navigate('/profile')}>
            Edit in Profile Metrics
          </Button>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal open={modal === 'help'} onClose={() => setModal(null)} title="Help Center">
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Need help with NutriTrack? Here are some resources:</p>
          <div className="space-y-2">
            <div className="bg-surface-container-low rounded-xl p-4 hover:bg-surface-container transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-on-surface">Getting Started Guide</p>
              <p className="text-xs text-on-surface-variant mt-1">Learn the basics of tracking your nutrition</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 hover:bg-surface-container transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-on-surface">FAQ</p>
              <p className="text-xs text-on-surface-variant mt-1">Frequently asked questions</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 hover:bg-surface-container transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-on-surface">Contact Support</p>
              <p className="text-xs text-on-surface-variant mt-1">Reach out to our team</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal open={modal === 'privacy'} onClose={() => setModal(null)} title="Privacy Policy">
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Your data privacy is important to us.</p>
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-sm text-on-surface">
              NutriTrack collects and processes your health data solely for the purpose of providing personalized nutrition tracking and insights. Your data is encrypted in transit and at rest. We never share your personal health information with third parties without your explicit consent.
            </p>
          </div>
          <p className="text-xs text-on-surface-variant">Last updated: January 2026</p>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal open={modal === 'about'} onClose={() => setModal(null)} title="About">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-on-primary text-3xl">fitness_center</span>
          </div>
          <div>
            <p className="text-lg font-bold text-on-surface">NutriTrack</p>
            <p className="text-sm text-on-surface-variant">Version 2.4.0</p>
          </div>
          <p className="text-sm text-on-surface-variant">
            AI-powered nutrition tracking and meal planning application. Built with React, TypeScript, and WordPress.
          </p>
          <div className="bg-surface-container-low rounded-xl p-4 text-left">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Tech Stack</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'WordPress', 'PHP'].map((t) => (
                <span key={t} className="px-2 py-1 bg-surface-container-highest rounded text-xs font-medium text-on-surface-variant">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}