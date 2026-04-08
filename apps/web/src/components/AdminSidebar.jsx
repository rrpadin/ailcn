import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Users, Award, BarChart3, 
  Link as LinkIcon, Settings, FolderOpen, BookOpen, 
  BrainCircuit, Database, History 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: FileText, label: 'Pages (CMS)', path: '/admin/cms' },
    { icon: Award, label: 'Programs', path: '/admin/programs' },
    { icon: FileText, label: 'Applications', path: '/admin/applications' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FolderOpen, label: 'Assets', path: '/admin/assets' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: LinkIcon, label: 'Navigation', path: '/admin/navigation-links' },
  ];

  const aiNavItems = [
    { icon: Database, label: 'AI Knowledge', path: '/admin/ai-knowledge' },
    { icon: History, label: 'AI Generations', path: '/admin/ai-generations' },
    { icon: BrainCircuit, label: 'AI Settings', path: '/admin/ai-settings' },
  ];

  const systemNavItems = [
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const renderLinks = (items) => (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="w-64 bg-card border-r flex-shrink-0 hidden md:flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Admin Menu</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Content</h3>
          {renderLinks(navItems)}
        </div>
        
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">AI Assistant</h3>
          {renderLinks(aiNavItems)}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">System</h3>
          {renderLinks(systemNavItems)}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;