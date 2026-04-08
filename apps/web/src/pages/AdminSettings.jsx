import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminSettings = () => {
  const [settingsId, setSettingsId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    site_name: 'AI Learning Consultant Network',
    site_abbreviation: 'AILCN',
    default_cta_link: '/signup',
    default_redirect_after_login: '/dashboard',
    logo_url: '',
    primary_color: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('site_settings').getFullList({ $autoCancel: false });
      if (records.length > 0) {
        const settings = records[0];
        setSettingsId(settings.id);
        setFormData({
          site_name: settings.site_name || '',
          site_abbreviation: settings.site_abbreviation || '',
          default_cta_link: settings.default_cta_link || '',
          default_redirect_after_login: settings.default_redirect_after_login || '',
          logo_url: settings.logo_url || '',
          primary_color: settings.primary_color || ''
        });
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settingsId) {
        await pb.collection('site_settings').update(settingsId, formData, { $autoCancel: false });
      } else {
        const newRecord = await pb.collection('site_settings').create(formData, { $autoCancel: false });
        setSettingsId(newRecord.id);
      }
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
        <title>Site Settings - Admin - AILCN</title>
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <Button onClick={handleSave} disabled={isSaving} className="transition-all duration-200">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic details about the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input 
                    id="site_name" 
                    value={formData.site_name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_abbreviation">Site Abbreviation</Label>
                  <Input 
                    id="site_abbreviation" 
                    value={formData.site_abbreviation} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Navigation Defaults</CardTitle>
              <CardDescription>Default routing behaviors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default_cta_link">Default CTA Link</Label>
                  <Input 
                    id="default_cta_link" 
                    value={formData.default_cta_link} 
                    onChange={handleChange} 
                    placeholder="/signup"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_redirect_after_login">Redirect After Login</Label>
                  <Input 
                    id="default_redirect_after_login" 
                    value={formData.default_redirect_after_login} 
                    onChange={handleChange} 
                    placeholder="/dashboard"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Visual identity settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input 
                    id="logo_url" 
                    value={formData.logo_url} 
                    onChange={handleChange} 
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color (Hex)</Label>
                  <Input 
                    id="primary_color" 
                    value={formData.primary_color} 
                    onChange={handleChange} 
                    placeholder="#000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;