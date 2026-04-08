import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';

const AdminApplications = () => {
  const { currentAdmin } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter, searchTerm]);

  const fetchApplications = async () => {
    try {
      const records = await pb.collection('applications').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setApplications(records);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.organization_name && app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredApps(filtered);
  };

  const updateStatus = async (id, status) => {
    try {
      await pb.collection('applications').update(id, {
        status,
        reviewed_by: currentAdmin?.email || 'admin',
        reviewed_at: new Date().toISOString()
      }, { $autoCancel: false });
      
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status, reviewed_by: currentAdmin?.email } : app
      ));
      
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const exportToCSV = (type) => {
    const data = filteredApps.filter(app => app.type === type);
    const headers = type === 'consultant'
      ? ['Name', 'Email', 'Phone', 'Experience', 'Status', 'Date']
      : ['Name', 'Email', 'Phone', 'Organization', 'Industry', 'Status', 'Date'];
    
    const rows = data.map(app => type === 'consultant'
      ? [app.name, app.email, app.phone || '', app.experience_level || '', app.status, new Date(app.created).toLocaleDateString()]
      : [app.name, app.email, app.phone || '', app.organization_name || '', app.industry || '', app.status, new Date(app.created).toLocaleDateString()]
    );

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      waitlist: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const ApplicationTable = ({ type }) => {
    const typeApps = filteredApps.filter(app => app.type === type);

    if (typeApps.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No applications found</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {type === 'consultant' ? (
              <TableHead>Experience</TableHead>
            ) : (
              <>
                <TableHead>Organization</TableHead>
                <TableHead>Industry</TableHead>
              </>
            )}
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {typeApps.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">{app.name}</TableCell>
              <TableCell>{app.email}</TableCell>
              {type === 'consultant' ? (
                <TableCell>{app.experience_level || 'N/A'}</TableCell>
              ) : (
                <>
                  <TableCell>{app.organization_name || 'N/A'}</TableCell>
                  <TableCell>{app.industry || 'N/A'}</TableCell>
                </>
              )}
              <TableCell>{getStatusBadge(app.status)}</TableCell>
              <TableCell>{new Date(app.created).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(app.id, 'approved')}
                    disabled={app.status === 'approved'}
                    className="transition-all duration-200"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(app.id, 'rejected')}
                    disabled={app.status === 'rejected'}
                    className="transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(app.id, 'waitlist')}
                    disabled={app.status === 'waitlist'}
                    className="transition-all duration-200"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Applications - Admin - AILCN</title>
        <meta name="description" content="Manage applications" />
      </Helmet>
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Applications</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by name, email, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md text-foreground"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="waitlist">Waitlist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="consultant" className="space-y-6">
          <TabsList>
            <TabsTrigger value="consultant">
              Consultant applications ({applications.filter(a => a.type === 'consultant').length})
            </TabsTrigger>
            <TabsTrigger value="organization">
              Organization diagnostics ({applications.filter(a => a.type === 'organization').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consultant">
            <Card className="shadow-lg rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Consultant applications</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV('consultant')}
                  className="transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <ApplicationTable type="consultant" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization">
            <Card className="shadow-lg rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Organization diagnostics</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV('organization')}
                  className="transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <ApplicationTable type="organization" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminApplications;