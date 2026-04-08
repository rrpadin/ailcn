import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, FileText, Headphones, MonitorPlay, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // In a real scenario, we'd fetch from 'assets' collection.
        // For demonstration, we'll use static data if DB is empty or map it.
        const records = await pb.collection('assets').getList(1, 50, { $autoCancel: false });
        
        if (records.items.length > 0) {
          setResources(records.items);
        } else {
          // Fallback mock data for visual completeness
          setResources([
            { id: 1, name: 'The AI Readiness Framework', category: 'Articles', description: 'A comprehensive guide to assessing organizational maturity.' },
            { id: 2, name: 'Episode 42: Scaling AI in Healthcare', category: 'Podcasts', description: 'Interview with Dr. Sarah Chen on implementation hurdles.' },
            { id: 3, name: 'Supply Chain Optimization', category: 'Use Cases', description: 'How Meridian Labs reduced logistics costs by 14%.' },
            { id: 4, name: 'Diagnostic Tool Walkthrough', category: 'Demos', description: 'Practical application of the AILCN assessment tool.' },
            { id: 5, name: 'Why Credentials Fail', category: 'Positioning', description: 'The difference between knowing AI and leading AI.' },
            { id: 6, name: 'Weekly Insights: Q3 Trends', category: 'Blog', description: 'Emerging patterns in enterprise AI adoption.' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch resources', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = ['All', 'Blog', 'Articles', 'Use Cases', 'Podcasts', 'Demos', 'Positioning'];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (res.description && res.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeFilter === 'All' || res.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const getIconForCategory = (category) => {
    switch(category) {
      case 'Podcasts': return <Headphones className="w-5 h-5" />;
      case 'Demos': return <MonitorPlay className="w-5 h-5" />;
      case 'Positioning': return <Lightbulb className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Resources - AILCN</title>
        <meta name="description" content="Explore ideas, frameworks, and real-world applications of AI leadership." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <section className="bg-muted/30 py-24 border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                  Clarity comes from understanding.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  This is where you explore ideas, frameworks, and real-world applications. We don't publish noise; we publish signal.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-12 border-b sticky top-16 bg-background/95 backdrop-blur z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {categories.map(cat => (
                    <Badge 
                      key={cat} 
                      variant={activeFilter === cat ? 'default' : 'secondary'}
                      className="cursor-pointer text-sm py-1.5 px-4 rounded-full transition-all"
                      onClick={() => setActiveFilter(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search resources..." 
                    className="pl-9 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3,4,5,6].map(i => (
                    <Card key={i} className="h-64 animate-pulse bg-muted/20 border-0" />
                  ))}
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResources.map((resource, idx) => (
                    <motion.div 
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300 group border-border/50">
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                              {getIconForCategory(resource.category)}
                            </div>
                            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                              {resource.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">
                            {resource.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            {resource.description || 'Explore this resource to deepen your understanding of AI implementation and strategy.'}
                          </p>
                          <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                            Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-muted-foreground text-lg">No resources found matching your criteria.</p>
                  <Button variant="link" onClick={() => {setSearchTerm(''); setActiveFilter('All');}} className="mt-4">
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </section>

          <section className="py-24 bg-primary text-primary-foreground text-center">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to apply these insights?</h2>
              <p className="text-primary-foreground/80 text-lg mb-10">
                Explore the resources, deepen your understanding, and determine your next step.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Start Assessment
              </Button>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ResourcesPage;