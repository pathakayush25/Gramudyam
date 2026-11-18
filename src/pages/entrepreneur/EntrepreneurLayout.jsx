import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { EntrepreneurHeader } from '../../components/EntrepreneurHeader';

export const EntrepreneurLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sidebar-layout">
      {/* Fixed Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="sidebar-content">
        <EntrepreneurHeader onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 5rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};