import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Users, MousePointerClick, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const [eventsData, appsData] = await Promise.all([
        pb.collection('analytics_events').getFullList({
          filter: `created >= "${startDate.toISOString()}"`,
          sort: '-created',
          $autoCancel: false
        }),
        pb.collection('applications').getFullList({
          filter: `created >= "${startDate.toISOString()}"`,
          $autoCancel: false
        })
      ]);

      setEvents(eventsData);
      setApplications(appsData);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const csv = [
      ['Date', 'Event Type', 'Page', 'User ID'],
      ...events.map(e => [
        new Date(e.created).toLocaleDateString(),
        e.event_type,
        e.page,
        e.user_id || 'anonymous'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pageViews = events.filter(e => e.event_type === 'page_view');
  const ctaClicks = events.filter(e => e.event_type === 'cta_click');
  const uniqueVisitors = new Set(pageViews.map(e => e.user_id || e.id)).size;
  const conversionRate = uniqueVisitors > 0 ? ((applications.length / uniqueVisitors) * 100).toFixed(1) : 0;

  const pageViewsByPage = pageViews.reduce((acc, e) => {
    acc[e.page] = (acc[e.page] || 0) + 1;
    return acc;
  }, {});

  const pageData = Object.entries(pageViewsByPage).map(([page, views]) => ({
    page: page.replace('_', ' '),
    views
  }));

  const funnelData = [
    { stage: 'Homepage visits', count: pageViews.filter(e => e.page === 'homepage').length },
    { stage: 'Landing page visits', count: pageViews.filter(e => e.page.includes('landing')).length },
    { stage: 'CTA clicks', count: ctaClicks.length },
    { stage: 'Applications', count: applications.length }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <>
      <Helmet>
        <title>Analytics - Admin - AILCN</title>
        <meta name="description" content="View analytics and insights" />
      </Helmet>
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData} className="transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total page views</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{pageViews.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unique visitors</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{uniqueVisitors}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">CTA clicks</CardTitle>
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{ctaClicks.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion rate</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Conversion funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Page views by page</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pageData}
                    dataKey="views"
                    nameKey="page"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Key insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Top performing page</p>
                <p className="text-sm text-muted-foreground">
                  {pageData.length > 0 ? pageData.sort((a, b) => b.views - a.views)[0].page : 'N/A'} with {pageData.length > 0 ? pageData.sort((a, b) => b.views - a.views)[0].views : 0} views
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Application breakdown</p>
                <p className="text-sm text-muted-foreground">
                  {applications.filter(a => a.type === 'consultant').length} consultant applications, {applications.filter(a => a.type === 'organization').length} organization diagnostics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Engagement rate</p>
                <p className="text-sm text-muted-foreground">
                  {uniqueVisitors > 0 ? ((ctaClicks.length / uniqueVisitors) * 100).toFixed(1) : 0}% of visitors clicked a CTA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminAnalytics;