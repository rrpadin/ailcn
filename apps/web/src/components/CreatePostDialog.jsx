import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const CreatePostDialog = ({ open, onOpenChange, onSuccess }) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'discussion',
    is_published: true
  });

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await pb.collection('member_posts').create({
        ...formData,
        author_id: currentUser.id,
        likes_count: 0,
        comments_count: 0
      }, { $autoCancel: false });
      
      toast.success('Post created successfully');
      onOpenChange(false);
      setFormData({ title: '', content: '', post_type: 'discussion', is_published: true });
      if (onSuccess) onSuccess(record);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20">
          <DialogTitle>Create Community Post</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              placeholder="What do you want to discuss?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select value={formData.post_type} onValueChange={(val) => setFormData({...formData, post_type: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="resource">Resource Sharing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-3 pt-8">
              <Switch 
                id="is_published"
                checked={formData.is_published} 
                onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
              />
              <Label htmlFor="is_published" className="cursor-pointer">Publish immediately</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content <span className="text-destructive">*</span></Label>
            <RichTextEditor 
              value={formData.content} 
              onChange={(val) => setFormData({...formData, content: val})} 
              placeholder="Share your thoughts, ask a question, or provide a resource..."
            />
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Post to Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;