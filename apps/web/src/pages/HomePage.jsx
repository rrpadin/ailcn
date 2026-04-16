import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Users, Award, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const audienceColumns = [
  {
    icon: Users,
    title: 'For consultants',
    intro: 'Prove you can lead AI work that survives contact with reality.',
    body: 'Our certification path is built for practitioners who want rigor, signal, and access to serious organizations instead of another badge mill.',
    bullets: [
      'Structured certification with live application, not passive coursework',
      'Exposure to organizations that already know they need credible AI help',
      'A network standard that makes your work easier to trust',
    ],
  },
  {
    icon: TrendingUp,
    title: 'For organizations',
    intro: 'Start with an honest read on where AI can actually move the business.',
    body: 'The AI Readiness Snapshot clarifies capability, gaps, and priorities before you spend time or budget on the wrong engagement.',
    bullets: [
      'A practical readiness snapshot grounded in execution',
      'Matching based on fit, not whoever shouts the loudest',
      'A clearer path from exploration to implementation',
    ],
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Apply or take the snapshot',
    description: 'Consultants complete the application assessment. Organizations take the AI Readiness Snapshot to establish baseline maturity and opportunity.',
  },
  {
    number: '02',
    title: 'We assess with teeth',
    description: 'We review substance, not polish. Experience, operating judgment, and evidence matter more than buzzwords or résumé theater.',
  },
  {
    number: '03',
    title: 'We shape the right match',
    description: 'Consultants enter the certification path. Organizations get clarity on needs, constraints, and where vetted expertise can create traction.',
  },
  {
    number: '04',
    title: 'The work begins on firmer ground',
    description: 'Instead of starting from vague ambition, both sides move forward with standards, shared language, and a more credible path to outcomes.',
  },
];

const engagementOptions = [
  {
    icon: Award,
    title: 'AI Readiness Snapshot',
    description: 'A fast, plainspoken diagnostic for leadership teams that need signal before strategy decks.',
    cta: 'Start AI Readiness Snapshot',
    linkData: 'getStartedLink',
    fallbackUrl: '/organizations',
    clickType: 'start_assessment_card',
    variant: 'outline',
  },
  {
    icon: Shield,
    title: 'Consultant certification',
    description: 'A selective path for consultants who want to be measured by the quality of the work, not the size of the claim.',
    cta: 'Apply now',
    linkData: 'applyLink',
    fallbackUrl: '/consultants',
    clickType: 'apply_consultant_card',
    variant: 'default',
  },
  {
    icon: Sparkles,
    title: 'Direct engagement',
    description: 'Already know the shape of the problem? Bring us in for a direct conversation on enterprise AI priorities and execution.',
    cta: 'Contact us',
    linkData: 'bookConsultationLink',
    fallbackUrl: '/contact',
    clickType: 'contact_us_card',
    variant: 'outline',
  },
];

const proofPoints = [
  {
    value: '50%',
    title: 'Time to competency',
    description: 'Faster when AI is aligned to role-based workflows',
  },
  {
    value: '25%+',
    title: 'Performance improvement',
    description: 'Within the first 90 days of implementation',
  },
  {
    value: '2-5X',
    title: 'Return on AI investment',
    description: 'When learning is tied directly to business outcomes',
  },
  {
    value: '40%',
    title: 'Reduction in tool waste',
    description: 'From eliminating fragmented AI usage',
  },
  {
    value: '80%+',
    title: 'Increase in AI adoption and trust',
    description: 'When governance and workflows are clearly defined',
  },
];

