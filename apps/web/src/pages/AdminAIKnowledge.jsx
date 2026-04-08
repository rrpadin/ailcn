import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AssetPicker from '@/components/AssetPicker';

const AdminAIKnowledge = () => {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    source_type: 'pasted_text',
    content: '',
    asset_id: '',
    tags: ''
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const records = await pb.collection('ai_knowledge_sources').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setSources(records);
    } catch (error) {
      toast.error('Failed to load knowledge sources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (source = null) => {
    if (source) {
      setEditingId(source.id);
      setFormData({
        title: source.title,
        source_type: source.source_type,
        content: source.content,
        asset_id: source.asset_id,
        tags: source.tags
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        source_type: 'pasted_text',
        content: '',
        asset_id: '',
        tags: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await pb.collection('ai_knowledge_sources').update(editingId, formData, { $autoCancel: false });
        toast.success('Knowledge source updated');
      } else {
        await pb.collection('ai_knowledge_sources').create(formData, { $autoCancel: false });
        toast.success('Knowledge source created');
      }
      setIsModalOpen(false);
      fetchSources();
    } catch (error) {
      toast.error('Failed to save knowledge source');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this knowledge source?')) return;
    
    try {
      await pb.collection('ai_knowledge_sources').delete(id, { $autoCancel: false });
      toast.success('Source deleted successfully');
      fetchSources();
    } catch (error) {
      toast.error('Failed to delete source');
    }
  };

  const filteredSources = sources.filter(src => 
    src.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (src.tags && src.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <title>AI Knowledge Base - Admin - AILCN</title>
      </Helmet>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              AI Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">Manage context documents for AI generation.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No knowledge sources found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSources.map((src) => (
                    <TableRow key={src.id}>
                      <TableCell className="font-medium">{src.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {src.source_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {src.tags ? src.tags.split(',').map(t => (
                            <Badge key={t} variant="secondary" className="text-xs">{t.trim()}</Badge>
                          )) : <span className="text-muted-foreground text-xs">None</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(src.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(src)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(src.id)} className="text-destructive hover:text-destructive">
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Knowledge Source' : 'Add Knowledge Source'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g., AI Ethics Guidelines 2026"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source Type</Label>
                  <Select value={formData.source_type} onValueChange={(val) => setFormData({...formData, source_type: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pasted_text">Pasted Text</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="uploaded_file">Uploaded File</SelectItem>
                      <SelectItem value="custom_entry">Custom Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    value={formData.tags} 
                    onChange={(e) => setFormData({...formData, tags: e.target.value})} 
                    placeholder="ethics, guidelines, 2026"
                  />
                </div>
              </div>

              {formData.source_type === 'uploaded_file' ? (
                <div className="space-y-2">
                  <Label>Linked Asset</Label>
                  <div className="flex items-center gap-3">
                    <AssetPicker 
                      type="document" 
                      selectedId={formData.asset_id}
                      onSelect={(asset) => setFormData({...formData, asset_id: asset.id})}
                      triggerText={formData.asset_id ? "Change Asset" : "Select Asset"}
                    />
                    {formData.asset_id && <span className="text-sm text-muted-foreground">Asset Selected</span>}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    value={formData.content} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    placeholder="Paste the knowledge content here..."
                    className="min-h-[200px]"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Source'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminAIKnowledge;