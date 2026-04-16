import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const ASSESSMENT_URL = 'https://tally.so/r/vGyArl';

const executionStats = [
  {
    value: '50%',
    title: 'Time to competency',
    description: 'When AI is aligned to role-based workflows',
  },
  {
    value: '20-30%',
    title: 'Performance improvement',
    description: 'In targeted areas when execution is scoped correctly',
  },
  {
    value: '2-5X',
    title: 'Return on focused initiatives',
    description: 'When learning is tied directly to business outcomes',
  },
  {
    value: 'Lower',
    title: 'Tool redundancy',
    description: 'Reduced unnecessary spend and overlapping systems',
  },
  {
    value: 'Higher',
    title: 'Adoption',
    description: 'When use cases are clearly defined from the start',
  },
];

const approachCards = [
  {
    title: 'Clarity before commitment',
    description: 'No premature investment in tools or vendors.',
  },
  {
    title: 'Structured execution',
    description: 'Work begins with defined scope, not assumptions.',
  },
  {
    title: 'Accountability to outcomes',
    description: 'Every engagement is tied to measurable business impact.',
  },
];

const OrganizationLandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization_name: '',
    industry: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    pb.collection('analytics_events')
      .create(
        {
          event_type: 'page_view',
          page: 'organization_landing',
          timestamp: new Date().toISOString(),
        },
        { $autoCancel: false }
      )
      .catch(() => {});
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await pb.collection('applications').create(
        {
          type: 'organization',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization_name: formData.organization_name,
          industry: formData.industry,
          message: formData.message,
          status: 'pending',
        },
        { $autoCancel: false }
      );

      pb.collection('analytics_events')
        .create(
          {
            event_type: 'assessment_start',
            page: 'organization_landing',
            metadata: JSON.stringify({ type: 'organization' }),
            timestamp: new Date().toISOString(),
          },
          { $autoCancel: false }
        )
        .catch(() => {});

      toast.success('Information submitted! Your assessment is ready below.');
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>For organizations - AILCN</title>
        <meta
          name="description"
          content="Start with a defined AI readiness assessment to identify where AI can improve performance and support real execution."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Stop experimenting with AI. Start executing where it matters.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto">
                  Most organizations don&apos;t need more tools or ideas.
                  They need clarity on where AI will actually improve performance and how to implement it without wasted time or budget.
                </p>
                <p className="text-lg leading-8 text-foreground mb-8">
                  Every engagement starts with a defined, paid assessment.
                </p>
                <div className="flex justify-center">
                  <a href="#apply">
                    <Button size="lg" className="min-w-72">
                      Start AI Readiness Assessment Application
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <span className="eyebrow-rule section-kicker text-gold">The problem</span>
                <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                  AI isn&apos;t the problem. Execution is.
                </h2>
                <div className="mt-5 space-y-4 text-lg leading-8 text-muted-foreground">
                  <p>Teams move between pilots, vendors, and internal discussions without a clear baseline.</p>
                  <p>Initiatives stall because there&apos;s no shared definition of success or prioritization.</p>
                </div>

                <div className="mt-10 border border-foreground/10 bg-secondary/35 p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">The result:</p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Fragmented efforts</span>
                    </li>
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Unclear ROI</span>
                    </li>
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Low adoption despite investment</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 border-y border-foreground/10 bg-secondary/35">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto"
              >
                <div className="max-w-3xl">
                  <span className="eyebrow-rule section-kicker text-gold">What works</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                    Execution only works when it&apos;s scoped correctly
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                    When AI is aligned to real workflows and measured against business outcomes, organizations typically see:
                  </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {executionStats.map((stat, index) => (
                    <Card
                      key={stat.title}
                      className={`rounded-2xl border border-foreground/10 bg-background/90 shadow-sm ${
                        index === executionStats.length - 1
                          ? 'md:col-span-2 md:max-w-xl md:justify-self-center xl:col-span-1 xl:max-w-none'
                          : ''
                      }`}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="text-5xl font-bold text-gold mb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {stat.value}
                        </div>
                        <p className="font-medium mb-2 uppercase tracking-[0.14em]">{stat.title}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{stat.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <p className="mt-10 text-lg leading-8 text-foreground max-w-3xl">
                  These outcomes depend on getting the starting point right.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[0.85fr_1.15fr]"
              >
                <div>
                  <span className="eyebrow-rule section-kicker text-gold">Mandatory first step</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                    AI Readiness Assessment
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                    Before selecting tools, hiring vendors, or launching initiatives, a clear baseline is required.
                  </p>
                </div>

                <div className="border border-foreground/10 bg-card p-8 shadow-sm">
                  <p className="text-lg leading-8 text-muted-foreground">
                    This is a fixed-scope, paid engagement designed to define:
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Where AI can create measurable impact</span>
                    </li>
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Which use cases are worth prioritizing</span>
                    </li>
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>What constraints must be addressed</span>
                    </li>
                    <li className="flex items-start text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>What a realistic execution path looks like</span>
                    </li>
                  </ul>
                  <p className="mt-6 text-sm leading-6 text-foreground">
                    This is not a workshop or exploratory session. It is a structured diagnostic used to support real decisions.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-foreground">Typical starting point: $1,500</p>
                  <div className="mt-8">
                    <a href="#apply">
                      <Button size="lg" className="w-full sm:w-auto">
                        Start AI Readiness Assessment Application
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 border-y border-foreground/10 bg-secondary/35">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <span className="eyebrow-rule section-kicker text-gold">What happens next</span>
                <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                  Execution follows clarity
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">After the assessment:</p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start text-sm leading-6 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span>Priorities are defined</span>
                  </li>
                  <li className="flex items-start text-sm leading-6 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span>Scope is clear</span>
                  </li>
                  <li className="flex items-start text-sm leading-6 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span>The right consultant is assigned based on the work</span>
                  </li>
                </ul>
                <p className="mt-8 text-lg leading-8 text-muted-foreground">
                  Consultants are only engaged once there is a validated problem and a defined path forward.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto"
              >
                <span className="eyebrow-rule section-kicker text-gold">Why this approach</span>
                <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">Clarity before commitment</h2>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {approachCards.map(card => (
                    <Card key={card.title} className="rounded-2xl border border-foreground/10 shadow-sm">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                        <p className="text-sm leading-6 text-muted-foreground">{card.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

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
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    If AI is a priority, clarity comes first.
                  </h2>
                  <p className="text-muted-foreground">
                    Start with a defined assessment. Everything else follows from there.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <a href="#apply">
                      <Button size="lg" className="min-w-72">
                        Start AI Readiness Assessment Application
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        submitted ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {submitted ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-sm font-medium">Your info</span>
                  </div>
                  <div className={`h-px w-12 ${submitted ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        submitted ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      2
                    </div>
                    <span className={`text-sm font-medium ${submitted ? '' : 'text-muted-foreground'}`}>
                      Take assessment
                    </span>
                  </div>
                </div>

                {!submitted ? (
                  <Card className="shadow-lg rounded-2xl">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">
                            Your name
                          </Label>
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
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email address
                          </Label>
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
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Phone number
                          </Label>
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
                          <Label htmlFor="organization_name" className="text-sm font-medium">
                            Organization name
                          </Label>
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
                          <Label htmlFor="industry" className="text-sm font-medium">
                            Industry
                          </Label>
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
                          <Label htmlFor="message" className="text-sm font-medium">
                            What are you trying to achieve with AI?
                          </Label>
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
                          {isSubmitting ? 'Submitting...' : 'Start AI Readiness Assessment Application'}
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
                        <h3 className="text-2xl font-bold mb-3">You&apos;re all set, {formData.name.split(' ')[0]}!</h3>
                        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
                          Your information has been saved. Click below to take your AI readiness assessment. It takes about 15 minutes and supports the next real decision.
                        </p>
                        <a href={ASSESSMENT_URL} target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                            Start AI Readiness Assessment Application
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