const DynamicLink = ({ linkData, fallbackUrl, onClick, children, className }) => {
  const url = linkData?.url || fallbackUrl;
  const isExternal = linkData?.link_type === 'external' || url.startsWith('http');
  const target = linkData?.open_in_new_tab ? '_blank' : undefined;
  const rel = linkData?.open_in_new_tab ? 'noopener noreferrer' : undefined;

  if (isExternal) {
    return (
      <a href={url} target={target} rel={rel} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={url} target={target} rel={rel} onClick={onClick} className={className}>
      {children}
    </Link>
  );
};

const HomePage = () => {
  const applyLink = {
    url: 'https://tally.so/r/Pd9WW1',
    link_type: 'external',
    open_in_new_tab: true,
  };

  const getStartedLink = {
    url: 'https://tally.so/r/vGyArl',
    link_type: 'external',
    open_in_new_tab: true,
  };

  const bookConsultationLink = {
    url: 'https://calendly.com/exitouinc/initial-consultation',
    link_type: 'external',
    open_in_new_tab: true,
  };

  useEffect(() => {
    pb.collection('analytics_events').create({
      event_type: 'page_view',
      page: 'homepage',
      timestamp: new Date().toISOString()
    }, {
      $autoCancel: false
    }).catch(() => { });
  }, []);

  const handleCTAClick = ctaType => {
    pb.collection('analytics_events').create({
      event_type: 'cta_click',
      page: 'homepage',
      metadata: JSON.stringify({ cta_type: ctaType }),
      timestamp: new Date().toISOString()
    }, {
      $autoCancel: false
    }).catch(() => { });
  };

  return (
    <>
      <Helmet>
        <title>AILCN - AI Learning Consultant Network</title>
        <meta name="description" content="Join the exclusive network of certified AI consultants and organizations leading the AI transformation." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden radial-wash">
            <div className="absolute inset-0 paper-grid opacity-40" />
            <div className="absolute left-[-10%] top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute right-[-8%] bottom-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="container relative mx-auto px-4 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end"
              >
                <div className="max-w-3xl">
                  <span className="eyebrow-rule section-kicker text-gold">A network with standards</span>
                  <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.92] text-foreground md:text-7xl lg:text-[5.5rem]" style={{ letterSpacing: '-0.03em' }}>
                    AI guidance should feel more like a charter than a sales funnel.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                    AILCN certifies consultants who can deliver real transformation and gives organizations an honest starting point before the expensive decisions begin.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <DynamicLink
                      linkData={applyLink}
                      fallbackUrl="/consultants"
                      onClick={() => handleCTAClick('apply_consultant')}
                    >
                      <Button size="lg" className="w-full rounded-none border border-primary bg-primary px-7 py-6 text-sm uppercase tracking-[0.22em] shadow-[8px_8px_0_hsl(var(--gold)/0.18)] sm:w-auto">
                        Apply as consultant
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </DynamicLink>

                    <DynamicLink
                      linkData={getStartedLink}
                      fallbackUrl="/organizations"
                      onClick={() => handleCTAClick('start_assessment')}
                    >
                      <Button size="lg" variant="outline" className="w-full rounded-none border-foreground/30 bg-transparent px-7 py-6 text-sm uppercase tracking-[0.18em] sm:w-auto">
                        Start AI Readiness Snapshot
                      </Button>
                    </DynamicLink>
                  </div>
                  <div className="mt-10 grid max-w-2xl gap-6 border-t border-foreground/10 pt-6 text-sm text-muted-foreground sm:grid-cols-3">
                    <div>
                      <div className="section-kicker text-foreground">For consultants</div>
                      <p className="mt-2 leading-6">A rigorous path built to separate practiced operators from polished talkers.</p>
                    </div>
                    <div>
                      <div className="section-kicker text-foreground">For organizations</div>
                      <p className="mt-2 leading-6">A clearer baseline before budget, vendors, and internal politics start shaping the conversation.</p>
                    </div>
                    <div>
                      <div className="section-kicker text-foreground">For both</div>
                      <p className="mt-2 leading-6">Higher standards, better matching, and fewer expensive guesses.</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 top-8 hidden h-24 w-24 border border-gold/40 lg:block" />
                  <div className="absolute -right-4 bottom-6 hidden h-32 w-32 border border-primary/20 lg:block" />
                  <div className="relative border border-foreground/10 bg-background/85 p-6 shadow-[18px_18px_0_hsl(var(--gold)/0.10)] backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <p className="section-kicker text-gold">Why this exists</p>
                      <img
                        src="/ailcn-icon.png"
                        alt="AILCN logo"
                        className="h-16 w-16 rounded-2xl shadow-[0_10px_25px_rgba(45,62,112,0.18)]"
                      />
                    </div>
                    <div className="mt-4 space-y-5">
                      <div className="border-l-2 border-gold pl-4">
                        <p className="font-display text-2xl leading-tight text-foreground">AI is not the problem. Execution is.</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Most organizations are stuck between experimentation and real impact. AILCN exists to close that gap with role-based workflows, clearer governance, and measurable business outcomes.
                        </p>
                      </div>
                      <div className="grid gap-4 border-t border-foreground/10 pt-5 sm:grid-cols-2">
                        {proofPoints.map((point, index) => (
                          <div
                            key={point.title}
                            className={index === proofPoints.length - 1 ? 'sm:col-span-2 sm:max-w-sm sm:justify-self-center' : undefined}
                          >
                            <div className="font-display text-4xl leading-none text-primary">{point.value}</div>
                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-foreground">{point.title}</p>
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">{point.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Audience Section */}
          <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]"
              >
                <div>
                  <span className="eyebrow-rule section-kicker text-gold">Two entry points</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">Different audiences. Same demand for substance.</h2>
                  <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
                    The site should feel less like a software checkout flow and more like an institution setting expectations. This section does that work upfront.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {audienceColumns.map(column => {
                    const Icon = column.icon;

                    return (
                      <article key={column.title} className="border border-foreground/10 bg-card p-8 shadow-[0_1px_0_hsl(var(--foreground)/0.08)]">
                        <div className="flex items-center justify-between border-b border-foreground/10 pb-5">
                          <Icon className="h-8 w-8 text-primary" />
                          <span className="section-kicker text-muted-foreground">AILCN track</span>
                        </div>
                        <h3 className="font-display mt-6 text-3xl leading-tight">{column.title}</h3>
                        <p className="mt-3 text-base leading-7 text-foreground">{column.intro}</p>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">{column.body}</p>
                        <ul className="mt-6 space-y-3 border-t border-foreground/10 pt-5">
                          {column.bullets.map(bullet => (
                            <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="border-y border-foreground/10 bg-secondary/45 py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"
              >
                <div>
                  <span className="eyebrow-rule section-kicker text-gold">How it works</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">A process designed to slow down bad decisions.</h2>
                  <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
                    We are not trying to manufacture urgency. The goal is to improve fit, sharpen expectations, and reduce noise before the real work starts.
                  </p>
                </div>

                <div className="space-y-8 border-l border-foreground/10 pl-0 md:pl-8">
                  {processSteps.map((step, index) => (
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

          {/* Ways to Engage Section */}
          <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div className="max-w-2xl">
                  <span className="eyebrow-rule section-kicker text-gold">Ways to engage</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">Choose the path that matches the work in front of you.</h2>
                </div>

                <div className="grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 lg:grid-cols-3">
                  {engagementOptions.map(option => {
                    const Icon = option.icon;
                    const link = option.linkData === 'applyLink' ? applyLink : option.linkData === 'getStartedLink' ? getStartedLink : bookConsultationLink;

                    return (
                      <div key={option.title} className={`p-8 ${option.variant === 'default' ? 'ink-panel' : 'bg-background'}`}>
                        <div className="flex items-center justify-between">
                          <Icon className={`h-10 w-10 ${option.variant === 'default' ? 'text-gold' : 'text-primary'}`} />
                          <span className={`section-kicker ${option.variant === 'default' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {option.variant === 'default' ? 'Selective' : 'Open'}
                          </span>
                        </div>
                        <h3 className={`font-display mt-8 text-3xl leading-tight ${option.variant === 'default' ? 'text-primary-foreground' : 'text-foreground'}`}>{option.title}</h3>
                        <p className={`mt-4 min-h-[84px] leading-7 ${option.variant === 'default' ? 'text-primary-foreground/78' : 'text-muted-foreground'}`}>
                          {option.description}
                        </p>
                        <div className="mt-8">
                          <DynamicLink linkData={link} fallbackUrl={option.fallbackUrl} onClick={() => handleCTAClick(option.clickType)}>
                            <Button
                              variant={option.variant}
                              className={`w-full rounded-none px-5 py-6 text-xs uppercase tracking-[0.2em] ${
                                option.variant === 'default'
                                  ? 'border border-gold/40 bg-gold text-primary shadow-none hover:bg-gold/90'
                                  : 'border-foreground/20 bg-transparent'
                              }`}
                            >
                              {option.cta}
                            </Button>
                          </DynamicLink>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Authority & Proof Section */}
          <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="ink-panel overflow-hidden border border-foreground/10"
              >
                <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16">
                  <div>
                    <span className="eyebrow-rule section-kicker text-gold">Proof and posture</span>
                    <h2 className="font-display mt-5 text-4xl leading-tight text-primary-foreground md:text-5xl">
                      Built by people who have seen what bad AI buying decisions cost.
                    </h2>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-primary-foreground/78">
                      The value of the network is not just access. It is selectivity, candor, and the discipline to tell both consultants and organizations when something is not ready yet.
                    </p>
                  </div>

                  <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
                    {proofPoints.map((point, index) => (
                      <div
                        key={point.title}
                        className={`bg-white/5 p-6 ${index === proofPoints.length - 1 ? 'sm:col-span-2 xl:col-span-1' : ''}`}
                      >
                        <div className="font-display text-5xl text-gold">{point.value}</div>
                        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-primary-foreground/88">{point.title}</p>
                        <p className="mt-3 text-sm leading-6 text-primary-foreground/68">{point.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Charter/Exclusivity Section */}
          <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="border border-foreground/10 bg-card p-8 md:p-10">
                  <span className="eyebrow-rule section-kicker text-gold">Charter</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">A selective network by design.</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                    We keep standards high because both sides pay for weak filtering. Not every consultant belongs in the network. Not every organization is ready for the same kind of intervention.
                  </p>
                </div>
                <div className="border-l-4 border-gold bg-secondary/55 p-8 md:p-10">
                  <p className="font-display text-3xl leading-tight text-foreground">
                    When an AILCN consultant is in the room, the expectation is not inspiration. It is delivery.
                  </p>
                  <p className="mt-5 leading-7 text-muted-foreground">
                    When an organization comes through AILCN, the expectation is not vague curiosity. It is a clearer understanding of readiness, stakes, and what competent help should look like.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border border-foreground/10 bg-secondary/40 p-8 text-center md:p-12"
              >
                <span className="section-kicker text-gold">Ready to get started?</span>
                <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">Pick the track that fits the work ahead.</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Consultants can apply through the assessment path. Organizations can begin with the AI Readiness Snapshot and get a more grounded next step.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <DynamicLink
                    linkData={applyLink}
                    fallbackUrl="/consultants"
                    onClick={() => handleCTAClick('apply_consultant_final')}
                  >
                    <Button size="lg" className="w-full rounded-none border border-primary bg-primary px-7 py-6 text-sm uppercase tracking-[0.22em] shadow-[8px_8px_0_hsl(var(--gold)/0.18)] sm:w-auto">
                      Apply as consultant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </DynamicLink>

                  <DynamicLink
                    linkData={getStartedLink}
                    fallbackUrl="/organizations"
                    onClick={() => handleCTAClick('start_assessment_final')}
                  >
                    <Button size="lg" variant="outline" className="w-full rounded-none border-foreground/30 bg-transparent px-7 py-6 text-sm uppercase tracking-[0.18em] sm:w-auto">
                      Start AI Readiness Snapshot
                    </Button>
                  </DynamicLink>
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

export default HomePage;
