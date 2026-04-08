import React from 'react';
import Header from './Header';
import AdminSidebar from './AdminSidebar';
import AIAssistantPanel from './AIAssistantPanel';

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-muted/30 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
        <AIAssistantPanel />
      </div>
    </div>
  );
};

export default AdminLayout;