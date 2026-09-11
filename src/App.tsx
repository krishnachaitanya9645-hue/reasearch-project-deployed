import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/layout/Toast';
import { CreateWorkspaceModal } from './components/modals/CreateWorkspaceModal';
import { AskAIModal } from './components/modals/AskAIModal';
import { Layers, Loader2 } from 'lucide-react';

import { Dashboard } from './pages/Dashboard';
import { WorkspaceView } from './pages/WorkspaceView';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { PaperAnalysisPage } from './pages/PaperAnalysisPage';
import { PaperComparisonPage } from './pages/PaperComparisonPage';
import { GapDetectionPage } from './pages/GapDetectionPage';
import { DirectionsPage } from './pages/DirectionsPage';
import { AgentWorkflowPage } from './pages/AgentWorkflowPage';
import { ExperimentPlannerPage } from './pages/ExperimentPlannerPage';
import { TasksPage } from './pages/TasksPage';
import { ReportPage } from './pages/ReportPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SettingsHelpPage } from './pages/SettingsHelpPage';
import { ProfilePage } from './pages/ProfilePage';

const MainContent: React.FC = () => {
  const { currentScreen } = useResearch();
  const { isAuthenticated, isLoading, needsRoleCompletion } = useAuth();

  // 1. Session Restoration Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-4 animate-bounce">
          <Layers className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Restoring ResearchPilot Session...</span>
        </div>
      </div>
    );
  }

  // 2. Full-bleed public landing page
  if (currentScreen === 'landing') return <LandingPage />;

  // 3. Login / Signup page or unauthenticated protection guard
  if (currentScreen === 'login' || !isAuthenticated || needsRoleCompletion) {
    return <AuthPage />;
  }

  // 4. Authenticated Protected App Shell
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50/60 pb-12">
          {currentScreen === 'dashboard' && <Dashboard />}
          {currentScreen === 'workspace' && <WorkspaceView />}
          {currentScreen === 'discovery' && <DiscoveryPage />}
          {currentScreen === 'documents' && <DocumentLibrary />}
          {currentScreen === 'analysis' && <PaperAnalysisPage />}
          {currentScreen === 'comparison' && <PaperComparisonPage />}
          {currentScreen === 'gaps' && <GapDetectionPage />}
          {currentScreen === 'directions' && <DirectionsPage />}
          {currentScreen === 'workflow' && <AgentWorkflowPage />}
          {currentScreen === 'experiments' && <ExperimentPlannerPage />}
          {currentScreen === 'tasks' && <TasksPage />}
          {currentScreen === 'report' && <ReportPage />}
          {currentScreen === 'profile' && <ProfilePage />}
          {(currentScreen === 'settings' || currentScreen === 'help') && <SettingsHelpPage />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CreateWorkspaceModal />
      <AskAIModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ResearchProvider>
        <MainContent />
      </ResearchProvider>
    </AuthProvider>
  );
}

export default App;
