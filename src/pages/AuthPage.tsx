import React, { useState } from 'react';
import { Layers, Sparkles, Lock, Mail, User, ArrowRight, GraduationCap, Users, Microchip, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { useAuth, UserRole } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { setCurrentScreen, showToast } = useResearch();
  const { login, register, loginWithGoogle, completeProfile, needsRoleCompletion, isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // If already authenticated and profile is complete, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated && !needsRoleCompletion) {
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, needsRoleCompletion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      setIsSubmitting(true);
      const newUser = await register(name, email, password, selectedRole);
      setIsSubmitting(false);

      if (newUser) {
        showToast('Account Created Successfully', `Welcome to ResearchPilot, ${newUser.name}!`, 'success');
        setCurrentScreen('dashboard');
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } else {
      setIsSubmitting(true);
      const loggedUser = await login(email, password);
      setIsSubmitting(false);

      if (loggedUser) {
        showToast('Signed In Successfully', `Welcome back, ${loggedUser.name}!`, 'success');
        setCurrentScreen('dashboard');
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsSubmitting(true);
    
    // Simulate/Trigger Google OAuth flow
    const googleUser = await loginWithGoogle({
      email: email || 'alex.rivera@university.edu',
      name: name || 'Dr. Alex Rivera',
      googleId: `google-user-${Date.now()}`
    });
    setIsSubmitting(false);

    if (googleUser) {
      if (!googleUser.role) {
        showToast('Google Sign In Successful', 'Please complete your profile by selecting a role.', 'info');
      } else {
        showToast('Signed In with Google', `Welcome, ${googleUser.name}!`, 'success');
        setCurrentScreen('dashboard');
      }
    } else {
      setError('Google Authentication failed.');
    }
  };

  const handleCompleteRole = async (role: UserRole) => {
    setIsSubmitting(true);
    const success = await completeProfile(role);
    setIsSubmitting(false);

    if (success) {
      showToast('Profile Completed', `Role set to ${role}. Welcome to ResearchPilot!`, 'success');
      setCurrentScreen('dashboard');
    } else {
      setError('Failed to update role.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative z-10">
        {/* Header Branding */}
        <div className="p-8 text-center bg-gradient-to-b from-indigo-50/80 to-white border-b border-slate-100 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">ResearchPilot AI</h1>
          <p className="text-xs text-slate-500 font-medium">Autonomous Research Intelligence & Literature Intelligence Platform</p>
        </div>

        {/* Modal: Complete Profile for Google Users */}
        {needsRoleCompletion ? (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 2 of 2</span>
              <h2 className="text-lg font-bold text-slate-900">Complete Your Research Profile</h2>
              <p className="text-xs text-slate-500">Select your primary role to customize your research workspace</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'STUDENT' as UserRole, title: 'Student', icon: GraduationCap, desc: 'For students working on academic projects, assignments, and literature review.' },
                { id: 'STAFF' as UserRole, title: 'Staff / Faculty', icon: Users, desc: 'For faculty members managing research teams, students, and academic work.' },
                { id: 'RESEARCHER' as UserRole, title: 'Researcher', icon: Microchip, desc: 'For researchers managing multi-paper analysis, experiments, and agent workflows.' }
              ].map(card => {
                const Icon = card.icon;
                const selected = selectedRole === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedRole(card.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      selected ? 'bg-indigo-50/70 border-indigo-600 shadow-sm' : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{card.title}</h4>
                        {selected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleCompleteRole(selectedRole)}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-indigo-200" /> : <ArrowRight className="w-4 h-4" />}
              <span>Save Role & Continue to Dashboard</span>
            </button>
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-100 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-3 transition-all ${
                  mode === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 bg-slate-50'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-3 transition-all ${
                  mode === 'signup' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 bg-slate-50'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Alex Rivera"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Role Cards Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-slate-700">Select User Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'STUDENT' as UserRole, title: 'Student', icon: GraduationCap },
                        { id: 'STAFF' as UserRole, title: 'Staff', icon: Users },
                        { id: 'RESEARCHER' as UserRole, title: 'Researcher', icon: Microchip }
                      ].map(roleItem => {
                        const Icon = roleItem.icon;
                        const isSelected = selectedRole === roleItem.id;
                        return (
                          <div
                            key={roleItem.id}
                            onClick={() => setSelectedRole(roleItem.id)}
                            className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className="text-[11px] block">{roleItem.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic / Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@university.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-indigo-200" /> : <ArrowRight className="w-4 h-4" />}
                <span>{mode === 'login' ? 'Sign In to Workspace' : `Create ${selectedRole} Account`}</span>
              </button>

              {/* Social Google Auth Button */}
              <div className="relative pt-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white px-2">
                  <span>Or Continue With</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="pt-2 text-center text-xs">
                {mode === 'login' ? (
                  <p className="text-slate-500 font-medium">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); setError(null); }} className="font-bold text-indigo-600 hover:underline">
                      Create account
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-500 font-medium">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setMode('login'); setError(null); }} className="font-bold text-indigo-600 hover:underline">
                      Login
                    </button>
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
