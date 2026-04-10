import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';

const MATCHING_CALL_URL = 'https://calendly.com/exitouinc/ailcn-matching-call';

const CONSULTANTS = [
  {
    id: 'artrell-williams',
    headline: 'Leadership Coach | Certified Talent Development Professional',
    location: 'Buffalo, NY',
    name: 'Artrell Williams',
    credentials: 'CPTM, CPTD',
    bio: 'Artrell Williams, CPTM, CPTD, is a seasoned trainer, presenter, and facilitator with a passion for developing others. He specializes in soft skills, sales training, coaching, and leadership development, helping teams grow with purpose and impact.'
  },
  {
    id: 'arturo-ruelas',
    headline: 'Curriculum Systems | EdTech AI',
    location: 'Portland, OR',
    name: 'Arturo Ruelas',
    credentials: 'MS',
    bio: 'Arturo Ruelas is a global education leader specializing in AI-integrated systems and curriculum innovation. With 19 years across the U.S. and China, he helps schools and EdTech organizations design mission-aligned ecosystems that empower students and educators.'
  },
  {
    id: 'bill-harris',
    headline: 'L&D Strategy | AI Tools',
    location: 'Hancock, NH',
    name: 'Bill Harris',
    credentials: 'M.Ed.',
    bio: 'Bill Harris is a seasoned L&D strategist using data and AI tools to build impactful, performance-driven training programs. With experience in healthcare, education, and consulting, he helps organizations align learning with business growth.'
  },
  {
    id: 'bob-elmore',
    headline: 'Higher Ed | AI Integration',
    location: 'Minneapolis / St. Paul, MN',
    name: 'Bob Elmore',
    credentials: 'Ph.D.',
    bio: 'Dr. Bob Elmore is an eLearning pioneer with 30+ years in instructional technology and higher education. He advises institutions on integrating AI into curriculum, learning systems, and faculty development with strategic insight.'
  },
  {
    id: 'brittany-mceachin',
    headline: 'Public Sector AI | Enablement',
    location: 'Cary, NC',
    name: 'Brittany McEachin',
    credentials: '',
    bio: 'Brittany McEachin is an AI consultant with expertise in IT, SaaS, and public sector transformation. She designs AI-powered training solutions that improve compliance, performance, and workforce readiness across education, real estate, and government.'
  },
  {
    id: 'candace-wofford',
    headline: 'AI in Education Strategy | Data Analytics | Institutional Effectiveness',
    location: 'Corpus Christi, TX',
    name: 'Candace Wofford',
    credentials: 'MS',
    bio: 'Candace Wofford is a results-driven education strategist with 15 years of experience across K-12 and higher ed. She specializes in institutional effectiveness, data analytics, and evidence-based leadership, helping organizations turn insights into action.'
  },
  {
    id: 'debbie-brockett',
    headline: 'Instructional Leadership | Education System Strategy | AI in Education',
    location: 'McMinnville, Oregon',
    name: 'Debbie Brockett',
    credentials: 'Ed.D.',
    bio: 'Dr. Debbie Brockett is a former superintendent and regional education system leader with more than three decades of experience advancing instructional leadership and student success. She helps educational organizations strengthen strategy, expand access, and responsibly use generative AI to support teaching and assessment.'
  },
  {
    id: 'doug-maraffa',
    headline: 'EdTech Adoption | AI Success',
    location: 'Houston, TX',
    name: 'Doug Maraffa',
    credentials: 'Ed.D.',
    bio: 'Doug Maraffa is an EdTech leader helping organizations use AI to enhance adoption, onboarding, and customer success. With 20+ years in SaaS and education, he builds intelligent systems that improve engagement and retention at scale.'
  },
  {
    id: 'fancy-mills',
    headline: 'L&D Strategist | LinkedIn Learning Author',
    location: 'Lakeway, TX',
    name: 'Fancy Mills',
    credentials: 'MS',
    bio: 'Fancy Mills is the CEO of Solvefancy and a LinkedIn Learning author with over 300,000 global learners. With 20+ years in L&D, she helps organizations transform performance through leadership development, coaching, and AI-powered learning strategies.'
  },
  {
    id: 'heidrich-vicci',
    headline: 'AI, IoT & Digital Transformation Strategy | Innovation Leadership',
    location: 'Fort Lauderdale, FL',
    name: 'Heidrich Vicci',
    credentials: 'DBA',
    bio: 'Dr. Heidrich Vicci is the Founder of HV Technology Group, advising organizations on the strategic adoption of artificial intelligence, Internet of Things, and emerging technologies. He helps teams translate advanced technologies into measurable business outcomes.'
  },
  {
    id: 'jessica-caresse-white',
    headline: 'AI Leadership | Transformation',
    location: 'Fort Lauderdale, FL',
    name: 'Jessica Caresse White',
    credentials: 'MS',
    bio: 'Jessica Caresse is a transformational coach and strategist helping leaders integrate AI into business and leadership development. As Founder of J.Caresse & Co., she merges operational clarity with human-centered innovation and change readiness.'
  },
  {
    id: 'jhoangel-villalba',
    headline: 'Diagnostics | AI-Driven Training',
    location: 'Fort Lauderdale, FL',
    name: 'Jhoangel Villalba',
    credentials: 'MBA',
    bio: 'Jhoangel Villalba is a healthcare diagnostics leader with 20+ years in clinical strategy and business development. He guides providers in adopting AI-powered training and workflow tools to improve care delivery, compliance, and workforce readiness.'
  },
  {
    id: 'joe-cronley',
    headline: 'Enterprise Training Leader | Sales Strategist',
    location: 'Roswell, GA',
    name: 'Joe Cronley',
    credentials: '',
    bio: 'Joe Cronley is a seasoned training leader and communicator who has led enterprise onboarding for Fortune 50 clients. He blends training, sales leadership, and digital strategy to drive engagement, adoption, and performance.'
  },
  {
    id: 'mark-mclaughlin',
    headline: 'Education Leader | Strategic Systems Thinker',
    location: 'Nashua, NH',
    name: 'Mark McLaughlin',
    credentials: 'Ed.D.',
    bio: 'Mark McLaughlin is a K-12 leadership expert with 25+ years of experience in curriculum innovation, inclusive school systems, and strategic resource alignment. He helps organizations build vision-driven programs that prioritize academic success, equity, and community impact.'
  },
  {
    id: 'melinda-medina',
    headline: 'AI-Enhanced Instructional Design',
    location: 'Scottsdale, AZ',
    name: 'Melinda Medina',
    credentials: 'M.Ed., MS',
    bio: 'Melinda Medina is a learning strategist and AI integration coach with 20+ years of experience in instructional design across higher education and corporate learning. She helps organizations use AI strategically to evolve learning ecosystems and drive measurable outcomes.'
  },
  {
    id: 'michael-sadlowski',
    headline: 'Healthcare Training | AI Readiness',
    location: 'Atlanta, GA',
    name: 'Michael Sadlowski',
    credentials: 'M.Ed.',
    bio: 'Michael Sadlowski is a healthcare L&D leader specializing in AI-enabled training programs and sales enablement. He transforms complex business needs into scalable learning solutions that improve performance, reduce disruption, and future-proof talent.'
  },
  {
    id: 'nathan-espey',
    headline: 'Custom GPTs | AI Execution',
    location: 'Tampa, FL',
    name: 'Nathan Espey',
    credentials: '',
    bio: 'Nathan Espey is a certified AI consultant and CEO of Farcelis AI Consulting. He builds custom GPTs, automation systems, and training solutions that help organizations execute AI strategy with clarity, ethics, and measurable results.'
  },
  {
    id: 'pamela-edwards',
    headline: 'Professor | Course Developer',
    location: 'Houston, TX',
    name: 'Pamela J. Edwards',
    credentials: '',
    bio: 'Pamela Edwards is a professor and instructional designer with 13+ years of experience in higher education. She specializes in psychology and healthcare programs, leveraging LMS platforms and virtual tools to build inclusive, engaging learning environments while exploring how AI can improve learner outcomes.'
  },
  {
    id: 'reggie-padin',
    headline: 'AI Learning Ecosystems | Strategy',
    location: 'Miami, FL | Raleigh, NC',
    name: 'Reggie Padin',
    credentials: 'Ed.D., MBA',
    bio: 'Dr. Reggie Padin is the Founder and CEO of Exitou, Inc. and the creator of the AI Learning Consultant Network. With a doctorate in instructional technologies and 17+ years in corporate L&D, he helps organizations design AI-powered learning ecosystems that drive talent development, business alignment, and measurable impact.'
  }
];

const ConsultantDirectoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConsultants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return CONSULTANTS;
    }

    return CONSULTANTS.filter((consultant) =>
      [
        consultant.headline,
        consultant.location,
        consultant.name,
        consultant.credentials,
        consultant.bio
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>Consultant Directory - AILCN</title>
        <meta
          name="description"
          content="Browse the AILCN consultant directory and book a matching call to find the right consultant for your organization."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative py-24 md:py-32 flex items-center overflow-hidden">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/92 to-background/82" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">
                  Consultant Directory
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                  Find the right AILCN consultant for your business.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  Start with a quick 15-minute call. Once matched, your consultant will reach out to schedule a free 90-minute Readiness Strategy session.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <a href={MATCHING_CALL_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      Get matched with an AILCN Consultant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/organizations">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-200 active:scale-[0.98]">
                      For organizations
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-14 bg-muted/50 border-y">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
              >
                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Browse the network by expertise, geography, and AI learning focus.
                  </h2>
                  <p className="mt-3 text-lg leading-8 text-muted-foreground">
                    Every listing is designed to make matching easier: clear specialization, location, credentials, and a concise snapshot of how each consultant helps organizations move forward.
                  </p>
                </div>

                <div className="w-full max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, specialty, or city"
                      className="h-12 bg-card pl-11 shadow-sm"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl space-y-6">
                {filteredConsultants.length === 0 ? (
                  <Card className="shadow-sm rounded-2xl">
                    <CardContent className="py-16 text-center">
                      <p className="text-xl font-semibold">No consultants match that search yet.</p>
                      <p className="mt-2 text-muted-foreground">Try a different name, city, or area of expertise.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredConsultants.map((consultant, index) => (
                    <motion.div
                      key={consultant.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                      viewport={{ once: true }}
                    >
                      <Card className="shadow-lg rounded-2xl transition-all duration-200 hover:shadow-xl">
                        <CardContent className="p-8 lg:p-10">
                          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr] lg:gap-10">
                            <div className="space-y-5">
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-xl md:text-2xl font-semibold leading-tight">
                                  {consultant.headline}
                                </p>
                                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                  {consultant.location}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-3xl md:text-4xl font-bold leading-tight" style={{ letterSpacing: '-0.02em' }}>
                                {consultant.name}
                              </h3>
                              {consultant.credentials ? (
                                <p className="mt-2 text-xl md:text-2xl text-primary">
                                  {consultant.credentials}
                                </p>
                              ) : null}
                              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                {consultant.bio}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}

                <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
                  <a href={MATCHING_CALL_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="min-w-60 transition-all duration-200 active:scale-[0.98]">
                      Book a Matching Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/organizations">
                    <Button size="lg" variant="outline" className="min-w-60 transition-all duration-200 active:scale-[0.98]">
                      Explore Organization Services
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

export default ConsultantDirectoryPage;
