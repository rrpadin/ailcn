import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';

const AdminCMS = () => {
  const { currentAdmin } = useAuth();
  const [content, setContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const records = await pb.collection('website_content').getFullList({ $autoCancel: false });
        const contentMap = {};
        records.forEach(record => {
          const key = `${record.page}_${record.section}`;
          contentMap[key] = record;
        });
        setContent(contentMap);
      } catch (error) {
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (page, section) => {
    setIsSaving(true);
    const key = `${page}_${section}`;
    const data = content[key];

    try {
      if (data?.id) {
        await pb.collection('website_content').update(data.id, {
          ...data,
          updated_by: currentAdmin?.email || 'admin'
        }, { $autoCancel: false });
      } else {
        const newRecord = await pb.collection('website_content').create({
          page,
          section,
          heading: data?.heading || '',
          content: data?.content || '',
          cta_text: data?.cta_text || '',
          cta_destination: data?.cta_destination || '',
          cta_visible: data?.cta_visible || false,
          updated_by: currentAdmin?.email || 'admin'
        }, { $autoCancel: false });
        setContent({ ...content, [key]: newRecord });
      }
      toast.success('Content saved successfully');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (page, section, field, value) => {
    const key = `${page}_${section}`;
    setContent({
      ...content,
      [key]: { ...content[key], [field]: value }
    });
  };

  const ContentEditor = ({ page, section, title }) => {
    const key = `${page}_${section}`;
    const data = content[key] || {};

    return (
      <Card className="shadow-lg rounded-xl mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`${key}_heading`}>Heading</Label>
            <Input
              id={`${key}_heading`}
              value={data.heading || ''}
              onChange={(e) => updateContent(page, section, 'heading', e.target.value)}
              className="mt-1 text-foreground"
            />
          </div>
          <div>
            <Label htmlFor={`${key}_content`}>Content</Label>
            <Textarea
              id={`${key}_content`}
              rows={6}
              value={data.content || ''}
              onChange={(e) => updateContent(page, section, 'content', e.target.value)}
              className="mt-1 text-foreground"
            />
          </div>
          <div>
            <Label htmlFor={`${key}_cta_text`}>CTA button text</Label>
            <Input
              id={`${key}_cta_text`}
              value={data.cta_text || ''}
              onChange={(e) => updateContent(page, section, 'cta_text', e.target.value)}
              className="mt-1 text-foreground"
            />
          </div>
          <div>
            <Label htmlFor={`${key}_cta_destination`}>CTA destination URL</Label>
            <Input
              id={`${key}_cta_destination`}
              value={data.cta_destination || ''}
              onChange={(e) => updateContent(page, section, 'cta_destination', e.target.value)}
              className="mt-1 text-foreground"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id={`${key}_cta_visible`}
              checked={data.cta_visible || false}
              onCheckedChange={(checked) => updateContent(page, section, 'cta_visible', checked)}
            />
            <Label htmlFor={`${key}_cta_visible`}>Show CTA button</Label>
          </div>
          <Button onClick={() => handleSave(page, section)} disabled={isSaving} className="transition-all duration-200">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </CardContent>
      </Card>
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
        <title>CMS - Admin - AILCN</title>
        <meta name="description" content="Manage website content" />
      </Helmet>
      
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Content management</h1>

        <Tabs defaultValue="homepage" className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex min-w-full sm:min-w-0">
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="consultant">Consultant</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="applicant">Applicant</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="homepage" className="space-y-6">
            <ContentEditor page="homepage" section="hero" title="Hero section" />
            <ContentEditor page="homepage" section="what_this_means" title="What this means section" />
            <ContentEditor page="homepage" section="how_it_works" title="How it works section" />
            <ContentEditor page="homepage" section="ways_to_engage" title="Ways to engage section" />
            <ContentEditor page="homepage" section="authority" title="Authority & proof section" />
            <ContentEditor page="homepage" section="charter" title="Charter/exclusivity section" />
            <ContentEditor page="homepage" section="final_cta" title="Final CTA section" />
          </TabsContent>

          <TabsContent value="consultant" className="space-y-6">
            <ContentEditor page="consultant_landing" section="hero" title="Hero section" />
            <ContentEditor page="consultant_landing" section="benefits" title="Benefits section" />
            <ContentEditor page="consultant_landing" section="certification" title="Certification details" />
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <ContentEditor page="organization_landing" section="hero" title="Hero section" />
            <ContentEditor page="organization_landing" section="benefits" title="Benefits section" />
            <ContentEditor page="organization_landing" section="assessment" title="Assessment details" />
          </TabsContent>

          <TabsContent value="applicant" className="space-y-6">
            <ContentEditor page="applicant_page" section="hero" title="Hero section" />
            <ContentEditor page="applicant_page" section="what_it_represents" title="What This Represents" />
            <ContentEditor page="applicant_page" section="what_happens" title="What Happens After" />
            <ContentEditor page="applicant_page" section="commitment" title="The Commitment" />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <ContentEditor page="member_dashboard" section="hero" title="Hero section" />
            <ContentEditor page="member_dashboard" section="environment" title="Your Environment" />
            <ContentEditor page="member_dashboard" section="capabilities" title="What You Can Do Here" />
            <ContentEditor page="member_dashboard" section="expectation" title="Expectation" />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <ContentEditor page="training_page" section="hero" title="Hero section" />
            <ContentEditor page="training_page" section="overview" title="Overview" />
            <ContentEditor page="training_page" section="what_you_develop" title="What You Will Develop" />
            <ContentEditor page="training_page" section="expectation" title="Expectation" />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ContentEditor page="resources_page" section="hero" title="Hero section" />
            <ContentEditor page="resources_page" section="final_cta" title="Final CTA section" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminCMS;