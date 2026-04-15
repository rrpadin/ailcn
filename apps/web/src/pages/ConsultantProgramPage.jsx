import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  Network,
  Rocket,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const unlocks = [
  {
    icon: Briefcase,
    title: 'A clear, scalable consulting model',
    description:
      "Stop guessing what to sell. You'll gain a structured, repeatable model to position yourself as an AI Learning Advisor, package high-value services, and move from one-off training work into strategic engagements.",
    bullets: [
      'Position yourself as an AI Learning Advisor',
      'Package high-value services organizations actually need',
      'Move from one-off training into strategic consulting engagements',
    ],
  },
  {
    icon: Rocket,
    title: 'A 90-day certification that builds your business',
    description:
      "This is not theory. This is execution. Inside the program, you'll build client-ready diagnostics, proposals, offers, and pricing you can immediately use.",
    bullets: [
      'Develop client-ready diagnostics and proposals',
      'Build your consulting offer and pricing structure',
      'Create real-world deliverables you can immediately use',
    ],
  },
  {
    icon: BarChart3,
    title: 'Access to the AILCN technology ecosystem',
    description:
      'You will not just advise. You will bring solutions through Learnfinity Pro, ExpandLMS, and ExpandPro.ai so you can deliver enterprise-level outcomes without building your own tech stack.',
    bullets: [
      'Learnfinity Pro for AI-powered learning delivery',
      'ExpandLMS for scalable learning infrastructure',
      'ExpandPro.ai for performance tracking and impact analytics',
    ],
  },
  {
    icon: DollarSign,
    title: 'Revenue and commission opportunities',
    description:
      "This is more than certification. It's a revenue model. You are not starting from zero; you are stepping into a monetized ecosystem.",
    bullets: [
      'Earn from consulting engagements',
      'Generate commissions from platform adoption',
      'Participate in ongoing client solutions',
    ],
  },
];

const programDetails = [
  {
    step: '01',
    title: 'Your first offer: AI Readiness Assessment',
    description:
      'Start immediately with a clear entry point. You will be equipped to offer an AI Readiness Assessment with a $1,500 starting point and a natural pathway into larger consulting engagements.',
  },
  {
    step: '02',
    title: 'Build tools that speak to executives',
    description:
      'Use diagnostics and frameworks tied to time to competency, performance improvement, revenue per employee or learner, and AI workforce readiness. These are business metrics leaders care about.',
  },
  {
    step: '03',
    title: 'Package, price, and position your practice',
    description:
      'Turn your expertise into a structured consulting offer with pricing, proposals, and language designed for strategic advisory work instead of generic training engagements.',
  },
  {
    step: '04',
    title: 'Leave with market-ready proof',
    description:
      'You do not leave with notes. You leave ready to sell and deliver, backed by AILCN certification assets that help you signal substance in a crowded market.',
  },
];

const supportItems = [
  'A growing network of consultants and collaboration opportunities',
  'Continued tools, frameworks, and updates',
  'Potential involvement in real client engagements',
  'Partial or full tuition reimbursement based on successful client referral and onboarding',
  'Flexible payment options, including Buy Now, Pay Later through select partners',
];

const audience = [
  'Consultants ready to modernize their offering',
  'L&D leaders who want to step into advisory roles',
  'Coaches, trainers, and educators seeking higher-value work',
  'Professionals ready to build a scalable, AI-aligned practice',
];

