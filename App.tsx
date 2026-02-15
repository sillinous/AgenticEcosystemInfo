import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ViewState } from './types';
import { Dashboard } from './components/Dashboard';
import { RailsVisualizer } from './components/RailsVisualizer';
import { CapabilityExplorer } from './components/CapabilityExplorer';
import { ChatInterface } from './components/ChatInterface';
import { FutureMetrics } from './components/FutureMetrics';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.RAILS:
        return <RailsVisualizer />;
      case ViewState.CAPABILITY:
        return <CapabilityExplorer />;
      case ViewState.FUTURE:
        return <FutureMetrics />;
      case ViewState.CHAT:
        return <ChatInterface />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;