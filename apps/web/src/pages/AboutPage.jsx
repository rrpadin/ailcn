import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Target, Eye, Shield, Users, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const AboutPage = () => {
  useEffect(() => {
    pb.collection('analytics_events').create({
      event_type: 'page_view',
      page: 'about',
      timestamp: new Date().toISOString()
    }, { $autoCancel: false }).catch(() => {});
  }, []);

  const values = [
    {
      icon: Shield,
      title: 'Rigor over credentials',
      description: 'We care about what consultants can actually deliver, not the letters after their name. Our certification is earned through real-world projects and measurable outcomes.'
    },
    {
      icon: Target,
      title: 'Precision matching',
      description: 'Generic advice creates generic results. We assess every organization and consultant so that matches are based on fit, not availability.'
    },
    {
      icon: Eye,
      title: 'Radical transparency',
      description: 'We tell organizations exactly where they stand on AI readiness. We tell consultants exactly what the bar is. No ambiguity, no surprises.'
    },
    {
      icon: Users,
      title: 'Selective by design',
      description: 'Quality degrades at scale when standards slip. We maintain a high bar for entry so the network retains its value for everyone inside it.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About | AILCN - AI Leadership Certification Network</title>
        <meta name="description" content="AILCN was built by AI practitioners who got tired of watching organizations waste money on unvetted consultants. Learn about our mission, values, and how we built a better way." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">

          {/* Hero */}
          <section className="relative py-24 md:py-32 flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1531482615713-2afd69097998)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-background/97 via-background/93 to-background/80" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">About AILCN</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                  We built the network we wished existed
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  AILCN was founded by AI practitioners who watched too many organizations burn budget on consultants who couldn't deliver. We built a better way — rigorous certification, precise matching, and a network held to a real standard.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To close the gap between AI potential and AI reality. Most organizations know they need to adopt AI — few know how to do it well. We exist to connect them with the consultants who have actually done it, in a way that creates accountability on both sides.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A world where AI leadership is a defined, verifiable skill — not a buzzword. Where organizations can confidently invest in transformation because the people guiding them have been tested, not just recommended.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* The Problem We Solve */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8">The problem we solve</h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p className="text-lg">
                    The AI consulting market is flooded. Anyone can put "AI strategy" on a LinkedIn profile. Organizations have no reliable way to tell who can actually deliver — and consultants with real expertise have no credible signal to set themselves apart.
                  </p>
                  <p>
                    The result: organizations overpay for underwhelming engagements. Capable consultants compete on price instead of value. And AI transformation stalls because the foundation of trust isn't there.
                  </p>
                  <p>
                    AILCN fixes the signal problem. Our certification process is rigorous enough that passing it means something. Our matching process is precise enough that engagements start with the right fit. And our network is selective enough that being in it matters.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What we stand for</h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {values.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="h-full shadow-md rounded-2xl transition-all duration-200 hover:shadow-lg">
                        <CardContent className="p-8">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                            <value.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The network in numbers</h2>
                <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                  These numbers reflect our commitment to only certifying consultants who can actually deliver.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>87%</div>
                    <p className="font-medium mb-1">Implementation success rate</p>
                    <p className="text-sm text-muted-foreground">Across all certified consultant engagements</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>142</div>
                    <p className="font-medium mb-1">Certified consultants</p>
                    <p className="text-sm text-muted-foreground">Active members who passed our rigorous program</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>$2.4M</div>
                    <p className="font-medium mb-1">Average value delivered</p>
                    <p className="text-sm text-muted-foreground">Per engagement, measured against client goals</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Who Built This */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by practitioners</h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p className="text-lg">
                    AILCN wasn't built by academics or marketers. It was built by people who spent years in the field leading AI transformations — who understood first-hand what the gap looked like between consultant claims and actual results.
                  </p>
                  <p>
                    That practitioner perspective is baked into everything we do: the certification criteria, the assessment methodology, the way we structure matches. We built the system we wished had existed when we were on the front lines.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to be part of it?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Whether you're a consultant who can back up your expertise or an organization that's done guessing — there's a place for you in this network.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://calendly.com/exitouinc/new-meeting" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Apply as consultant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                  <a href="https://tally.so/r/Pd9WW1" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Start assessment
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

export default AboutPage;
