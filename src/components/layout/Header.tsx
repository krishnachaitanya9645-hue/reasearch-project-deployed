import React, { useState } from 'react';
import { Search, Plus, Sparkles, Bell, Cpu, ShieldCheck, User, FolderKanban, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen,
    activeWorkspace, 
    setIsCreateWorkspaceModalOpen, 
    setIsAskAIModalOpen,
    searchQuery,
    setSearchQuery,
    isAgentRunning,
    runAgentWorkflowSim
  } = useResearch();

  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getRoleBadge = (role?: string | null) => {
    switch (role) {
      case 'STUDENT':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/60">Student</span>;
      case 'STAFF':
        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200/60">Staff</span>;
      case 'RESEARCHER':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">Researcher</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">User</span>;
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

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard': return 'Dashboard Overview';
      case 'workspace': return `Workspace: ${activeWorkspace.name}`;
      case 'discovery': return 'Academic Paper Discovery';
      case 'documents': return 'Document & PDF Library';
      case 'analysis': return 'AI Paper Deep Analysis';
      case 'comparison': return 'Multi-Paper Methodology Comparison';
      case 'gaps': return 'Research Gap Detection Engine';
      case 'directions': return 'Autonomous Research Directions';
      case 'workflow': return 'Multi-Agent Autonomous Workflow Pipeline';
      case 'experiments': return 'Experiment Planner & Benchmarks';
      case 'tasks': return 'Research Task Board (Kanban)';
      case 'report': return 'Research Intelligence Executive Report';
      case 'landing': return 'Welcome to ResearchPilot';
      case 'login': return 'Account Portal';
      case 'settings': return 'Platform Settings';
      case 'help': return 'Help & Documentation';
      case 'profile': return 'User Profile & Account Intelligence';
      default: return 'ResearchPilot Workspace';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Left Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>ResearchPilot</span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold truncate max-w-[200px]">{activeWorkspace.name}</span>
            {user?.role && getRoleBadge(user.role)}
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">{getScreenTitle()}</h1>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search papers, gaps, tasks..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Right Quick Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Agent Workflow Status Pill */}
        <button
          onClick={runAgentWorkflowSim}
          disabled={isAgentRunning}
          className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isAgentRunning
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-agent-pulse'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <Cpu className={`w-3.5 h-3.5 ${isAgentRunning ? 'text-emerald-600 animate-spin' : 'text-emerald-500'}`} />
          <span>{isAgentRunning ? 'Agents Active...' : 'Run Agent Pipeline'}</span>
        </button>

        {/* Ask AI Action */}
        <button
          onClick={() => setIsAskAIModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Ask ResearchPilot</span>
        </button>

        {/* New Workspace */}
        <button
          onClick={() => setIsCreateWorkspaceModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Workspace</span>
        </button>

        {/* Notification Bell */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-indigo-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* User Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-[11px] shadow-xs">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline-block text-xs font-bold text-slate-800 max-w-[90px] truncate">{user?.name || 'Account'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsUserMenuOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1 divide-y divide-slate-100 text-xs">
                {/* Profile Card Summary */}
                <div className="px-4 py-3 bg-slate-50/50">
                  <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-slate-500 truncate text-[11px] mt-0.5">{user?.email}</p>
                  <div className="mt-2">
                    {getRoleBadge(user?.role)}
                  </div>
                </div>

                {/* Menu Options */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentScreen('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Account Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentScreen('documents');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-left"
                  >
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    <span>Research History</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentScreen('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      setCurrentScreen('login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
