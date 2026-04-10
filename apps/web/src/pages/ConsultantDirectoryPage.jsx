import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search } from 'lucide-react';
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

      <div className="min-h-screen flex flex-col bg-[#eef1f7]">
        <Header />

        <main className="flex-1">
          <section className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(34,57,104,0.92),rgba(77,109,168,0.74))] py-20 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_30%)]" />
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/30 bg-white/75 px-6 py-10 text-center text-[#233a6b] shadow-[0_30px_80px_rgba(14,24,49,0.25)] backdrop-blur-sm sm:px-10 sm:py-14">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#5c7aa3]">
                  AILCN Consultant Directory
                </p>
                <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  Start with a quick 15-minute call to find the right consultant for your business.
                </h1>
                <p className="mx-auto mt-6 max-w-4xl text-lg leading-9 text-slate-700 sm:text-xl">
                  Once matched, your consultant will reach out to schedule a free 90-minute Readiness Strategy session.
                </p>
                <div className="mt-8">
                  <a href={MATCHING_CALL_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="min-w-[20rem] bg-[#1f2c57] text-white hover:bg-[#172042]">
                      Get matched with an AILCN Consultant
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-200 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight text-[#233a6b] sm:text-4xl">
                    Browse the network by expertise, geography, and AI learning focus.
                  </h2>
                  <p className="mt-3 text-lg leading-8 text-slate-600">
                    Every listing is designed to make matching easier: clear specialization, location, credentials, and a concise snapshot of how each consultant helps organizations move forward.
                  </p>
                </div>

                <div className="w-full max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, specialty, or city"
                      className="h-12 border-slate-200 bg-white pl-11 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl space-y-6">
                {filteredConsultants.length === 0 ? (
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="py-16 text-center">
                      <p className="text-xl font-semibold text-[#233a6b]">No consultants match that search yet.</p>
                      <p className="mt-2 text-slate-600">Try a different name, city, or area of expertise.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredConsultants.map((consultant) => (
                    <Card
                      key={consultant.id}
                      className="overflow-hidden border border-[#c9d4e7] bg-white shadow-[0_14px_35px_rgba(35,58,107,0.08)]"
                    >
                      <CardContent className="p-0">
                        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.35fr]">
                          <div className="border-b border-[#c9d4e7] bg-[#5c7aa3] p-6 text-white lg:border-b-0 lg:border-r lg:p-8">
                            <p className="text-2xl font-bold leading-tight sm:text-3xl">
                              {consultant.headline}
                            </p>
                            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-sm font-semibold tracking-wide text-white/95">
                              <MapPin className="h-4 w-4" />
                              <span>{consultant.location}</span>
                            </div>
                          </div>

                          <div className="p-6 sm:p-8 lg:p-10">
                            <h3 className="text-3xl leading-tight text-[#233a6b] sm:text-4xl">
                              {consultant.name}
                              {consultant.credentials ? ',' : ''}
                            </h3>
                            {consultant.credentials ? (
                              <p className="mt-1 text-2xl leading-tight text-[#233a6b] sm:text-3xl">
                                {consultant.credentials}
                              </p>
                            ) : null}
                            <p className="mt-6 text-lg leading-8 text-slate-600">
                              {consultant.bio}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
                  <a href={MATCHING_CALL_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="min-w-60">
                      Book a Matching Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/organizations">
                    <Button size="lg" variant="outline" className="min-w-60">
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
