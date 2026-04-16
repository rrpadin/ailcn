import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Users, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const consultantSections = [
  {
    icon: Users,
    title: 'This is a business model, not a certification.',
    intro: 'You do not join AILCN to learn about AI. You join to build a consulting practice that sells and delivers it.',
    body: 'Start with a $1,500 AI Readiness Assessment. Use it to open larger consulting engagements ($10K-$50K+). Deliver using AILCN tools, frameworks, and ecosystem partners.',
    bullets: [
      'Structured offer you can sell immediately',
      'Clear path from first conversation to paid engagement',
      'Access to organizations already looking for credible AI execution',
    ],
    note: 'If you are not comfortable selling into business outcomes, this will not work.',
  },
  {
    icon: Award,
    title: 'A 90-day build phase to launch your consulting offer.',
    intro: 'This is not coursework. It is build + sell + deliver.',
    body: 'You will leave with a sellable AI Readiness Assessment, pricing, positioning, proposal structure, and tools to deliver and measure outcomes.',
    bullets: [
      'A sellable AI Readiness Assessment',
      'Pricing, positioning, and proposal structure',
      'Tools to deliver and measure outcomes',
    ],
    note: 'The expectation is not passive learning. The expectation is launching an offer you can take into the market.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Enter through application or snapshot',
    description: 'Consultants apply. Organizations start with a paid readiness assessment.',
  },
  {
    number: '02',
    title: 'We qualify aggressively',
    description: 'We filter for real operators, not surface-level AI familiarity.',
  },
  {
    number: '03',
    title: 'First deal comes early',
    description: 'Consultants are expected to land an initial paid engagement quickly using the AILCN entry offer.',
  },
  {
    number: '04',
    title: 'Expand into larger work',
    description: 'Engagements grow into implementation, performance tracking, and ongoing advisory.',
  },
];

const engagementOptions = [
  {
    icon: Shield,
    title: 'Consultants',
    description: 'You have 5+ years of experience and want to build an AI consulting practice tied to revenue.',
    cta: 'Apply',
    linkData: 'applyLink',
    fallbackUrl: '/consultants',
    clickType: 'apply_consultant_card',
    variant: 'default',
  },
  {
    icon: Award,
    title: 'Organizations',
    description: 'You need a clear, paid starting point before committing to AI investments.',
    cta: 'Start Snapshot',
    linkData: 'getStartedLink',
    fallbackUrl: '/organizations',
    clickType: 'start_assessment_card',
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
                    AI consulting should produce revenue, not just recommendations.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                    AILCN is a selective network for experienced professionals who want to sell and deliver AI work tied directly to business outcomes.
                  </p>
                  <p className="mt-4 max-w-2xl border-l-2 border-gold pl-4 text-sm uppercase tracking-[0.18em] text-foreground">
                    Not for trainers, course creators, or content-led consultants.
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
                      <p className="mt-2 leading-6">A path to package, price, and sell AI work tied to revenue and operating metrics.</p>
                    </div>
                    <div>
                      <div className="section-kicker text-foreground">For organizations</div>
                      <p className="mt-2 leading-6">A paid starting point before budget, vendors, and AI tooling decisions outrun business clarity.</p>
                    </div>
                    <div>
                      <div className="section-kicker text-foreground">For both</div>
                      <p className="mt-2 leading-6">Defined entry points, commercial discipline, and a path to measurable ROI.</p>
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
                        <p className="font-display text-2xl leading-tight text-foreground">AI is not the problem. Execution tied to revenue is.</p>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-muted-foreground">
                          <p>Most organizations are stuck between experimentation and impact.</p>
                          <p>Most consultants are stuck selling workshops instead of outcomes.</p>
                          <p>AILCN exists to fix both sides: give organizations a clear starting point tied to business metrics and give consultants a structured way to sell and deliver real AI work.</p>
                          <p className="text-foreground">Every engagement starts with a defined entry point and a path to measurable ROI.</p>
                        </div>
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

          {/* Consultant Section */}
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
                  <span className="eyebrow-rule section-kicker text-gold">Consultant model</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">This is a business model, not a certification.</h2>
                  <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
                    You do not join AILCN to learn about AI. You join to build a consulting practice that sells and delivers it.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {consultantSections.map(column => {
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
                        <p className="mt-6 border-t border-foreground/10 pt-5 text-sm leading-6 text-foreground">
                          {column.note}
                        </p>
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
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">Commercial entry first. Bigger work after.</h2>
                  <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
                    The point is not to create activity. The point is to create a paid entry offer that leads into larger, outcome-based engagements.
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
                  <span className="eyebrow-rule section-kicker text-gold">Entry points</span>
                  <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">There are only two valid entry points.</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                    If neither applies, this is not the right entry point.
                  </p>
                </div>

                <div className="grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 lg:grid-cols-2">
                  {engagementOptions.map(option => {
                    const Icon = option.icon;
                    const link = option.linkData === 'applyLink' ? applyLink : getStartedLink;

                    return (
                      <div key={option.title} className={`p-8 ${option.variant === 'default' ? 'ink-panel' : 'bg-background'}`}>
                        <div className="flex items-center justify-between">
                          <Icon className={`h-10 w-10 ${option.variant === 'default' ? 'text-gold' : 'text-primary'}`} />
                          <span className={`section-kicker ${option.variant === 'default' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {option.variant === 'default' ? 'Selective' : 'Open'}
                          </span>
                        </div>
                        <h3 className={`font-display mt-8 text-3xl leading-tight ${option.variant === 'default' ? 'text-primary-foreground' : 'text-foreground'}`}>{option.title}</h3>
                        <p className={`mt-4 min-h-[84px] text-lg leading-7 ${option.variant === 'default' ? 'text-primary-foreground/78' : 'text-muted-foreground'}`}>
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

          {/* Standards Section */}
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
                    <span className="eyebrow-rule section-kicker text-gold">Standards</span>
                    <h2 className="font-display mt-5 text-4xl leading-tight text-primary-foreground md:text-5xl">
                      We prioritize standards over volume.
                    </h2>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-primary-foreground/78">
                      This is not an open marketplace. We are building a network of consultants who can sell into real business problems, deliver measurable outcomes, and operate credibly with executive stakeholders.
                    </p>
                  </div>

                  <div className="space-y-px bg-white/10">
                    <div className="bg-white/5 p-6">
                      <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/88">What the network requires</p>
                      <ul className="mt-5 space-y-4 text-sm leading-6 text-primary-foreground/72">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>Sell into real business problems</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>Deliver measurable outcomes</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>Operate credibly with executive stakeholders</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white/5 p-6">
                      <p className="font-display text-3xl leading-tight text-gold">
                        That means fewer people, higher expectations, and real accountability.
                      </p>
                    </div>
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
                  Consultants can apply if they want to build an AI consulting practice tied to revenue. Organizations can start with a paid AI Readiness Snapshot before making larger AI investments.
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
