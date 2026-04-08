import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ShieldCheck, Target, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const ApplicantPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    professional_background: '',
    experience_level: '',
    organization_name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    pb.collection('analytics_events').create({
      event_type: 'page_view',
      page: 'applicant_page',
      timestamp: new Date().toISOString()
    }, { $autoCancel: false }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, experience_level: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const combinedMessage = `Background: ${formData.professional_background}\n\nMessage: ${formData.message}`;
      
      await pb.collection('applications').create({
        type: 'applicant',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience_level: formData.experience_level,
        organization_name: formData.organization_name,
        message: combinedMessage,
        status: 'pending'
      }, { $autoCancel: false });

      pb.collection('analytics_events').create({
        event_type: 'application_submit',
        page: 'applicant_page',
        metadata: JSON.stringify({ type: 'applicant' }),
        timestamp: new Date().toISOString()
      }, { $autoCancel: false }).catch(() => {});

      toast.success('Application submitted successfully. We will be in touch.');
      setFormData({
        name: '', email: '', phone: '', professional_background: '',
        experience_level: '', organization_name: '', message: ''
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Apply - AILCN</title>
        <meta name="description" content="Apply to join the AI Leadership Certification Network." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <section className="min-h-[80dvh] flex items-center bg-muted/30 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
                >
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                      You've been invited to apply. Not everyone reaches this point.
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      This is a selective network designed for practitioners who are ready to move from theory to execution.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-3 flex items-center">
                        <ShieldCheck className="w-6 h-6 mr-3 text-primary" />
                        What This Application Represents
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        It is a declaration of intent. By applying, you are signaling your readiness to undergo rigorous evaluation and commit to the highest standards of AI leadership.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-3 flex items-center">
                        <Target className="w-6 h-6 mr-3 text-primary" />
                        What Happens After You Apply
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Our review board evaluates your background, experience, and alignment with our network's objectives. You will receive a decision within 5 business days.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-3 flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-primary" />
                        The Commitment
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        If accepted, you will enter a 90-day intensive certification phase requiring dedicated focus, practical application, and peer collaboration.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t">
                    <h3 className="text-xl font-medium mb-4">If you are ready to move forward, begin your application now.</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" /> Apply to AILCN
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:sticky lg:top-24"
                >
                  <Card className="shadow-xl rounded-2xl border-0 ring-1 ring-border/50">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input id="name" name="name" required value={formData.name} onChange={handleChange} className="bg-background" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="bg-background" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="bg-background" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="organization_name">Current Organization</Label>
                              <Input id="organization_name" name="organization_name" value={formData.organization_name} onChange={handleChange} className="bg-background" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experience_level">AI Experience Level</Label>
                            <Select onValueChange={handleSelectChange} value={formData.experience_level}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select your level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="entry">Entry (0-2 years)</SelectItem>
                                <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                                <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="professional_background">Professional Background</Label>
                            <Textarea 
                              id="professional_background" 
                              name="professional_background" 
                              rows={3} 
                              required 
                              value={formData.professional_background} 
                              onChange={handleChange} 
                              className="bg-background resize-none"
                              placeholder="Briefly describe your career trajectory..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Why AILCN?</Label>
                            <Textarea 
                              id="message" 
                              name="message" 
                              rows={3} 
                              required 
                              value={formData.message} 
                              onChange={handleChange} 
                              className="bg-background resize-none"
                              placeholder="What do you hope to achieve within this network?"
                            />
                          </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ApplicantPage;