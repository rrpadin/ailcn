import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Award, Users, TrendingUp, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const INTERVIEW_URL = 'https://tally.so/r/Pd9WW1';

const ConsultantLandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience_level: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    pb.collection('analytics_events').create({
      event_type: 'page_view',
      page: 'consultant_landing',
      timestamp: new Date().toISOString()
    }, { $autoCancel: false }).catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await pb.collection('applications').create({
        type: 'consultant',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience_level: formData.experience_level,
        message: formData.message,
        status: 'pending'
      }, { $autoCancel: false });

      pb.collection('analytics_events').create({
        event_type: 'application_submit',
        page: 'consultant_landing',
        metadata: JSON.stringify({ type: 'consultant' }),
        timestamp: new Date().toISOString()
      }, { $autoCancel: false }).catch(() => { });

      toast.success('Application submitted! Complete your interview below.');
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
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
        <title>For consultants - AILCN</title>
        <meta name="description" content="Join the exclusive network of certified AI consultants. Get certified, gain access to pre-qualified organizations, and build your reputation." />
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
                  Build your reputation as a certified AI consultant
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  Join a selective network of practitioners who deliver real AI transformation. Get certified, access pre-qualified opportunities, and work with organizations that value proven expertise.
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
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What you get</h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                  <Card className="bg-card rounded-2xl shadow-lg">
                    <CardContent className="p-8">
                      <Award className="w-12 h-12 text-primary mb-6" />
                      <h3 className="text-xl font-semibold mb-4">Rigorous certification</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Our 90-day program isn't just theory. You'll work on real projects, build proven capabilities, and demonstrate results that matter to organizations.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Hands-on project work with real clients</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Mentorship from experienced practitioners</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Portfolio of documented outcomes</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card rounded-2xl shadow-lg">
                    <CardContent className="p-8">
                      <Users className="w-12 h-12 text-primary mb-6" />
                      <h3 className="text-xl font-semibold mb-4">Network access</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Connect with organizations actively seeking AI expertise. No cold outreach, no competing on price. Just qualified opportunities matched to your capabilities.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Pre-qualified organization matches</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Exclusive network events and resources</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ongoing professional development</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="max-w-3xl mx-auto">
                  <Card className="bg-muted/50 rounded-2xl">
                    <CardContent className="p-8">
                      <TrendingUp className="w-12 h-12 text-primary mb-6 mx-auto" />
                      <h3 className="text-xl font-semibold mb-4 text-center">Build lasting value</h3>
                      <p className="text-muted-foreground leading-relaxed text-center">
                        This isn't about quick wins. It's about building a reputation that opens doors. Organizations trust AILCN-certified consultants because they know the certification means something. That trust translates to better opportunities, stronger relationships, and sustainable growth.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Application Section */}
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
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Apply to join</h2>
                  <p className="text-muted-foreground">
                    Tell us about your experience and why you want to join the network. Your interview link will be unlocked immediately after.
                  </p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${submitted ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                      {submitted ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-sm font-medium">Your application</span>
                  </div>
                  <div className={`h-px w-12 ${submitted ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${submitted ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                      2
                    </div>
                    <span className={`text-sm font-medium ${submitted ? '' : 'text-muted-foreground'}`}>Interview</span>
                  </div>
                </div>

                {!submitted ? (
                  <Card className="shadow-lg rounded-2xl">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="Maya Chen"
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
                            placeholder="maya@example.com"
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
                          <Label htmlFor="experience_level" className="text-sm font-medium">Years of AI/ML experience</Label>
                          <Input
                            id="experience_level"
                            name="experience_level"
                            type="text"
                            required
                            value={formData.experience_level}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="5+ years"
                          />
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm font-medium">Tell us about your experience</Label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1 text-foreground placeholder:text-muted-foreground"
                            placeholder="Describe your AI consulting experience, notable projects, and why you want to join AILCN..."
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full transition-all duration-200 active:scale-[0.98]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Continue to interview'}
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
                        <h3 className="text-2xl font-bold mb-3">Application received, {formData.name.split(' ')[0]}!</h3>
                        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
                          Your application has been saved. Complete your interview now to move to the next step in the certification process.
                        </p>
                        <a
                          href={INTERVIEW_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                            Start your interview
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                        <p className="text-xs text-muted-foreground mt-4">
                          Opens in a new tab · Takes ~10 minutes
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

export default ConsultantLandingPage;