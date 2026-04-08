import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AssetPicker from './AssetPicker';
import QuizBuilder from './QuizBuilder';
import AIAssistantPanel from './AIAssistantPanel';
import { 
  IntroductionBlock, 
  TeachingContentBlock, 
  ExamplesBlock, 
  ReflectionPromptsBlock, 
  KeyTakeawaysBlock 
} from './ContentBlocksUI';

const LessonBuilder = ({ lessonData, moduleId, onSave, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [activeAiField, setActiveAiField] = useState('');

  const defaultFormData = {
    module_id: moduleId || '',
    title: '',
    description: '',
    lesson_type: 'video',
    status: 'draft',
    order: 0,
    introduction: '',
    teaching_content: '',
    examples: '',
    reflection_prompts: '',
    key_takeaways: '',
    video_url: '',
    video_asset_id: '',
    audio_url: '',
    audio_asset_id: '',
    file_attachment_id: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (lessonData) {
      setFormData({ ...defaultFormData, ...lessonData });
    } else {
      setFormData({ ...defaultFormData, module_id: moduleId });
    }
    setActiveTab('basic');
  }, [lessonData, moduleId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssetSelect = (asset, type) => {
    if (type === 'video') {
      handleChange('video_asset_id', asset?.id || '');
      handleChange('video_url', '');
    } else if (type === 'audio') {
      handleChange('audio_asset_id', asset?.id || '');
      handleChange('audio_url', '');
    } else if (type === 'document') {
      handleChange('file_attachment_id', asset?.id || '');
    }
  };

  const safeStringify = (val) => {
    if (!val) return '';
    return typeof val === 'string' ? val : JSON.stringify(val);
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      toast.error('Lesson title is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.module_id) {
      toast.error('Module ID is missing');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        introduction: safeStringify(formData.introduction),
        teaching_content: safeStringify(formData.teaching_content),
        examples: safeStringify(formData.examples),
        reflection_prompts: safeStringify(formData.reflection_prompts),
        key_takeaways: safeStringify(formData.key_takeaways),
      };

      let savedRecord;
      if (lessonData?.id) {
        savedRecord = await pb.collection('lessons').update(lessonData.id, payload, { $autoCancel: false });
        toast.success('Lesson updated successfully');
      } else {
        savedRecord = await pb.collection('lessons').create(payload, { $autoCancel: false });
        toast.success('Lesson created successfully');
      }
      
      if (onSave) onSave(savedRecord);
    } catch (error) {
      console.error('Save lesson error:', error);
      toast.error(error?.response?.message || 'Failed to save lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const openAIPanel = (field, contextName) => {
    setActiveAiField(field);
    setAiContext(contextName);
    setAiPanelOpen(true);
  };

  const handleAIGenerated = (text) => {
    handleChange(activeAiField, text);
  };

  const renderAIActions = (field, label) => (
    <div className="flex gap-2 mb-2">
      <Button 
        type="button" 
        variant="secondary" 
        size="sm" 
        className="h-7 text-xs" 
        onClick={() => openAIPanel(field, `Lesson ${label}`)}
      >
        <Sparkles className="w-3 h-3 mr-1 text-primary" /> Generate with AI
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleChange(field, '')}>
        Clear
      </Button>
    </div>
  );

  const renderMediaSection = () => {
    if (formData.lesson_type === 'video' || formData.lesson_type === 'audio') {
      const type = formData.lesson_type;
      return (
        <div className="space-y-4 border rounded-xl p-5 bg-card shadow-sm">
          <h3 className="font-semibold text-sm capitalize flex items-center gap-2">
            {type} Source Configuration
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>External {type} URL</Label>
              <Input 
                value={formData[`${type}_url`] || ''} 
                onChange={(e) => {
                  handleChange(`${type}_url`, e.target.value);
                  if (e.target.value) handleChange(`${type}_asset_id`, '');
                }}
                placeholder={`https://...`}
              />
            </div>
            <div className="space-y-2">
              <Label>Or Select Uploaded {type}</Label>
              <div className="flex items-center gap-3">
                <AssetPicker 
                  type={type} 
                  selectedId={formData[`${type}_asset_id`]}
                  onSelect={(asset) => handleAssetSelect(asset, type)}
                  triggerText={formData[`${type}_asset_id`] ? `Change ${type}` : `Select ${type}`}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="sm:max-w-[850px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background">
          <DialogHeader className="px-6 py-4 border-b bg-muted/20">
            <DialogTitle className="text-xl">{lessonData ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger value="quiz" disabled={formData.lesson_type !== 'quiz' && !lessonData?.id}>Quiz Builder</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6 mt-0 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <Input 
                        id="title" 
                        value={formData.title || ''} 
                        onChange={(e) => handleChange('title', e.target.value)} 
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => openAIPanel('title', 'Lesson Title')}>
                        <Sparkles className="w-4 h-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <div className="flex gap-2 items-start">
                      <Input 
                        id="description" 
                        value={formData.description || ''} 
                        onChange={(e) => handleChange('description', e.target.value)} 
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => openAIPanel('description', 'Lesson Description')}>
                        <Sparkles className="w-4 h-4 text-primary" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label>Lesson Type</Label>
                      <Select value={formData.lesson_type} onValueChange={(val) => handleChange('lesson_type', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Lesson</SelectItem>
                          <SelectItem value="text">Text/Article Lesson</SelectItem>
                          <SelectItem value="audio">Audio Lesson</SelectItem>
                          <SelectItem value="quiz">Quiz/Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Order Index</Label>
                      <Input 
                        type="number" 
                        value={formData.order || 0} 
                        onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)} 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-8 mt-0 animate-in fade-in duration-300">
                {renderMediaSection()}

                <div className="space-y-6">
                  <div className="relative">
                    {renderAIActions('introduction', 'Introduction')}
                    <IntroductionBlock value={formData.introduction} onChange={(val) => handleChange('introduction', val)} />
                  </div>
                  
                  <div className="relative">
                    {renderAIActions('teaching_content', 'Teaching Content')}
                    <TeachingContentBlock value={formData.teaching_content} onChange={(val) => handleChange('teaching_content', val)} />
                  </div>

                  {formData.lesson_type === 'text' && (
                    <div className="relative">
                      {renderAIActions('examples', 'Examples')}
                      <ExamplesBlock value={formData.examples} onChange={(val) => handleChange('examples', val)} />
                    </div>
                  )}

                  {formData.lesson_type === 'quiz' && (
                    <div className="relative">
                      {renderAIActions('reflection_prompts', 'Reflection Prompts')}
                      <ReflectionPromptsBlock value={formData.reflection_prompts} onChange={(val) => handleChange('reflection_prompts', val)} />
                    </div>
                  )}

                  <div className="relative">
                    {renderAIActions('key_takeaways', 'Key Takeaways')}
                    <KeyTakeawaysBlock value={formData.key_takeaways} onChange={(val) => handleChange('key_takeaways', val)} />
                  </div>
                </div>

                <div className="space-y-4 border rounded-xl p-5 bg-card shadow-sm mt-6">
                  <h3 className="font-semibold text-sm">Additional Attachments</h3>
                  <div className="space-y-2">
                    <Label>Select File Attachment (PDF, Document)</Label>
                    <div className="flex items-center gap-3">
                      <AssetPicker 
                        type="document" 
                        selectedId={formData.file_attachment_id}
                        onSelect={(asset) => handleAssetSelect(asset, 'document')}
                        triggerText={formData.file_attachment_id ? "Change File" : "Select File"}
                      />
                      {formData.file_attachment_id && <span className="text-sm text-muted-foreground">File Selected</span>}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="mt-0 animate-in fade-in duration-300">
                {lessonData?.id ? (
                  <QuizBuilder lessonId={lessonData.id} />
                ) : (
                  <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-muted/10">
                    <p className="text-muted-foreground">Please save the lesson first before building the quiz.</p>
                    <Button className="mt-4" onClick={handleSave} disabled={isSaving}>Save Lesson Now</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t bg-muted/20">
            <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving ? 'Saving...' : 'Save Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistantPanel 
        isOpen={aiPanelOpen} 
        onClose={() => setAiPanelOpen(false)} 
        context={aiContext} 
        onContentGenerated={handleAIGenerated} 
      />
    </>
  );
};

export default LessonBuilder;