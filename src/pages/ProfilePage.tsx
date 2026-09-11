import React from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  Calendar, 
  FolderKanban, 
  FileText, 
  BookOpen, 
  Cpu, 
  FileCheck, 
  LogOut, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResearch } from '../context/ResearchContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    workspaces, 
    documents, 
    papers, 
    currentReport, 
    setCurrentScreen, 
    setIsCreateWorkspaceModalOpen 
  } = useResearch();

  const getRoleLabel = (role?: string | null) => {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'STAFF': return 'Staff / Faculty';
      case 'RESEARCHER': return 'Lead Researcher';
      default: return 'Researcher';
    }
  };

  const getRoleBadgeStyle = (role?: string | null) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'STAFF':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'RESEARCHER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'RP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return 'September 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'September 2026';
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'September 2026';
    }
  };

  const totalActivity = workspaces.length + documents.length + papers.length + (currentReport ? 1 : 0);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
            <span>ResearchPilot</span>
            <span>/</span>
            <span className="text-indigo-600">Account & Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Account Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your authenticated user identity, role attributes, and isolated research history.</p>
        </div>
        <button
          onClick={() => {
            logout();
            setCurrentScreen('login');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Main Account Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center relative overflow-hidden">
            <div className="w-full h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 absolute top-0 left-0 right-0" />
            <div className="relative pt-6">
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg mx-auto mb-4">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-inner">
                  {getInitials(user?.name)}
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{user?.name || 'Researcher'}</h2>
              <p className="text-xs text-slate-500 font-medium mb-3">{user?.email || 'user@example.com'}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className={getRoleBadgeStyle(user?.role)}>{getRoleLabel(user?.role)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-400 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Name
                </span>
                <span className="font-semibold text-slate-800">{user?.name}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-400 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                </span>
                <span className="font-semibold text-slate-800 truncate max-w-[160px]" title={user?.email}>{user?.email}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Role
                </span>
                <span className="font-bold text-slate-800">{getRoleLabel(user?.role)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member Since
                </span>
                <span className="font-semibold text-slate-800">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Database Account ID Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Database Account ID</span>
            </div>
            <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/60 font-mono text-xs text-indigo-200 select-all break-all">
              {user?.id || 'usr-not-assigned'}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              This is your unique database primary key used by PostgreSQL for strict user data isolation.
            </p>
          </div>
        </div>

        {/* Right Column: Research History & Security Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* My Research Activity Section */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>My Research Activity</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Live counts connected to your authenticated account.</p>
              </div>
              <button
                onClick={() => setIsCreateWorkspaceModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <span>+ Create Workspace</span>
              </button>
            </div>

            {totalActivity === 0 ? (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No research activity yet.</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You haven't created any workspaces or uploaded documents under this account yet. Start by creating a workspace!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => setCurrentScreen('workspace')}
                  className="bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{workspaces.length}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Research Workspaces</p>
                </div>

                <div 
                  onClick={() => setCurrentScreen('documents')}
                  className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{documents.length}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Documents / PDFs</p>
                </div>

                <div 
                  onClick={() => setCurrentScreen('discovery')}
                  className="bg-purple-50/60 hover:bg-purple-50 border border-purple-100 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="text-xs text-purple-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{papers.length}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Academic Papers</p>
                </div>

                <div 
                  onClick={() => setCurrentScreen('workflow')}
                  className="bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Cpu className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{currentReport ? 1 : 0}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Agent Pipeline Runs</p>
                </div>

                <div 
                  onClick={() => setCurrentScreen('report')}
                  className="bg-amber-50/60 hover:bg-amber-50 border border-amber-100 rounded-xl p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileCheck className="w-5 h-5 text-amber-600" />
                    <span className="text-xs text-amber-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{currentReport ? 1 : 0}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Research Reports</p>
                </div>
              </div>
            )}
          </div>

          {/* Security & Data Isolation Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Security & Data Isolation Architecture</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-1">🔐 JWT Token Authentication</span>
                <span className="text-slate-500 leading-relaxed">
                  Your session is authenticated via signed 7-day JWT tokens sent securely in HTTP Authorization Bearer headers.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-1">🛡️ Password Hashing</span>
                <span className="text-slate-500 leading-relaxed">
                  Passwords are encrypted using bcrypt salt hashing (10 rounds). Plaintext passwords are never stored.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-1">🗄️ PostgreSQL Multi-Tenancy</span>
                <span className="text-slate-500 leading-relaxed">
                  All research workspaces, documents, and reports are isolated by your database User ID.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-1">⚡ API Ownership Verification</span>
                <span className="text-slate-500 leading-relaxed">
                  The backend verifies JWT token identity for every request. Client-supplied user IDs are ignored.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
