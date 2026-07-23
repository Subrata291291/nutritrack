import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { userService } from '@services/user.service';
import { authService } from '@services/auth.service';
import { useTheme } from '@contexts/ThemeContext';
import type { UserProfile, UserSettings } from 'types/settings';

type ModalType = 'personalInfo' | 'password' | 'tdee' | 'macros' | 'help' | 'privacy' | 'about' | null;
type FeedbackType = { type: 'success' | 'error'; message: string } | null;

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={checked}
      className={cn(
        'relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30',
        checked ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-outline-variant'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300',
        checked ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  );
}

function SettingsRow({ icon, iconBg, label, description, rightContent, onClick }: {
  icon: string; iconBg: string; label: string; description?: string; rightContent?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={cn(
      'group relative flex items-center gap-4 px-xl py-4 transition-all',
      onClick
        ? 'cursor-pointer hover:pl-5 hover:bg-surface-container-low/50 active:bg-surface-container-low'
        : ''
    )}>
      {onClick && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary/0 group-hover:bg-primary/30 transition-all" />
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-black/[0.03] transition-transform group-hover:scale-105 ${iconBg}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-semibold text-on-surface">{label}</p>
        {description && <p className="text-label-sm text-on-surface-variant/70 truncate mt-0.5">{description}</p>}
      </div>
      {rightContent ?? (
        onClick ? (
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant/20 group-hover:text-on-surface-variant/50 group-hover:translate-x-0.5 transition-all">chevron_right</span>
        ) : null
      )}
    </div>
  );
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden backdrop-blur-sm", className)}>
      <div className="px-xl pt-xl pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-primary/40" />
          <h3 className="text-label-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant/60">{title}</h3>
        </div>
      </div>
      <div className="divide-y divide-outline-variant/20">{children}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between px-xl pt-xl pb-lg border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <h2 className="text-headline-md font-bold text-on-surface">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-surface-container-low active:bg-surface-container transition-all flex items-center justify-center group">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant/50 group-hover:text-on-surface-variant transition-colors">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-xl pb-xl space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
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
      <div className="mx-auto px-2 pt-6 space-y-5">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" text="Loading settings..." />
          </div>
        )}

        {!loading && (
          <>
            {/* Feedback toast */}
            {feedback && (
              <div className={cn(
                'px-xl py-3 rounded-xl text-label-sm font-semibold flex items-center gap-2.5 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200',
                feedback.type === 'success'
                  ? 'bg-emerald-500/8 text-emerald-600 border border-emerald-500/15'
                  : 'bg-error/8 text-error border border-error/15'
              )}>
                <span className={cn(
                  'material-symbols-outlined text-[18px]',
                  feedback.type === 'success' ? 'text-emerald-500' : 'text-error'
                )}>{feedback.type === 'success' ? 'check_circle' : 'error'}</span>
                {feedback.message}
              </div>
            )}

            {/* Profile hero */}
            <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="relative h-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-container-lowest to-transparent" />
              </div>
              <div className="relative px-xl pb-xl -mt-14">
                <div className="flex items-end gap-5">
                  <div className="relative group flex-shrink-0">
                    <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden ring-[3px] ring-surface-container-lowest shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                      {profile?.avatar ? (
                        <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark/80 flex items-center justify-center">
                          <span className="text-on-primary text-[30px] font-bold tracking-tight">{initials}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                  <div className="flex-1 min-w-0 pt-10">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-headline-md font-bold text-on-surface">{profile?.displayName ?? 'User'}</h2>
                      <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border',
                        storedAuth?.user?.membership === 'pro'
                          ? 'bg-amber-500/8 text-amber-600 border-amber-500/15'
                          : 'bg-surface-container-low text-on-surface-variant/60 border-outline-variant/40'
                      )}>
                        <span className="flex items-center gap-1">
                          {storedAuth?.user?.membership === 'pro' && <span className="material-symbols-outlined text-[11px]">workspace_premium</span>}
                          {membershipLabel}
                        </span>
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant/60 mt-0.5">{storedAuth?.user?.email ?? ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account */}
            <SectionCard title="Account">
              <SettingsRow icon="person" iconBg="bg-primary/8 text-primary" label="Personal Info" description="Name, email, avatar"
                onClick={() => { setEditName(profile?.displayName || ''); setEditEmailDraft(editEmail); setModal('personalInfo'); }} />
              <SettingsRow icon="lock" iconBg="bg-violet-500/8 text-violet-500" label="Password & Security" description="Change your password"
                onClick={() => { setEditPassword(''); setEditPasswordConfirm(''); setModal('password'); }} />
            </SectionCard>

            {/* Preferences */}
            <SectionCard title="Preferences">
              <SettingsRow icon="notifications_active" iconBg="bg-amber-500/8 text-amber-500" label="Notifications" description="Push alerts for reminders and updates"
                rightContent={<ToggleSwitch checked={settings?.notifications ?? false} onChange={toggleNotifications} />} />
              <SettingsRow icon="straighten" iconBg="bg-emerald-500/8 text-emerald-500" label="Units" description={settings?.units === 'imperial' ? 'Imperial (lbs, ft)' : 'Metric (kg, cm)'}
                rightContent={
                  <select value={settings?.units ?? 'metric'} onChange={(e) => handleSaveSettings({ units: e.target.value as 'metric' | 'imperial' })}
                    className="text-label-sm font-semibold text-on-surface bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors hover:border-outline-variant/60"
                  >
                    <option value="metric">Metric</option>
                    <option value="imperial">Imperial</option>
                  </select>
                } />
              <SettingsRow icon="light_mode" iconBg="bg-amber-400/8 text-amber-400" label="Theme" description={settings?.theme === 'dark' ? 'Dark mode' : settings?.theme === 'system' ? 'System default' : 'Light mode'}
                rightContent={
                  <select value={settings?.theme ?? 'light'} onChange={(e) => {
                    const val = e.target.value as 'light' | 'dark' | 'system';
                    handleSaveSettings({ theme: val });
                    if (val === 'system') {
                      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                    } else {
                      setTheme(val);
                    }
                  }}
                    className="text-label-sm font-semibold text-on-surface bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors hover:border-outline-variant/60"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                } />
            </SectionCard>

            {/* Health & Goals */}
            <SectionCard title="Health & Goals">
              <SettingsRow icon="monitor_heart" iconBg="bg-rose-500/8 text-rose-500" label="TDEE Settings" description="Calorie and activity configuration"
                onClick={() => setModal('tdee')} />
              <SettingsRow icon="track_changes" iconBg="bg-emerald-500/8 text-emerald-500" label="Goal Type"
                description={profile?.goal === 'lose-weight' ? 'Lose Weight' : profile?.goal === 'gain-muscle' ? 'Gain Muscle' : 'Maintain Weight'} />
              <SettingsRow icon="pie_chart" iconBg="bg-violet-500/8 text-violet-500" label="Macro Targets" description="Protein, carbs, fats distribution"
                onClick={() => setModal('macros')} />
            </SectionCard>

            {/* Subscription */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-xl pt-xl pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-amber-400/40" />
                  <h3 className="text-label-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant/60">Subscription</h3>
                </div>
              </div>
              <div className="divide-y divide-outline-variant/20">
                <div onClick={() => navigate('/pricing')}
                  className="group relative flex items-center gap-4 px-xl py-4 cursor-pointer hover:pl-5 hover:bg-surface-container-low/50 active:bg-surface-container-low transition-all"
                >
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-amber-400/0 group-hover:bg-amber-400/30 transition-all" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/15 to-amber-400/5 flex items-center justify-center flex-shrink-0 ring-1 ring-black/[0.03] transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-bold text-on-surface">{storedAuth?.user?.membership === 'pro' ? 'Manage Pro Subscription' : 'Upgrade to NutriTrack Pro'}</p>
                    <p className="text-label-sm text-on-surface-variant/70 mt-0.5">Unlock AI insights, meal planning, and more</p>
                  </div>
                  <span className={cn(
                    'px-3 py-1.5 rounded-lg text-label-sm font-bold border',
                    storedAuth?.user?.membership === 'pro'
                      ? 'bg-amber-500/8 text-amber-600 border-amber-500/15'
                      : 'bg-surface-container-low text-on-surface-variant/60 border-outline-variant/30'
                  )}>
                    {storedAuth?.user?.membership === 'pro' ? 'Active' : 'Free'}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant/20 group-hover:text-on-surface-variant/50 group-hover:translate-x-0.5 transition-all">chevron_right</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <SectionCard title="Support & Legal">
              <SettingsRow icon="help" iconBg="bg-sky-500/8 text-sky-500" label="Help Center" description="Guides, FAQ, and support"
                onClick={() => setModal('help')} />
              <SettingsRow icon="policy" iconBg="bg-surface-container-high/50 text-on-surface-variant/80" label="Privacy Policy"
                onClick={() => setModal('privacy')} />
              <SettingsRow icon="info" iconBg="bg-surface-container-high/50 text-on-surface-variant/80" label="About" description="Version 2.4.0"
                onClick={() => setModal('about')} />
            </SectionCard>

            {/* Logout */}
            <div className="flex justify-center pt-2 pb-8">
              <button onClick={handleLogout}
                className="group relative flex items-center gap-2.5 px-7 py-3 rounded-xl border border-error/10 text-error/70 text-label-sm font-semibold tracking-wide hover:bg-error/[0.04] hover:border-error/20 hover:text-error active:scale-[0.97] transition-all"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">logout</span>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Personal Info Modal */}
      <Modal open={modal === 'personalInfo'} onClose={() => setModal(null)} title="Personal Info">
        <div className="space-y-4 pt-2">
          <Input label="Display Name" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
          <Input label="Email" type="email" value={editEmailDraft} onChange={(e) => setEditEmailDraft(e.target.value)} placeholder="your@email.com" />
          <Button fullWidth onClick={handleSavePersonalInfo} loading={saving}>Save Changes</Button>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal open={modal === 'password'} onClose={() => setModal(null)} title="Change Password">
        <div className="space-y-4 pt-2">
          <Input label="New Password" type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Min. 6 characters" />
          <Input label="Confirm New Password" type="password" value={editPasswordConfirm} onChange={(e) => setEditPasswordConfirm(e.target.value)} placeholder="Re-enter new password" />
          <Button fullWidth onClick={handleChangePassword} loading={saving}>Update Password</Button>
        </div>
      </Modal>

      {/* TDEE Modal */}
      <Modal open={modal === 'tdee'} onClose={() => setModal(null)} title="TDEE Settings">
        <div className="space-y-4 pt-2">
          {profile ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Age', value: profile.age ? `${profile.age}` : '—', icon: 'cake' },
                  { label: 'Gender', value: profile.gender?.replace('-', ' ') || '—', icon: 'wc' },
                  { label: 'Height', value: profile.heightCm ? `${profile.heightCm} cm` : '—', icon: 'straighten' },
                  { label: 'Weight', value: profile.weightKg ? `${profile.weightKg} kg` : '—', icon: 'monitor_weight' },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-container-low rounded-xl p-4 text-center ring-1 ring-black/[0.02]">
                    <span className="material-symbols-outlined text-[20px] text-primary/50 mb-1.5">{s.icon}</span>
                    <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-[0.1em]">{s.label}</p>
                    <p className="text-headline-sm font-bold text-on-surface mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-surface-container-low rounded-xl p-4 ring-1 ring-black/[0.02]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-primary/50">directions_run</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-[0.1em]">Activity</p>
                      <p className="text-body-sm font-semibold text-on-surface capitalize mt-0.5">{profile.activityLevel?.replace('-', ' ') || '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-[0.1em]">Goal</p>
                    <p className="text-body-sm font-semibold text-on-surface capitalize mt-0.5">{profile.goal?.replace('-', ' ') || '—'}</p>
                  </div>
                </div>
              </div>
              <p className="text-label-sm text-on-surface-variant/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Visit Profile Metrics to update your health data
              </p>
              <Button fullWidth variant="secondary" onClick={() => navigate('/profile')}>Edit in Profile Metrics</Button>
            </>
          ) : (
            <p className="text-body-sm text-on-surface-variant/60">No profile data available.</p>
          )}
        </div>
      </Modal>

      {/* Macros Modal */}
      <Modal open={modal === 'macros'} onClose={() => setModal(null)} title="Macro Targets">
        <div className="space-y-4 pt-2">
          <p className="text-body-sm text-on-surface-variant/70">Your daily macronutrient targets are calculated based on your TDEE and goals.</p>
          {profile?.targetWeightKg && (
            <div className="bg-surface-container-low rounded-xl p-5 text-center ring-1 ring-black/[0.02]">
              <span className="material-symbols-outlined text-[24px] text-primary/50 mb-1">track_changes</span>
              <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-[0.1em]">Target Weight</p>
              <p className="text-headline-lg font-bold text-on-surface mt-1">{profile.targetWeightKg} <span className="text-body-md font-normal text-on-surface-variant/60">kg</span></p>
            </div>
          )}
          <Button fullWidth variant="secondary" onClick={() => navigate('/profile')}>Edit in Profile Metrics</Button>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal open={modal === 'help'} onClose={() => setModal(null)} title="Help Center">
        <div className="space-y-3 pt-2">
          {[
            { icon: 'menu_book', title: 'Getting Started Guide', desc: 'Learn the basics of tracking your nutrition', bg: 'bg-sky-500/8 text-sky-500' },
            { icon: 'help', title: 'FAQ', desc: 'Frequently asked questions', bg: 'bg-violet-500/8 text-violet-500' },
            { icon: 'mail', title: 'Contact Support', desc: 'Reach out to our team', bg: 'bg-rose-500/8 text-rose-500' },
          ].map((item) => (
            <div key={item.title} className="group flex items-center gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-lowest transition-all cursor-pointer border border-transparent hover:border-outline-variant/30 hover:shadow-sm ring-1 ring-black/[0.02]">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg} transition-transform group-hover:scale-105`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <div>
                <p className="text-body-md font-semibold text-on-surface">{item.title}</p>
                <p className="text-label-sm text-on-surface-variant/70 mt-0.5">{item.desc}</p>
              </div>
              <span className="ml-auto material-symbols-outlined text-[18px] text-on-surface-variant/20 group-hover:text-on-surface-variant/50 transition-all">chevron_right</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal open={modal === 'privacy'} onClose={() => setModal(null)} title="Privacy Policy">
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low ring-1 ring-black/[0.02]">
            <span className="material-symbols-outlined text-[24px] text-primary/50 mt-0.5">security</span>
            <p className="text-body-sm text-on-surface/80 leading-relaxed">
              NutriTrack collects and processes your health data solely for the purpose of providing personalized nutrition tracking and insights. Your data is encrypted in transit and at rest. We never share your personal health information with third parties without your explicit consent.
            </p>
          </div>
          <p className="text-label-sm text-on-surface-variant/60 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            Last updated: January 2026
          </p>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal open={modal === 'about'} onClose={() => setModal(null)} title="About">
        <div className="space-y-5 text-center pt-2">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark/80 flex items-center justify-center mx-auto shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <span className="material-symbols-outlined text-on-primary text-[36px]">fitness_center</span>
          </div>
          <div>
            <p className="text-headline-md font-bold text-on-surface">NutriTrack</p>
            <p className="text-body-sm text-on-surface-variant/60 mt-1">Version 2.4.0 (Build 1084)</p>
          </div>
          <p className="text-body-sm text-on-surface-variant/70 max-w-sm mx-auto">
            AI-powered nutrition tracking and meal planning application.
          </p>
          <div className="bg-surface-container-low rounded-xl p-5 text-left ring-1 ring-black/[0.02]">
            <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-[0.1em] mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'WordPress', 'PHP'].map((t) => (
                <span key={t} className="px-3 py-1.5 bg-surface-container-highest/50 rounded-lg text-label-sm font-medium text-on-surface-variant/70 ring-1 ring-black/[0.03]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
