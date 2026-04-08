import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminNavigationLinks = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    link_type: 'internal',
    category: 'header_menu',
    open_in_new_tab: false,
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const records = await pb.collection('navigation_links').getFullList({
        sort: 'sort_order,category,name',
        $autoCancel: false
      });
      setLinks(records);
    } catch (error) {
      toast.error('Failed to load navigation links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (link = null) => {
    if (link) {
      setEditingId(link.id);
      setFormData({
        name: link.name,
        url: link.url,
        link_type: link.link_type,
        category: link.category,
        open_in_new_tab: link.open_in_new_tab,
        is_active: link.is_active,
        sort_order: link.sort_order ?? 0
      });
    } else {
      setEditingId(null);
      const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.sort_order ?? 0)) + 1 : 0;
      setFormData({
        name: '',
        url: '',
        link_type: 'internal',
        category: 'header_menu',
        open_in_new_tab: false,
        is_active: true,
        sort_order: maxOrder
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.url) {
      toast.error('Name and URL are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await pb.collection('navigation_links').update(editingId, formData, { $autoCancel: false });
        toast.success('Link updated successfully');
      } else {
        await pb.collection('navigation_links').create(formData, { $autoCancel: false });
        toast.success('Link created successfully');
      }
      setIsModalOpen(false);
      fetchLinks();
    } catch (error) {
      toast.error('Failed to save link');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await pb.collection('navigation_links').delete(id, { $autoCancel: false });
      toast.success('Link deleted successfully');
      fetchLinks();
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const handleMoveOrder = async (link, direction) => {
    const filtered = filteredLinks;
    const index = filtered.findIndex(l => l.id === link.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= filtered.length) return;

    const swapLink = filtered[swapIndex];
    const currentOrder = link.sort_order ?? index;
    const swapOrder = swapLink.sort_order ?? swapIndex;

    try {
      await Promise.all([
        pb.collection('navigation_links').update(link.id, { sort_order: swapOrder }, { $autoCancel: false }),
        pb.collection('navigation_links').update(swapLink.id, { sort_order: currentOrder }, { $autoCancel: false }),
      ]);
      fetchLinks();
    } catch (error) {
      toast.error('Failed to reorder links');
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || link.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
        <title>Navigation Links - Admin - AILCN</title>
      </Helmet>

      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Navigation Links</h1>
            <p className="text-sm text-muted-foreground mt-1">Use the ↑ ↓ arrows to reorder links in the nav menu.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Add New Link
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="header_menu">Header Menu</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
              <SelectItem value="cta_buttons">CTA Buttons</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No links found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks.map((link, index) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(link, 'up')}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={index === filteredLinks.length - 1}
                            onClick={() => handleMoveOrder(link, 'down')}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{link.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {link.url}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {link.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          {link.link_type}
                          {link.open_in_new_tab && <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={link.is_active ? 'default' : 'secondary'}>
                          {link.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(link)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Link' : 'Add New Link'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Link Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apply Now"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g., /apply or https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header_menu">Header Menu</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="cta_buttons">CTA Buttons</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Link Type</Label>
                  <Select value={formData.link_type} onValueChange={(val) => setFormData({ ...formData, link_type: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Route</SelectItem>
                      <SelectItem value="external">External URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Lower numbers appear first. You can also use the ↑ ↓ arrows in the table.</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="open_in_new_tab"
                    checked={formData.open_in_new_tab}
                    onCheckedChange={(checked) => setFormData({ ...formData, open_in_new_tab: checked })}
                  />
                  <Label htmlFor="open_in_new_tab">Open in new tab</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminNavigationLinks;