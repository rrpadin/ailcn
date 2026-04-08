import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, typeFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const records = await pb.collection('users').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setUsers(records);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(user => user.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getTypeBadge = (type) => {
    const variants = {
      visitor: 'secondary',
      consultant: 'default',
      organization: 'outline',
      admin: 'destructive'
    };
    return <Badge variant={variants[type] || 'secondary'}>{type}</Badge>;
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
        <title>Users - Admin - AILCN</title>
        <meta name="description" content="Manage users" />
      </Helmet>
      
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">User management</h1>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md text-foreground"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getTypeBadge(user.type)}</TableCell>
                      <TableCell>{user.role || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_activity ? new Date(user.last_activity).toLocaleDateString() : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl mt-8">
          <CardHeader>
            <CardTitle>Role permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>CMS</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Programs</TableHead>
                  <TableHead>Analytics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Super admin</TableCell>
                  <TableCell><Badge>Full access</Badge></TableCell>
                  <TableCell><Badge>Full access</Badge></TableCell>
                  <TableCell><Badge>Full access</Badge></TableCell>
                  <TableCell><Badge>Full access</Badge></TableCell>
                  <TableCell><Badge>Full access</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Admin</TableCell>
                  <TableCell><Badge>Edit</Badge></TableCell>
                  <TableCell><Badge>Edit</Badge></TableCell>
                  <TableCell><Badge variant="secondary">View only</Badge></TableCell>
                  <TableCell><Badge>Edit</Badge></TableCell>
                  <TableCell><Badge>View</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Editor</TableCell>
                  <TableCell><Badge>Edit</Badge></TableCell>
                  <TableCell><Badge variant="secondary">View only</Badge></TableCell>
                  <TableCell><Badge variant="outline">No access</Badge></TableCell>
                  <TableCell><Badge variant="secondary">View only</Badge></TableCell>
                  <TableCell><Badge variant="outline">No access</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminUsers;