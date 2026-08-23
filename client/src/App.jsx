import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChannelModal } from './components/ChannelModal';
import { VideoModal } from './components/VideoModal';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { LikedVideosPage } from './pages/LikedVideosPage';
import { LibraryPage } from './pages/LibraryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WatchPage } from './pages/WatchPage';
import { ChannelPage } from './pages/ChannelPage';

function AppContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { user, updateUserProfile } = useAuth();

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleOpenCreateModal = () => {
    if (!user) {
      alert('Please sign in first');
      return;
    }

    if (!user.channels || user.channels.length === 0) {
      setIsChannelModalOpen(true);
    } else {
      setIsVideoModalOpen(true);
    }
  };

  const handleChannelCreated = (newChannel) => {
    if (user) {
      const updatedChannels = [...(user.channels || []), newChannel];
      updateUserProfile({ channels: updatedChannels });
    }
  };

  const firstChannelId = user?.channels?.[0]?._id || user?.channels?.[0];

  return (
    <div className="app-container">
      <Header
        onToggleSidebar={handleToggleSidebar}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <div className="main-body">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className={`page-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/liked" element={<LikedVideosPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route
              path="/channel/:id"
              element={<ChannelPage onOpenCreateChannelModal={() => setIsChannelModalOpen(true)} />}
            />
          </Routes>
        </main>
      </div>

      <ChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onChannelCreated={handleChannelCreated}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onVideoSaved={() => {
          window.location.reload();
        }}
        channelId={firstChannelId}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
