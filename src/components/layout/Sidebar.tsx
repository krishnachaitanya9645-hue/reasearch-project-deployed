import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Search, 
  FileText, 
  Sparkles, 
  Compass, 
  Cpu, 
  FlaskConical, 
  CheckSquare, 
  FileCheck, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenView } from '../../types/research';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, workspaces, activeWorkspaceId, setActiveWorkspaceId, setIsCreateWorkspaceModalOpen } = useResearch();
  const { user, logout } = useAuth();

  const getRoleLabel = (role?: string | null) => {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'STAFF': return 'Staff / Faculty';
      case 'RESEARCHER': return 'Lead Researcher';
      default: return 'Researcher';
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

  const handleLogout = () => {
    logout();
    setCurrentScreen('login');
  };

  const navItems: { id: ScreenView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workspace', label: 'Research Workspaces', icon: <FolderKanban className="w-4 h-4" />, badge: `${workspaces.length}` },
    { id: 'discovery', label: 'Paper Discovery', icon: <Search className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents / PDFs', icon: <FileText className="w-4 h-4" /> },
    { id: 'gaps', label: 'Research Gaps', icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
    { id: 'directions', label: 'Research Directions', icon: <Compass className="w-4 h-4 text-indigo-500" /> },
    { id: 'workflow', label: 'Agent Workflow', icon: <Cpu className="w-4 h-4 text-emerald-500" />, badge: 'Live' },
    { id: 'experiments', label: 'Experiments', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'report', label: 'Reports', icon: <FileCheck className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none shadow-sm z-20">
      {/* Top Branding Header */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentScreen('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg">Research<span className="text-indigo-600">Pilot</span></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI Research Intelligence</p>
            </div>
          </div>
        </div>

        {/* Active Workspace Selector Dropdown */}
        <div className="px-3 py-3 border-b border-slate-100 bg-slate-50/50">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 block">Active Workspace</label>
          <div className="relative">
            <select
              value={activeWorkspaceId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setIsCreateWorkspaceModalOpen(true);
                } else {
                  setActiveWorkspaceId(e.target.value);
                  setCurrentScreen('workspace');
                }
              }}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-xs font-semibold text-slate-800 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate cursor-pointer hover:border-slate-300 transition-colors"
            >
              {workspaces.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
              <option value="new" className="text-indigo-600 font-semibold">+ Create New Workspace...</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">Navigation</p>
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    item.badge === 'Live'
                      ? 'bg-emerald-100 text-emerald-700 animate-pulse'
                      : isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings, Help, User Profile */}
      <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
        <button
          onClick={() => setCurrentScreen('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            currentScreen === 'settings' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
        
        <button
          onClick={() => setCurrentScreen('help')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            currentScreen === 'help' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Documentation</span>
        </button>

        {/* User Profile Card */}
        <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between px-2 py-1.5">
          <div 
            onClick={() => setCurrentScreen('profile')}
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {getInitials(user?.name)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Researcher'}</p>
              <p className="text-[10px] text-slate-400 truncate">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
