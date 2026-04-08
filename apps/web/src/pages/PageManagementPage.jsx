import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Trash2, Search, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import RichTextEditor from '@/components/RichTextEditor';
import AssetPicker from '@/components/AssetPicker';

const PageManagementPage = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultFormData = {
    title: '',
    slug: '',
    description: '',
    content: '',
    status: 'draft',
    is_visible: false,
    featured_image: '',
    meta_title: '',
    meta_description: '',
    order: 0
  };
  
  const [formData, setFormData] = useState(defaultFormData);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      // Note: Expecting the new schema as requested
      const records = await pb.collection('pages').getList(1, 100, {
        sort: 'order,-created',
        $autoCancel: false
      });
      setPages(records.items);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to load pages. Ensure the database schema is updated.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleVisibilityToggle = async (pageId, currentValue) => {
    try {
      await pb.collection('pages').update(pageId, { is_visible: !currentValue }, { $autoCancel: false });
      setPages(pages.map(p => p.id === pageId ? { ...p, is_visible: !currentValue } : p));
      toast.success(`Page is now ${!currentValue ? 'visible' : 'hidden'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
    
    try {
      await pb.collection('pages').delete(pageId, { $autoCancel: false });
      setPages(pages.filter(p => p.id !== pageId));
      toast.success('Page deleted successfully');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const openAddForm = () => {
    setFormMode('add');
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  const openEditForm = (page) => {
    setFormMode('edit');
    setFormData({
      id: page.id,
      title: page.title || '',
      slug: page.slug || '',
      description: page.description || '',
      content: page.content || '',
      status: page.status || 'draft',
      is_visible: page.is_visible || false,
      featured_image: page.featured_image || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      order: page.order || 0
    });
    setIsFormOpen(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (formMode === 'add') {
      setFormData({ ...formData, title: newTitle, slug: generateSlug(newTitle) });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error('Title and Slug are required');
      return;
    }

    setIsSaving(true);
    try {
      if (formMode === 'add') {
        await pb.collection('pages').create(formData, { $autoCancel: false });
        toast.success('Page created successfully');
      } else {
        const { id, ...updateData } = formData;
        await pb.collection('pages').update(id, updateData, { $autoCancel: false });
        toast.success('Page updated successfully');
      }
      setIsFormOpen(false);
      fetchPages();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.response?.message || 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPages = pages.filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Page Management - Admin - AILCN</title>
      </Helmet>

      <div className="container mx-auto max-w-6xl pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Page Management
            </h1>
            <p className="text-muted-foreground mt-1">Create and manage custom pages for your website.</p>
          </div>
          <Button onClick={openAddForm} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New Page
          </Button>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search pages by title or slug..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pages found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first custom page.'}
              </p>
              {!searchQuery && (
                <Button onClick={openAddForm} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Create Page
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id} className="group">
                      <TableCell className="font-medium">{page.title || 'Untitled'}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">/{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                          {page.status || 'draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch 
                            checked={page.is_visible} 
                            onCheckedChange={() => handleVisibilityToggle(page.id, page.is_visible)}
                          />
                          {page.is_visible ? (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground/50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/page/${page.slug}`, '_blank')} title="View Page">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(page)} title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(page.id)} title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b bg-muted/20">
              <DialogTitle>{formMode === 'add' ? 'Create New Page' : 'Edit Page'}</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={handleTitleChange} 
                    placeholder="e.g., About Us"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug <span className="text-destructive">*</span></Label>
                  <Input 
                    id="slug" 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    placeholder="e.g., about-us"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Input 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Brief summary of the page content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex items-center h-10 gap-3 px-3 border rounded-md bg-muted/10">
                    <Switch 
                      checked={formData.is_visible} 
                      onCheckedChange={(checked) => setFormData({...formData, is_visible: checked})}
                    />
                    <span className="text-sm">{formData.is_visible ? 'Visible in Nav' : 'Hidden from Nav'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Menu Order</Label>
                  <Input 
                    id="order" 
                    type="number" 
                    value={formData.order} 
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex items-center gap-4">
                  <AssetPicker 
                    type="image" 
                    selectedId={formData.featured_image}
                    onSelect={(asset) => setFormData({...formData, featured_image: asset?.id || ''})}
                    triggerText={formData.featured_image ? "Change Image" : "Select Image"}
                  />
                  {formData.featured_image && (
                    <Button variant="ghost" size="sm" onClick={() => setFormData({...formData, featured_image: ''})} className="text-destructive">
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Page Content</Label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={(val) => setFormData({...formData, content: val})} 
                />
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SEO Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input 
                      id="meta_title" 
                      value={formData.meta_title} 
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})} 
                      placeholder="SEO Title (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Input 
                      id="meta_description" 
                      value={formData.meta_description} 
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})} 
                      placeholder="SEO Description (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="px-6 py-4 border-t bg-muted/20">
              <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {formMode === 'add' ? 'Create Page' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PageManagementPage;