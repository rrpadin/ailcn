import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, TrendingUp, BarChart3, Settings, FolderOpen, Award, Layout, Link as LinkIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const { currentAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalVisitors: 0,
    consultantApps: 0,
    orgDiagnostics: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pageViews, applications] = await Promise.all([
          pb.collection('analytics_events').getFullList({ 
            filter: 'event_type = "page_view"',
            $autoCancel: false 
          }),
          pb.collection('applications').getFullList({ $autoCancel: false })
        ]);

        const consultantApps = applications.filter(app => app.type === 'consultant').length;
        const orgDiagnostics = applications.filter(app => app.type === 'organization').length;
        const totalVisitors = new Set(pageViews.map(pv => pv.user_id || pv.id)).size;
        const conversionRate = totalVisitors > 0 ? ((applications.length / totalVisitors) * 100).toFixed(1) : 0;

        setStats({
          totalVisitors,
          consultantApps,
          orgDiagnostics,
          conversionRate
        });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const chartData = last7Days.map(date => {
          const dayViews = pageViews.filter(pv => pv.created.startsWith(date)).length;
          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            views: dayViews
          };
        });

        setChartData(chartData);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    { icon: Layout, label: 'CMS', path: '/admin/cms', description: 'Edit website content' },
    { icon: FileText, label: 'Applications', path: '/admin/applications', description: 'Review submissions' },
    { icon: Users, label: 'Users', path: '/admin/users', description: 'Manage users' },
    { icon: Award, label: 'Programs', path: '/admin/programs', description: 'Manage programs' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', description: 'View insights' },
    { icon: FolderOpen, label: 'Assets', path: '/admin/assets', description: 'Manage files' },
    { icon: LinkIcon, label: 'Navigation', path: '/admin/navigation-links', description: 'Manage links' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', description: 'System settings' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin dashboard - AILCN</title>
        <meta name="description" content="AILCN admin dashboard" />
      </Helmet>
      
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {currentAdmin?.name || 'Admin'}</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total visitors</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.totalVisitors}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Consultant applications</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.consultantApps}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organization diagnostics</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.orgDiagnostics}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion rate</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Page views (last 7 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/applications">
                <Button variant="outline" className="w-full justify-start transition-all duration-200">
                  <FileText className="w-4 h-4 mr-2" />
                  Review pending applications
                </Button>
              </Link>
              <Link to="/admin/cms">
                <Button variant="outline" className="w-full justify-start transition-all duration-200">
                  <Layout className="w-4 h-4 mr-2" />
                  Edit website content
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full justify-start transition-all duration-200">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View detailed analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6">
                      <item.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;