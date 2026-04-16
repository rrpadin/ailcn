import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Award, Users, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const INTERVIEW_URL = 'https://tally.so/r/Pd9WW1';
const leaveWithCards = [
  {
    icon: Award,
    title: 'A sellable consulting offer',
    description: 'A structured AI Readiness Assessment you can take to market immediately.',
  },
  {
    icon: Users,
    title: 'A clear path to paid work',
    description: 'From first conversation to initial deal to expanded engagement.',
  },
  {
    icon: Award,
    title: 'Executive-facing positioning',
    description: 'Language, metrics, and framing tied to business outcomes, not training.',
  },
  {
    icon: Users,
    title: 'Access to real demand',
    description: 'Organizations already looking for credible AI execution.',
  },
];

const buildSteps = [
  {
    number: '01',
    title: 'First deal',
    description: 'You are expected to sell your first $1,500 assessment early.',
  },
  {
    number: '02',
    title: 'Executive positioning',
    description: 'You learn to sell into business metrics leaders care about.',
  },
  {
    number: '03',
    title: 'Offer + pricing',
    description: 'You package engagements that expand beyond the first deal.',
  },
  {
    number: '04',
    title: 'Market-ready',
    description: 'You leave ready to sell and deliver, not still preparing.',
  },
];

const fitBullets = [
  'Have 5-20 years of professional experience',
  'Have worked in L&D, HR, consulting, or operations',
  'Can engage decision-makers directly',
  'Want to move beyond training into advisory work',
];

const notFitBullets = [
  'Focus primarily on content or courses',
  'Avoid business conversations',
  'Are looking for passive learning',
  'Are not ready to sell',
];

const standardsBullets = [
  'Fewer consultants',
  'Higher expectations',
  'Real accountability for results',
];

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
        <meta name="description" content="Join AILCN to build an AI consulting practice tied to revenue, executive outcomes, and real client work." />
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
                  Stop selling training. Start selling AI work tied to revenue.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  AILCN is a selective network for experienced professionals building high-value AI consulting practices, not content businesses.
                </p>
                <p className="mx-auto max-w-3xl border-l-2 border-gold pl-4 text-left text-sm uppercase tracking-[0.16em] text-foreground">
                  Not for trainers, course creators, or AI enthusiasts without real business experience.
                </p>
                <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-foreground">
                  If you&apos;re not comfortable selling into executives or owning outcomes, this will not work.
                </p>
                <div className="mt-8 flex justify-center">
                  <a href="#apply">
                    <Button size="lg" className="min-w-56">
                      Apply to Join
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What This Actually Is */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">This is a business model, not a certification.</h2>
                <div className="space-y-4 text-lg leading-8 text-muted-foreground">
                  <p>You don&apos;t join to learn AI.</p>
                  <p>You join to build a consulting practice that sells and delivers it.</p>
                  <p>Everything is designed to move you from conversation to paid engagement to expanded work.</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* How You Make Money */}
          <section className="py-20 bg-secondary/35 border-y border-foreground/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
              >
                <div>
                  <p className="section-kicker text-gold">Economic model</p>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">How you make money</h2>
                </div>

                <div className="border border-foreground/10 bg-background p-8 shadow-sm">
                  <div className="space-y-4 text-lg leading-8 text-muted-foreground">
                    <p>You start with a $1,500 AI Readiness Assessment.</p>
                    <p>That assessment is designed to open larger engagements ($10K-$50K+) tied to implementation and performance.</p>
                  </div>
                  <div className="mt-8 border-t border-foreground/10 pt-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">You earn:</p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start text-sm leading-6 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                        <span>Consulting revenue from your engagements</span>
                      </li>
                      <li className="flex items-start text-sm leading-6 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                        <span>Commissions from platform adoption</span>
                      </li>
                      <li className="flex items-start text-sm leading-6 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                        <span>Ongoing work through client expansion</span>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-6 text-sm leading-6 text-foreground">
                    If you&apos;re not looking to sell and deliver real work, this model will not fit.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What You Leave With */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What you leave with</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {leaveWithCards.map(card => {
                    const Icon = card.icon;

                    return (
                      <Card key={card.title} className="bg-card rounded-2xl shadow-lg">
                        <CardContent className="p-8">
                          <Icon className="w-12 h-12 text-primary mb-6" />
                          <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          {/* 90-Day Build */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"
              >
                <div>
                  <span className="eyebrow-rule section-kicker text-gold">90-day build</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">90 days to build and launch your consulting offer</h2>
                </div>

                <div className="space-y-8 border-l border-foreground/10 pl-0 md:pl-8">
                  {buildSteps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="grid gap-3 md:grid-cols-[96px_minmax(0,1fr)]"
                    >
                      <div className="font-display text-5xl leading-none text-primary/55">{step.number}</div>
                      <div className="bg-background p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="mt-3 leading-7 text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Hard Filter */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto"
              >
                <div className="border border-foreground/10 bg-card p-8 shadow-sm">
                  <h2 className="text-3xl font-bold mb-5">Who this is for</h2>
                  <p className="text-muted-foreground mb-6">You&apos;re a fit if you:</p>
                  <ul className="space-y-3">
                    {fitBullets.map(bullet => (
                      <li key={bullet} className="flex items-start text-sm leading-6 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-foreground/10 bg-secondary/35 p-8 shadow-sm">
                  <h3 className="text-2xl font-bold mb-5">You are not a fit if you:</h3>
                  <ul className="space-y-3">
                    {notFitBullets.map(bullet => (
                      <li key={bullet} className="flex items-start text-sm leading-6 text-foreground">
                        <span className="mr-2 mt-1 inline-block h-2 w-2 rounded-full bg-gold flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Standards */}
          <section className="py-20 border-y border-foreground/10 bg-secondary/35">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">This is intentionally selective</h2>
                <div className="space-y-4 text-lg leading-8 text-muted-foreground">
                  <p>We are not building a large network.</p>
                  <p>We are building a credible one.</p>
                </div>
                <ul className="mt-8 space-y-3 border-t border-foreground/10 pt-6">
                  {standardsBullets.map(bullet => (
                    <li key={bullet} className="flex items-start text-sm leading-6 text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-lg leading-8 text-foreground">Most applicants will not be accepted.</p>
              </motion.div>
            </div>
          </section>

          {/* Application Section */}
          <section id="apply" className="py-20 bg-muted/50">
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
                    If you&apos;re serious about building a consulting practice tied to real AI work, apply. If you&apos;re still exploring, this is not the right step yet.
                  </p>
                </div>

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
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
