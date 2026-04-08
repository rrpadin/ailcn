import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Target, Shield, Zap, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const ASSESSMENT_URL = 'https://tally.so/r/vGyArl';

const OrganizationLandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization_name: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    pb.collection('analytics_events').create({
      event_type: 'page_view',
      page: 'organization_landing',
      timestamp: new Date().toISOString()
    }, { $autoCancel: false }).catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await pb.collection('applications').create({
        type: 'organization',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization_name: formData.organization_name,
        industry: formData.industry,
        message: formData.message,
        status: 'pending'
      }, { $autoCancel: false });

      pb.collection('analytics_events').create({
        event_type: 'assessment_start',
        page: 'organization_landing',
        metadata: JSON.stringify({ type: 'organization' }),
        timestamp: new Date().toISOString()
      }, { $autoCancel: false }).catch(() => { });

      toast.success('Information submitted! Your assessment is ready below.');
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>For organizations - AILCN</title>
        <meta name="description" content="Get matched with certified AI consultants who understand your challenges. Start with our AI readiness assessment." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                  Find AI expertise that actually delivers
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  Stop guessing. Start with our AI readiness assessment. Get matched with certified consultants who understand your specific challenges and can help you move forward with confidence.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why organizations choose AILCN</h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                  <Card className="bg-card rounded-2xl shadow-lg">
                    <CardContent className="p-8">
                      <Target className="w-12 h-12 text-primary mb-6" />
                      <h3 className="text-xl font-semibold mb-4">Clear assessment</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Our AI readiness diagnostic cuts through the noise. You'll understand exactly where you are, what's possible, and what it will take to get there.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Comprehensive capability assessment</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Honest evaluation of readiness</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Actionable roadmap forward</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card rounded-2xl shadow-lg">
                    <CardContent className="p-8">
                      <Shield className="w-12 h-12 text-primary mb-6" />
                      <h3 className="text-xl font-semibold mb-4">Vetted consultants</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Every consultant in our network has been certified through a rigorous program. They've proven they can deliver, not just talk about AI.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Certified through 90-day program</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Proven track record of results</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Matched to your specific needs</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="max-w-3xl mx-auto">
                  <Card className="bg-muted/50 rounded-2xl">
                    <CardContent className="p-8">
                      <Zap className="w-12 h-12 text-primary mb-6 mx-auto" />
                      <h3 className="text-xl font-semibold mb-4 text-center">Move forward with confidence</h3>
                      <p className="text-muted-foreground leading-relaxed text-center">
                        AI transformation doesn't have to be overwhelming. With the right assessment and the right consultant, you can move from confusion to clarity. Our network exists to make that connection happen.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Assessment Section */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Start your assessment</h2>
                  <p className="text-muted-foreground">
                    Tell us about your organization and what you're trying to achieve. We'll unlock your assessment immediately after.
                  </p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${submitted ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                      {submitted ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-sm font-medium">Your info</span>
                  </div>
                  <div className={`h-px w-12 ${submitted ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${submitted ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                      2
                    </div>
                    <span className={`text-sm font-medium ${submitted ? '' : 'text-muted-foreground'}`}>Take assessment</span>
                  </div>
                </div>

                {!submitted ? (
                  <Card className="shadow-lg rounded-2xl">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">Your name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="Raj Patel"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="raj@company.com"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <Label htmlFor="organization_name" className="text-sm font-medium">Organization name</Label>
                          <Input
                            id="organization_name"
                            name="organization_name"
                            type="text"
                            required
                            value={formData.organization_name}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="Meridian Labs"
                          />
                        </div>

                        <div>
                          <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                          <Input
                            id="industry"
                            name="industry"
                            type="text"
                            required
                            value={formData.industry}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="Healthcare, Finance, Manufacturing, etc."
                          />
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm font-medium">What are you trying to achieve with AI?</Label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="Describe your AI goals, current challenges, and what success looks like for your organization..."
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full transition-all duration-200 active:scale-[0.98]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Continue to assessment'}
                          {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="shadow-lg rounded-2xl ring-2 ring-primary">
                      <CardContent className="p-10 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">You're all set, {formData.name.split(' ')[0]}!</h3>
                        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
                          Your information has been saved. Click below to take your AI readiness assessment — it takes about 15 minutes and you'll receive personalized results.
                        </p>
                        <a
                          href={ASSESSMENT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                            Take your assessment
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                        <p className="text-xs text-muted-foreground mt-4">
                          Opens in a new tab · Takes ~15 minutes
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OrganizationLandingPage;