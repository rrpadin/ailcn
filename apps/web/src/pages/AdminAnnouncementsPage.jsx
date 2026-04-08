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
import { Megaphone, Plus, Edit, Trash2, Search, Loader2, Pin, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import RichTextEditor from '@/components/RichTextEditor.jsx';
import AssetPicker from '@/components/AssetPicker.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AdminAnnouncementsPage = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultFormData = {
    title: '',
    content: '',
    announcement_type: 'news',
    featured_image: '',
    video_url: '',
    is_pinned: false,
    is_published: false,
  };
  
  const [formData, setFormData] = useState(defaultFormData);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('announcements').getList(1, 100, {
        sort: '-is_pinned,-created',
        expand: 'posted_by',
        $autoCancel: false
      });
      setAnnouncements(records.items);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await pb.collection('announcements').delete(id, { $autoCancel: false });
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const openAddForm = () => {
    setFormMode('add');
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  const openEditForm = (announcement) => {
    setFormMode('edit');
    setFormData({
      id: announcement.id,
      title: announcement.title || '',
      content: announcement.content || '',
      announcement_type: announcement.announcement_type || 'news',
      featured_image: announcement.featured_image || '',
      video_url: announcement.video_url || '',
      is_pinned: announcement.is_pinned || false,
      is_published: announcement.is_published || false,
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and Content are required');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        posted_by: currentUser.id
      };

      if (formMode === 'add') {
        await pb.collection('announcements').create(dataToSave, { $autoCancel: false });
        toast.success('Announcement created successfully');
      } else {
        const { id, ...updateData } = dataToSave;
        await pb.collection('announcements').update(id, updateData, { $autoCancel: false });
        toast.success('Announcement updated successfully');
      }
      setIsFormOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.response?.message || 'Failed to save announcement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await pb.collection('announcements').update(id, { is_published: !currentStatus }, { $autoCancel: false });
      setAnnouncements(announcements.map(a => a.id === id ? { ...a, is_published: !currentStatus } : a));
      toast.success(`Announcement ${!currentStatus ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    (a.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Manage Announcements - Admin - AILCN</title>
      </Helmet>

      <div className="container mx-auto max-w-6xl pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-primary" />
              Announcements
            </h1>
            <p className="text-muted-foreground mt-1">Manage news, events, and resources for members.</p>
          </div>
          <Button onClick={openAddForm} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Announcement
          </Button>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search announcements..." 
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
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No announcements found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try adjusting your search query.' : 'Create your first announcement to share with members.'}
              </p>
              {!searchQuery && (
                <Button onClick={openAddForm} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Create Announcement
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Pinned</TableHead>
                    <TableHead className="text-center">Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.is_pinned && <Pin className="w-3 h-3 text-primary fill-primary" />}
                          {item.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.announcement_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.is_pinned ? (
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Pinned</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch 
                            checked={item.is_published} 
                            onCheckedChange={() => handleTogglePublish(item.id, item.is_published)}
                          />
                          {item.is_published ? (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground/50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(item)} title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)} title="Delete">
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

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b bg-muted/20">
              <DialogTitle>{formMode === 'add' ? 'Create Announcement' : 'Edit Announcement'}</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="Announcement title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.announcement_type} onValueChange={(val) => setFormData({...formData, announcement_type: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col justify-center gap-4 pt-6">
                  <div className="flex items-center gap-3">
                    <Switch 
                      id="is_pinned"
                      checked={formData.is_pinned} 
                      onCheckedChange={(checked) => setFormData({...formData, is_pinned: checked})}
                    />
                    <Label htmlFor="is_pinned" className="cursor-pointer">Pin to top</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      id="is_published"
                      checked={formData.is_published} 
                      onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                    />
                    <Label htmlFor="is_published" className="cursor-pointer">Publish immediately</Label>
                  </div>
                </div>
              </div>

              {formData.announcement_type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input 
                    id="video_url" 
                    value={formData.video_url} 
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
                    placeholder="https://youtube.com/..."
                  />
                </div>
              )}

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
                <Label>Content <span className="text-destructive">*</span></Label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={(val) => setFormData({...formData, content: val})} 
                />
              </div>
            </div>
            
            <DialogFooter className="px-6 py-4 border-t bg-muted/20">
              <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {formMode === 'add' ? 'Create' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminAnnouncementsPage;