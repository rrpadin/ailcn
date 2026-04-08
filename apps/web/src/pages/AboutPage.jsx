import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Shield, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - AILCN</title>
        <meta name="description" content="Learn about the AI Learning Consultant Network — who we are, what we stand for, and why we built AILCN." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                  About AILCN
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  The AI Learning Consultant Network exists to close the gap between AI potential and AI reality — by certifying the people who can actually bridge it.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Most organizations want to adopt AI. Most struggle to do it well. Not because the technology isn't ready — but because finding trustworthy, proven expertise is nearly impossible.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  AILCN was built to fix that. We certify consultants through a rigorous, real-world program. We assess organizations to understand exactly where they are and what they need. Then we make the match.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No guesswork. No generic advice. Just the right expertise, in the right hands, at the right time.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What we stand for</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  { icon: Target, title: 'Results over credentials', description: 'Certifications mean nothing without outcomes. Every consultant in our network has proven they can deliver — not just talk about AI.' },
                  { icon: Shield, title: 'Selectivity by design', description: "We turn people away. That's intentional. A network that accepts everyone protects no one." },
                  { icon: Users, title: 'Honest assessment', description: "We tell organizations the truth about where they stand — even when it's not what they want to hear." },
                  { icon: Award, title: 'Continuous growth', description: "AI is moving fast. The network exists to keep everyone at the frontier — together." }
                ].map((value, index) => (
                  <Card key={index} className="bg-card rounded-2xl shadow-lg h-full">
                    <CardContent className="p-8">
                      <value.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Whether you're a consultant looking to join our network or an organization seeking proven AI expertise, the next step is simple.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/consultants">
                    <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Apply as consultant <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/organizations">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Start assessment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