const ConsultantProgramPage = () => {
  useEffect(() => {
    pb.collection('analytics_events').create({
      event_type: 'page_view',
      page: 'consultant_program',
      timestamp: new Date().toISOString()
    }, { $autoCancel: false }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Consultant Certification Program | AILCN</title>
        <meta
          name="description"
          content="Explore the AILCN consultant certification program, including the consulting model, technology ecosystem, revenue opportunities, and credentials."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative overflow-hidden radial-wash py-20 md:py-24">
            <div className="absolute inset-0 paper-grid opacity-35" />
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
              >
                <div>
                  <span className="section-kicker text-gold">Consultant program</span>
                  <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.92] text-foreground md:text-7xl" style={{ letterSpacing: '-0.03em' }}>
                    Build a high-income, AI-powered consulting practice.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                    You&apos;ve already taken the first step. Now it&apos;s time to move from interest to execution. The AILCN Certification is designed for professionals who want to go beyond traditional training and step into a strategic advisory role.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link to="/consultants#apply">
                      <Button size="lg" className="w-full rounded-none border border-primary bg-primary px-7 py-6 text-sm uppercase tracking-[0.22em] shadow-[8px_8px_0_hsl(var(--gold)/0.18)] sm:w-auto">
                        Submit Your Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/consultants">
                      <Button size="lg" variant="outline" className="w-full rounded-none border-foreground/30 bg-transparent px-7 py-6 text-sm uppercase tracking-[0.18em] sm:w-auto">
                        Back to Consultant Page
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 top-6 hidden h-24 w-24 border border-gold/40 lg:block" />
                  <div className="relative overflow-hidden border border-foreground/10 bg-background/90 p-4 shadow-[20px_20px_0_hsl(var(--gold)/0.10)]">
                    <img
                      src="/expandpro-consultant-dashboard.png"
                      alt="ExpandPro consultant dashboard"
                      className="w-full rounded-xl border border-foreground/10"
                    />
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="border border-foreground/10 bg-secondary/45 p-4">
                        <div className="section-kicker text-gold">Technology ecosystem</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Bring executive-facing AI readiness, performance, and workforce metrics into your consulting work from day one.
                        </p>
                      </div>
                      <div className="ink-panel p-4">
                        <div className="section-kicker text-primary-foreground/75">Monetized model</div>
                        <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                          Consulting revenue, platform commissions, and longer-term client solution opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="max-w-2xl">
                  <span className="eyebrow-rule section-kicker text-gold">What this unlocks</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                    A certification designed to build your business, not just add another badge.
                  </h2>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                  {unlocks.map(item => {
                    const Icon = item.icon;

                    return (
                      <Card key={item.title} className="border border-foreground/10 shadow-none">
                        <CardContent className="p-8">
                          <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-5">
                            <Icon className="h-10 w-10 text-primary" />
                            <span className="section-kicker text-muted-foreground">AILCN program</span>
                          </div>
                          <h3 className="font-display mt-6 text-3xl leading-tight">{item.title}</h3>
                          <p className="mt-4 leading-7 text-muted-foreground">{item.description}</p>
                          <ul className="mt-6 space-y-3 border-t border-foreground/10 pt-5">
                            {item.bullets.map(bullet => (
                              <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="border-y border-foreground/10 bg-secondary/45 py-20 md:py-24">
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
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                    A more detailed look at what the program helps you build.
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                    This is about execution. You will build the tools, offers, and credibility needed to move into strategic advisory work with a practical, monetized entry point.
                  </p>
                </div>

                <div className="space-y-8 border-l border-foreground/10 pl-0 md:pl-8">
                  {programDetails.map((detail, index) => (
                    <motion.div
                      key={detail.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="grid gap-3 md:grid-cols-[96px_minmax(0,1fr)]"
                    >
                      <div className="font-display text-5xl leading-none text-primary/55">{detail.step}</div>
                      <div className="bg-background p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">{detail.title}</h3>
                        <p className="mt-3 leading-7 text-muted-foreground">{detail.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="border border-foreground/10 bg-card p-8 md:p-10">
                  <span className="eyebrow-rule section-kicker text-gold">Credibility and market position</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                    Move from being seen as a trainer to being trusted as a strategic advisor.
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                    As a Certified AILCN Consultant, you stand at the intersection of AI, learning and development, and business performance. The goal is not just certification. The goal is better positioning, stronger offers, and a clearer route to revenue.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="border border-foreground/10 bg-secondary/35 p-5">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary" />
                        <p className="font-semibold">Tuition reimbursement opportunity</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Partial or full reimbursement may be available based on successful client referral and onboarding. In many cases, the program can pay for itself.
                      </p>
                    </div>
                    <div className="border border-foreground/10 bg-secondary/35 p-5">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-primary" />
                        <p className="font-semibold">Flexible payment options</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Buy Now, Pay Later options are available through select partners to reduce barriers to entry.
                      </p>
                    </div>
                    <div className="border border-foreground/10 bg-secondary/35 p-5">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <p className="font-semibold">Proven tools for executives</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Lead with time to competency, performance improvement, revenue per employee or learner, and AI workforce readiness.
                      </p>
                    </div>
                    <div className="border border-foreground/10 bg-secondary/35 p-5">
                      <div className="flex items-center gap-3">
                        <Network className="h-5 w-5 text-primary" />
                        <p className="font-semibold">Ongoing support and network access</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Stay connected to a growing consultant network, updated tools, collaboration opportunities, and potential involvement in client work.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="overflow-hidden border border-foreground/10 bg-background p-4 shadow-sm">
                    <img
                      src="/medina-certificate.png"
                      alt="AILCN certificate of completion"
                      className="w-full rounded-lg border border-foreground/10"
                    />
                  </div>
                  <div className="ink-panel flex items-center gap-5 p-6">
                    <img
                      src="/certified-ailcn-badge.png"
                      alt="Certified AILCN Consultant badge"
                      className="h-28 w-28 rounded-full bg-white/5 object-contain"
                    />
                    <div>
                      <div className="section-kicker text-primary-foreground/75">Certification assets</div>
                      <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
                        Use the certificate and badge to reinforce your market position and show that your work is backed by a real standard.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-8 lg:grid-cols-2"
              >
                <Card className="border border-foreground/10 shadow-none">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-6 w-6 text-primary" />
                      <h3 className="font-display text-3xl">Who this is for</h3>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {audience.map(item => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-foreground/10 shadow-none">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <h3 className="font-display text-3xl">What continues after certification</h3>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {supportItems.map(item => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border border-foreground/10 bg-secondary/40 p-8 text-center md:p-12"
              >
                <span className="section-kicker text-gold">Next step</span>
                <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                  Complete the process and secure your spot.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  This is not about adding another certification. It is about building a capability, a business, and a position in a rapidly shifting market.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link to="/consultants#apply">
                    <Button size="lg" className="w-full rounded-none border border-primary bg-primary px-7 py-6 text-sm uppercase tracking-[0.22em] shadow-[8px_8px_0_hsl(var(--gold)/0.18)] sm:w-auto">
                      Submit Your Application
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <a href="https://tally.so/r/Pd9WW1" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="w-full rounded-none border-foreground/30 bg-transparent px-7 py-6 text-sm uppercase tracking-[0.18em] sm:w-auto">
                      Start Assessment
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ConsultantProgramPage;
