import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Save, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminAISettings = () => {
  const [settingsId, setSettingsId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    provider_name: 'OpenAI',
    endpoint_url: 'https://api.openai.com/v1/chat/completions',
    model_name: 'gpt-4o',
    api_key_reference: '',
    temperature: 0.7,
    max_tokens: 2000,
    default_system_prompt: 'You are an expert instructional designer and AI consultant.',
    course_generation_instructions: '',
    lesson_generation_instructions: '',
    quiz_generation_instructions: '',
    allow_knowledge_selection: true,
    allow_pasted_sources: true,
    require_admin_review: true,
    disable_auto_publish: true,
    log_generations: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('ai_settings').getFullList({ $autoCancel: false });
      if (records.length > 0) {
        const settings = records[0];
        setSettingsId(settings.id);
        setFormData({
          provider_name: settings.provider_name || '',
          endpoint_url: settings.endpoint_url || '',
          model_name: settings.model_name || '',
          api_key_reference: settings.api_key_reference || '',
          temperature: settings.temperature ?? 0.7,
          max_tokens: settings.max_tokens ?? 2000,
          default_system_prompt: settings.default_system_prompt || '',
          course_generation_instructions: settings.course_generation_instructions || '',
          lesson_generation_instructions: settings.lesson_generation_instructions || '',
          quiz_generation_instructions: settings.quiz_generation_instructions || '',
          allow_knowledge_selection: settings.allow_knowledge_selection ?? true,
          allow_pasted_sources: settings.allow_pasted_sources ?? true,
          require_admin_review: settings.require_admin_review ?? true,
          disable_auto_publish: settings.disable_auto_publish ?? true,
          log_generations: settings.log_generations ?? true
        });
      }
    } catch (error) {
      console.error('Failed to load AI settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settingsId) {
        await pb.collection('ai_settings').update(settingsId, formData, { $autoCancel: false });
      } else {
        const newRecord = await pb.collection('ai_settings').create(formData, { $autoCancel: false });
        setSettingsId(newRecord.id);
      }
      toast.success('AI Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save AI settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <title>AI Settings - Admin - AILCN</title>
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-primary" />
              AI Configuration
            </h1>
            <p className="text-muted-foreground mt-1">Manage AI provider settings and generation prompts.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="transition-all duration-200">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Provider Configuration</CardTitle>
              <CardDescription>Connect to your preferred LLM provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider Name</Label>
                  <Input 
                    value={formData.provider_name} 
                    onChange={(e) => handleChange('provider_name', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model Name</Label>
                  <Input 
                    value={formData.model_name} 
                    onChange={(e) => handleChange('model_name', e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endpoint URL</Label>
                  <Input 
                    value={formData.endpoint_url} 
                    onChange={(e) => handleChange('endpoint_url', e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>API Key Reference (Env Var Name)</Label>
                  <Input 
                    value={formData.api_key_reference} 
                    onChange={(e) => handleChange('api_key_reference', e.target.value)} 
                    placeholder="e.g., OPENAI_API_KEY"
                  />
                  <p className="text-xs text-muted-foreground">Do not paste actual API keys here. Use environment variable references.</p>
                </div>
                
                <div className="space-y-4 mt-2">
                  <div className="flex justify-between">
                    <Label>Temperature: {formData.temperature}</Label>
                  </div>
                  <Slider 
                    value={[formData.temperature]} 
                    min={0} max={1} step={0.1}
                    onValueChange={([val]) => handleChange('temperature', val)}
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <Label>Max Tokens</Label>
                  <Input 
                    type="number"
                    value={formData.max_tokens} 
                    onChange={(e) => handleChange('max_tokens', parseInt(e.target.value))} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Prompt Controls</CardTitle>
              <CardDescription>Base instructions for the AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default System Prompt</Label>
                <Textarea 
                  value={formData.default_system_prompt} 
                  onChange={(e) => handleChange('default_system_prompt', e.target.value)} 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Course Generation Instructions</Label>
                <Textarea 
                  value={formData.course_generation_instructions} 
                  onChange={(e) => handleChange('course_generation_instructions', e.target.value)} 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Lesson Generation Instructions</Label>
                <Textarea 
                  value={formData.lesson_generation_instructions} 
                  onChange={(e) => handleChange('lesson_generation_instructions', e.target.value)} 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Quiz Generation Instructions</Label>
                <Textarea 
                  value={formData.quiz_generation_instructions} 
                  onChange={(e) => handleChange('quiz_generation_instructions', e.target.value)} 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle>Knowledge Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex-1 cursor-pointer" htmlFor="allow_knowledge">Allow Knowledge Selection</Label>
                  <Switch 
                    id="allow_knowledge"
                    checked={formData.allow_knowledge_selection} 
                    onCheckedChange={(c) => handleChange('allow_knowledge_selection', c)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex-1 cursor-pointer" htmlFor="allow_pasted">Allow Pasted Sources</Label>
                  <Switch 
                    id="allow_pasted"
                    checked={formData.allow_pasted_sources} 
                    onCheckedChange={(c) => handleChange('allow_pasted_sources', c)} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle>Safety & Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex-1 cursor-pointer" htmlFor="req_review">Require Admin Review</Label>
                  <Switch 
                    id="req_review"
                    checked={formData.require_admin_review} 
                    onCheckedChange={(c) => handleChange('require_admin_review', c)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex-1 cursor-pointer" htmlFor="dis_auto">Disable Auto-Publish</Label>
                  <Switch 
                    id="dis_auto"
                    checked={formData.disable_auto_publish} 
                    onCheckedChange={(c) => handleChange('disable_auto_publish', c)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex-1 cursor-pointer" htmlFor="log_gen">Log Generations</Label>
                  <Switch 
                    id="log_gen"
                    checked={formData.log_generations} 
                    onCheckedChange={(c) => handleChange('log_generations', c)} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAISettings;