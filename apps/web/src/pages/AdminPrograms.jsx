import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LessonList from '@/components/LessonList';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsData, pricingData, modulesData] = await Promise.all([
        pb.collection('programs').getFullList({ $autoCancel: false }),
        pb.collection('pricing').getFullList({ $autoCancel: false }),
        pb.collection('modules').getFullList({ sort: 'order_index', $autoCancel: false })
      ]);
      setPrograms(programsData);
      setPricing(pricingData);
      setModules(modulesData);
    } catch (error) {
      toast.error('Failed to load programs data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgram = async (program) => {
    setIsSaving(true);
    try {
      if (program.id) {
        await pb.collection('programs').update(program.id, program, { $autoCancel: false });
      } else {
        await pb.collection('programs').create(program, { $autoCancel: false });
      }
      toast.success('Program saved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to save program');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModule = async (programId) => {
    const title = window.prompt('Enter module title:');
    if (!title) return;

    try {
      const nextOrder = modules.filter(m => m.course_id === programId).length + 1;
      await pb.collection('modules').create({
        course_id: programId,
        title,
        order_index: nextOrder
      }, { $autoCancel: false });
      toast.success('Module created');
      fetchData();
    } catch (error) {
      toast.error('Failed to create module');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const certificationProgram = programs.find(p => p.type === 'certification') || {};
  const assessmentProgram = programs.find(p => p.type === 'assessment') || {};
  const certModules = modules.filter(m => m.course_id === certificationProgram.id);

  return (
    <>
      <Helmet>
        <title>Programs & Curriculum - Admin - AILCN</title>
        <meta name="description" content="Manage programs, pricing, and curriculum" />
      </Helmet>
      
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Program Management</h1>

        <div className="space-y-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>90-Day Certification Program</CardTitle>
              <CardDescription>Core settings for the main certification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cert_name">Program name</Label>
                <Input
                  id="cert_name"
                  defaultValue={certificationProgram.name || '90-Day AI Leadership Certification'}
                  className="mt-1 text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="cert_description">Description</Label>
                <Textarea
                  id="cert_description"
                  rows={4}
                  defaultValue={certificationProgram.description || ''}
                  className="mt-1 text-foreground"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cert_active"
                  defaultChecked={certificationProgram.status === 'active'}
                />
                <Label htmlFor="cert_active">Program active</Label>
              </div>
              <Button onClick={() => saveProgram(certificationProgram)} disabled={isSaving} className="transition-all duration-200">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save program'}
              </Button>
            </CardContent>
          </Card>

          {/* Curriculum Management Section */}
          {certificationProgram.id && (
            <Card className="shadow-lg rounded-xl border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Curriculum Builder
                  </CardTitle>
                  <CardDescription>Manage modules and lessons for the certification</CardDescription>
                </div>
                <Button onClick={() => handleAddModule(certificationProgram.id)} size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Module
                </Button>
              </CardHeader>
              <CardContent>
                {certModules.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg border-dashed bg-muted/10">
                    <p className="text-muted-foreground mb-4">No modules created yet.</p>
                    <Button onClick={() => handleAddModule(certificationProgram.id)} variant="outline">
                      Create First Module
                    </Button>
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full space-y-4">
                    {certModules.map((module, index) => (
                      <AccordionItem key={module.id} value={module.id} className="border rounded-lg bg-card px-2">
                        <AccordionTrigger className="hover:no-underline py-4 px-2">
                          <div className="flex items-center text-left">
                            <span className="text-muted-foreground font-mono mr-4 text-sm">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="font-semibold">{module.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-4 pt-2">
                          <div className="pl-8 border-l-2 border-muted ml-3">
                            <LessonList moduleId={module.id} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Certification Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricing.filter(p => p.program_id === certificationProgram.id).map((price, index) => (
                <div key={price.id || index} className="border rounded-lg p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tier name</Label>
                      <Input
                        defaultValue={price.tier_name || ''}
                        className="mt-1 text-foreground"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        defaultValue={price.price || 0}
                        className="mt-1 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Payment type</Label>
                      <Select defaultValue={price.payment_type || 'one_time'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">One-time</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Billing period</Label>
                      <Select defaultValue={price.billing_period || 'monthly'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked={price.active} />
                    <Label>Active</Label>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="transition-all duration-200">
                Add pricing tier
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>AI Readiness Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assess_name">Assessment name</Label>
                <Input
                  id="assess_name"
                  defaultValue={assessmentProgram.name || 'AI Readiness Assessment'}
                  className="mt-1 text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="assess_description">Description</Label>
                <Textarea
                  id="assess_description"
                  rows={4}
                  defaultValue={assessmentProgram.description || ''}
                  className="mt-1 text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="assess_visibility">Visibility</Label>
                <Select defaultValue={assessmentProgram.visibility || 'public'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="invite_only">Invite only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="assess_active"
                  defaultChecked={assessmentProgram.status === 'active'}
                />
                <Label htmlFor="assess_active">Assessment active</Label>
              </div>
              <Button onClick={() => saveProgram(assessmentProgram)} disabled={isSaving} className="transition-all duration-200">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save assessment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminPrograms;