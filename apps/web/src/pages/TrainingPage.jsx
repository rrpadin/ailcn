import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const TrainingPage = () => {
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const records = await pb.collection('programs').getList(1, 1, {
          filter: 'type = "certification"',
          $autoCancel: false
        });
        if (records.items.length > 0) {
          setProgram(records.items[0]);
        }
      } catch (error) {
        console.error('Failed to fetch program', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, []);

  const phases = [
    {
      id: 'phase-1',
      number: '01',
      title: 'Understanding',
      status: 'completed',
      description: 'Foundational alignment on AI capabilities, limitations, and strategic positioning.',
      modules: ['The AI Landscape', 'Identifying High-Value Use Cases', 'Risk & Governance Basics']
    },
    {
      id: 'phase-2',
      number: '02',
      title: 'Application',
      status: 'current',
      description: 'Translating theory into actionable frameworks for organizational assessment.',
      modules: ['Conducting Readiness Diagnostics', 'Stakeholder Alignment', 'Mapping the Data Ecosystem']
    },
    {
      id: 'phase-3',
      number: '03',
      title: 'Execution',
      status: 'locked',
      description: 'Designing and managing pilot programs and full-scale implementations.',
      modules: ['Vendor Selection', 'Change Management', 'Measuring ROI']
    },
    {
      id: 'phase-4',
      number: '04',
      title: 'Mastery',
      status: 'locked',
      description: 'Advanced advisory skills, scaling AI initiatives, and network certification.',
      modules: ['Enterprise Scaling', 'Continuous Optimization', 'Final Certification Review']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Training - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pb-24">
          <section className="bg-card border-b py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                  This is where capability is built.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The AILCN certification is not designed to inform. It is designed to transform how you advise, execute, and deliver value in the AI era.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-4 space-y-12">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {program?.description || 'A rigorous 90-day structure demanding practical application of concepts. You will not just learn frameworks; you will use them.'}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">What You Will Develop</h2>
                  <ul className="space-y-3">
                    {['Strategic clarity in ambiguous environments', 'Diagnostic precision for client readiness', 'Execution frameworks that mitigate risk', 'Authority to lead enterprise transformations'].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="bg-muted/50 border-0">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Expectation</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Progress requires completion of practical assignments. Move at your pace, but maintain momentum.
                    </p>
                    <Button className="w-full">
                      Continue Certification <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                
                <div className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="phase-2" className="w-full">
                    {phases.map((phase) => (
                      <AccordionItem key={phase.id} value={phase.id} className="border bg-card rounded-xl mb-4 px-2 overflow-hidden shadow-sm">
                        <AccordionTrigger className="hover:no-underline py-6 px-4">
                          <div className="flex items-center text-left w-full">
                            <div className="text-4xl font-bold text-primary/20 mr-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
                              {phase.number}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold">{phase.title}</h3>
                              <p className="text-sm text-muted-foreground font-normal mt-1">{phase.description}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              {phase.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-primary" />}
                              {phase.status === 'current' && <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">In Progress</span>}
                              {phase.status === 'locked' && <Lock className="w-5 h-5 text-muted-foreground/50" />}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-6 pt-2">
                          <div className="pl-16">
                            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Modules</h4>
                            <ul className="space-y-3">
                              {phase.modules.map((mod, idx) => (
                                <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                  <span className="font-medium text-sm">{mod}</span>
                                  {phase.status === 'completed' ? (
                                    <span className="text-xs text-muted-foreground">Completed</span>
                                  ) : phase.status === 'current' ? (
                                    <Button variant="ghost" size="sm" className="h-8">Start</Button>
                                  ) : (
                                    <Lock className="w-4 h-4 text-muted-foreground/30" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TrainingPage;