import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Users, Award, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

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
    url: 'https://calendly.com/exitouinc/new-meeting',
    link_type: 'external',
    open_in_new_tab: true,
  };

  const getStartedLink = {
    url: 'https://tally.so/r/Pd9WW1',
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
        <title>AILCN - AI Leadership Certification Network</title>
        <meta name="description" content="Join the exclusive network of certified AI consultants and organizations leading the AI transformation." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1562600484-c6ef0ffe27a2)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                  The AI learning network that organizations trust
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  We certify consultants who can actually deliver AI transformation. We assess organizations to match them with the right expertise. No guesswork, no generic advice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <DynamicLink
                    linkData={applyLink}
                    fallbackUrl="/consultants"
                    onClick={() => handleCTAClick('apply_consultant')}
                  >
                    <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Apply as consultant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </DynamicLink>

                  <DynamicLink
                    linkData={getStartedLink}
                    fallbackUrl="/organizations"
                    onClick={() => handleCTAClick('start_assessment')}
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Start assessment
                    </Button>
                  </DynamicLink>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What This Means Section */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What this means for you</h2>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                  <Card className="shadow-lg rounded-2xl transition-all duration-200 hover:shadow-xl">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">For consultants</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Get certified through our rigorous 90-day program. Gain access to organizations actively seeking proven AI expertise. Build your reputation in a network that values real results over credentials.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Structured certification program with real-world projects</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Direct access to pre-qualified organizations</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Ongoing support and network benefits</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg rounded-2xl transition-all duration-200 hover:shadow-xl">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">For organizations</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Take our AI readiness assessment. Get matched with certified consultants who understand your specific challenges. Move forward with confidence, not confusion.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Comprehensive AI readiness diagnostic</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Matched with vetted, certified consultants</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Clear roadmap for AI implementation</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How it works</h2>

                <div className="max-w-3xl mx-auto space-y-8">
                  {[
                    { number: '01', title: 'Apply or assess', description: 'Consultants apply for certification. Organizations complete our AI readiness assessment.' },
                    { number: '02', title: 'Evaluation', description: 'We review consultant applications for experience and capability. Organizations receive detailed diagnostic results.' },
                    { number: '03', title: 'Certification or matching', description: 'Approved consultants enter our 90-day certification program. Organizations get matched with certified consultants.' },
                    { number: '04', title: 'Network access', description: 'Certified consultants gain access to our exclusive network and opportunities. Organizations connect with their matched consultant.' },
                    { number: '05', title: 'Ongoing support', description: 'Both consultants and organizations receive continued support, resources, and network benefits.' }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-6 items-start"
                    >
                      <div className="text-6xl font-bold text-primary/10 flex-shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {step.number}
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Ways to Engage Section */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ways to engage</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <Card className="bg-card rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl flex flex-col h-full">
                    <CardContent className="p-8 flex flex-col h-full">
                      <Award className="w-12 h-12 text-primary mb-6" />
                      <h3 className="text-xl font-semibold mb-3">Readiness snapshot</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                        Quick 15-minute assessment to understand where you stand with AI adoption. Get immediate insights and recommendations.
                      </p>
                      <div className="mt-auto">
                        <DynamicLink linkData={getStartedLink} fallbackUrl="/organizations" onClick={() => handleCTAClick('start_assessment_card')}>
                          <Button variant="outline" className="w-full transition-all duration-200 active:scale-[0.98]">
                            Start assessment
                          </Button>
                        </DynamicLink>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl scale-105 ring-2 ring-primary flex flex-col h-full">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <Shield className="w-12 h-12 text-primary" />
                        <span className="text-xs font-semibold px-3 py-1 bg-primary text-primary-foreground rounded-full">
                          Recommended
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Certification program</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                        90-day intensive program for consultants. Build proven expertise, gain network access, and work with leading organizations.
                      </p>
                      <div className="mt-auto">
                        <DynamicLink linkData={applyLink} fallbackUrl="/consultants" onClick={() => handleCTAClick('apply_consultant_card')}>
                          <Button className="w-full transition-all duration-200 active:scale-[0.98]">
                            Apply now
                          </Button>
                        </DynamicLink>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl flex flex-col h-full">
                    <CardContent className="p-8 flex flex-col h-full">
                      <Sparkles className="w-12 h-12 text-primary mb-6" />
                      <h3 className="text-xl font-semibold mb-3">Direct engagement</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                        Already know what you need? Connect directly with our team to discuss custom solutions and enterprise partnerships.
                      </p>
                      <div className="mt-auto">
                        <DynamicLink linkData={bookConsultationLink} fallbackUrl="/contact" onClick={() => handleCTAClick('contact_us_card')}>
                          <Button variant="outline" className="w-full transition-all duration-200 active:scale-[0.98]">
                            Contact us
                          </Button>
                        </DynamicLink>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Authority & Proof Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Built on proven expertise</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
                  Our network is built by practitioners who have led AI transformations at scale. We know what works because we've done it.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>87%</div>
                    <p className="text-sm text-muted-foreground">Success rate in AI implementation</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>142</div>
                    <p className="text-sm text-muted-foreground">Certified consultants in network</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>$2.4M</div>
                    <p className="text-sm text-muted-foreground">Average value delivered per engagement</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Charter/Exclusivity Section */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">A selective network by design</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We maintain high standards because quality matters. Not every consultant who applies will be accepted. Not every organization will be a fit. This selectivity protects the value of the network for everyone involved.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  When you work with an AILCN-certified consultant, you know they've been vetted. When you're certified by AILCN, organizations know you can deliver.
                </p>
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
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Whether you're a consultant looking to join our network or an organization seeking AI expertise, the next step is simple.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <DynamicLink
                    linkData={applyLink}
                    fallbackUrl="/consultants"
                    onClick={() => handleCTAClick('apply_consultant_final')}
                  >
                    <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Apply as consultant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </DynamicLink>

                  <DynamicLink
                    linkData={getStartedLink}
                    fallbackUrl="/organizations"
                    onClick={() => handleCTAClick('start_assessment_final')}
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Start assessment
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