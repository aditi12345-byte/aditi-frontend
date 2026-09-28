import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TransactionModal from '../components/TransactionModal';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenTransactionModal = (type = 'expense') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleTransactionSuccess = () => {
    // Increment refresh key to trigger active page reload
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          flex: 1,
          marginLeft: '260px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.3s ease'
        }}
        className="main-content-wrapper"
      >
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenTransactionModal={handleOpenTransactionModal}
        />

        <main style={{ flex: 1, padding: '28px' }}>
          <Outlet context={{ refreshKey, triggerRefresh: handleTransactionSuccess, openTransactionModal: handleOpenTransactionModal }} />
        </main>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        onSuccess={handleTransactionSuccess}
      />

      <style>{`
        @media (max-width: 860px) {
          .main-content-wrapper {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
