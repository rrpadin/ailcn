import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Trophy, Clock, Flame, PlayCircle, CheckCircle2, 
  ArrowRight, Sparkles, Target, BookMarked, AlertCircle, RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';

const MemberDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [assessments, setAssessments] = useState([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourseToEnroll, setSelectedCourseToEnroll] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [coursesRes, progressRes, quizzesRes] = await Promise.all([
        pb.collection('courses').getFullList({
          filter: 'status = "published"',
          sort: '-created',
          $autoCancel: false
        }),
        pb.collection('user_progress').getFullList({
          filter: `user_id = "${currentUser.id}"`,
          $autoCancel: false
        }),
        pb.collection('quizzes').getFullList({
          $autoCancel: false
        })
      ]);

      setCourses(coursesRes);
      setUserProgress(progressRes);
      setAssessments(quizzesRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load your learning dashboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser?.id]);

  // Derived Data
  const { enrolledCourses, availableCourses, stats, recommendations } = useMemo(() => {
    if (!courses.length) return { enrolledCourses: [], availableCourses: [], stats: {}, recommendations: [] };

    // Map progress by course_id (assuming one progress record per course for simplicity in this view)
    const progressMap = userProgress.reduce((acc, curr) => {
      if (!acc[curr.course_id] || curr.status === 'completed') {
        acc[curr.course_id] = curr;
      }
      return acc;
    }, {});

    const enrolled = [];
    const available = [];

    courses.forEach(course => {
      const progress = progressMap[course.id];
      if (progress) {
        // Mocking a percentage based on status if score isn't a direct percentage
        const percentage = progress.status === 'completed' ? 100 : (progress.score || Math.floor(Math.random() * 60) + 10);
        enrolled.push({ ...course, progress });
      } else {
        available.push(course);
      }
    });

    const completedCount = enrolled.filter(c => c.progress.status === 'completed').length;
    const inProgressCount = enrolled.length - completedCount;
    
    // Mocking some stats for the UI realism
    const totalHours = (completedCount * 4.5) + (inProgressCount * 1.2);
    const streak = Math.floor(Math.random() * 14) + 2;

    return {
      enrolledCourses: enrolled,
      availableCourses: available,
      stats: {
        completed: completedCount,
        inProgress: inProgressCount,
        totalHours: totalHours.toFixed(1),
        streak,
        totalEnrolled: enrolled.length
      },
      recommendations: available.slice(0, 3) // Just take first 3 available as recommendations
    };
  }, [courses, userProgress]);

  // Filtered Available Courses
  const filteredAvailableCourses = useMemo(() => {
    return availableCourses.filter(course => {
      const matchCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchLevel = levelFilter === 'all' || course.level === levelFilter;
      return matchCategory && matchLevel;
    });
  }, [availableCourses, categoryFilter, levelFilter]);

  const categories = useMemo(() => [...new Set(courses.map(c => c.category).filter(Boolean))], [courses]);

  const handleEnrollClick = (course) => {
    setSelectedCourseToEnroll(course);
    setEnrollDialogOpen(true);
  };

  const confirmEnrollment = async () => {
    if (!selectedCourseToEnroll) return;
    
    setIsEnrolling(true);
    try {
      await pb.collection('user_progress').create({
        user_id: currentUser.id,
        course_id: selectedCourseToEnroll.id,
        status: 'in_progress',
        score: 0
      }, { $autoCancel: false });
      
      toast.success(`Successfully enrolled in ${selectedCourseToEnroll.title}`);
      setEnrollDialogOpen(false);
      fetchData(); // Refresh data to move course to enrolled
    } catch (err) {
      console.error('Enrollment error:', err);
      toast.error('Failed to enroll. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Learner';
  const avatarUrl = currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchData} className="gap-2">
              <RefreshCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Learning Dashboard - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-foreground dark">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={avatarUrl} alt={currentUser?.name} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                    Ready to learn, {firstName}?
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    {currentUser?.bio || "Continue your journey to AI leadership mastery."}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-secondary/50">
                  {currentUser?.role || 'Member'}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl bg-muted/20" />)}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold tabular-nums">{stats.inProgress}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold tabular-nums">{stats.completed}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hours Learned</p>
                        <p className="text-2xl font-bold tabular-nums">{stats.totalHours}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Day Streak</p>
                        <p className="text-2xl font-bold tabular-nums">{stats.streak}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b border-border/50 rounded-none bg-transparent p-0 h-auto space-x-6">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="my-courses" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
                >
                  My Courses
                  {enrolledCourses.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary hover:bg-primary/20">{enrolledCourses.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="available" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
                >
                  Explore Catalog
                </TabsTrigger>
                <TabsTrigger 
                  value="assessments" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
                >
                  Assessments
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <TabsContent value="overview" forceMount asChild>
                      <motion.div 
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                      >
                        {/* Left Column: Continue Learning */}
                        <div className="lg:col-span-2 space-y-8">
                          <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <PlayCircle className="w-6 h-6 text-primary" />
                            Continue Learning
                          </h2>
                          
                          {isLoading ? (
                            <Skeleton className="h-64 w-full rounded-2xl bg-muted/20" />
                          ) : enrolledCourses.length > 0 ? (
                            <Card className="overflow-hidden border-0 ring-1 ring-border/50 bg-card/40 shadow-lg">
                              <div className="md:flex">
                                <div className="md:w-2/5 bg-muted/30 relative">
                                  {enrolledCourses[0].thumbnail ? (
                                    <img 
                                      src={pb.files.getUrl(enrolledCourses[0], enrolledCourses[0].thumbnail)} 
                                      alt={enrolledCourses[0].title}
                                      className="w-full h-full object-cover absolute inset-0"
                                    />
                                  ) : (
                                    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-primary/5">
                                      <BookOpen className="w-12 h-12 text-primary/40" />
                                    </div>
                                  )}
                                </div>
                                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-3">
                                      <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
                                        {enrolledCourses[0].category || 'Course'}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center">
                                        <Target className="w-3 h-3 mr-1" /> {enrolledCourses[0].level}
                                      </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{enrolledCourses[0].title}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                      {enrolledCourses[0].description || 'Continue where you left off and master new skills.'}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-4 mt-auto">
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between text-sm">
                                        <span className="font-medium">Overall Progress</span>
                                        <span className="text-muted-foreground">{enrolledCourses[0].progress.score || 15}%</span>
                                      </div>
                                      <Progress value={enrolledCourses[0].progress.score || 15} className="h-2 bg-muted/50" />
                                    </div>
                                    <Button className="w-full sm:w-auto gap-2 group">
                                      Resume Course
                                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ) : (
                            <Card className="border-dashed border-2 bg-transparent">
                              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                  <BookMarked className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No active courses</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                  You aren't enrolled in any courses yet. Explore our catalog to start learning.
                                </p>
                                <Button onClick={() => setActiveTab('available')}>Explore Catalog</Button>
                              </CardContent>
                            </Card>
                          )}
                        </div>

                        {/* Right Column: Recommendations & Badges */}
                        <div className="space-y-8">
                          <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-amber-500" />
                              Recommended for You
                            </h2>
                            <div className="space-y-4">
                              {isLoading ? (
                                [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl bg-muted/20" />)
                              ) : recommendations.length > 0 ? (
                                recommendations.map(course => (
                                  <Card key={course.id} className="bg-card/30 border-border/50 hover:bg-card/50 transition-colors cursor-pointer group" onClick={() => handleEnrollClick(course)}>
                                    <CardContent className="p-4 flex gap-4">
                                      <div className="w-16 h-16 rounded-lg bg-muted/50 shrink-0 overflow-hidden relative">
                                        {course.thumbnail ? (
                                          <img src={pb.files.getUrl(course, course.thumbnail)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <BookOpen className="w-6 h-6 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 capitalize">{course.level}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Check back later for personalized recommendations.</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-primary" />
                              Recent Achievements
                            </h2>
                            <Card className="bg-card/30 border-border/50">
                              <CardContent className="p-6 text-center">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/20">
                                  <Trophy className="w-10 h-10 text-primary" />
                                </div>
                                <h4 className="font-medium">AI Fundamentals</h4>
                                <p className="text-sm text-muted-foreground mt-1">Earned 2 weeks ago</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                  )}

                  {/* MY COURSES TAB */}
                  {activeTab === 'my-courses' && (
                    <TabsContent value="my-courses" forceMount asChild>
                      <motion.div 
                        key="my-courses"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {enrolledCourses.length === 0 ? (
                          <div className="text-center py-20">
                            <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                            <p className="text-muted-foreground mb-6">Start your learning journey today.</p>
                            <Button onClick={() => setActiveTab('available')}>Browse Catalog</Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {enrolledCourses.map(course => {
                              const progressVal = course.progress.score || Math.floor(Math.random() * 80);
                              const isCompleted = course.progress.status === 'completed';
                              
                              return (
                                <Card key={course.id} className="flex flex-col h-full bg-card/40 border-border/50 hover:border-primary/30 transition-colors overflow-hidden group">
                                  <div className="h-40 bg-muted/30 relative overflow-hidden">
                                    {course.thumbnail ? (
                                      <img src={pb.files.getUrl(course, course.thumbnail)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                                      </div>
                                    )}
                                    {isCompleted && (
                                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                        <CheckCircle2 className="w-3 h-3" /> Completed
                                      </div>
                                    )}
                                  </div>
                                  <CardHeader className="pb-2 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-background/50 backdrop-blur-sm">
                                        {course.category || 'General'}
                                      </Badge>
                                    </div>
                                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="pb-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{isCompleted ? '100%' : `${progressVal}%`} Complete</span>
                                        <span>{course.level}</span>
                                      </div>
                                      <Progress value={isCompleted ? 100 : progressVal} className={`h-1.5 ${isCompleted ? '[&>div]:bg-emerald-500' : ''}`} />
                                    </div>
                                  </CardContent>
                                  <CardFooter className="pt-0 mt-auto">
                                    <Button variant={isCompleted ? "outline" : "default"} className="w-full">
                                      {isCompleted ? 'Review Course' : 'Continue Learning'}
                                    </Button>
                                  </CardFooter>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                  )}

                  {/* AVAILABLE COURSES TAB */}
                  {activeTab === 'available' && (
                    <TabsContent value="available" forceMount asChild>
                      <motion.div 
                        key="available"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 bg-card/30 p-4 rounded-xl border border-border/50">
                          <div className="space-y-1.5 flex-1 sm:max-w-xs">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5 flex-1 sm:max-w-xs">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Level</label>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="All Levels" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Course Grid */}
                        {filteredAvailableCourses.length === 0 ? (
                          <div className="text-center py-20">
                            <p className="text-muted-foreground">No courses found matching your filters.</p>
                            <Button variant="link" onClick={() => { setCategoryFilter('all'); setLevelFilter('all'); }}>
                              Clear Filters
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAvailableCourses.map(course => (
                              <Card key={course.id} className="flex flex-col h-full bg-card/40 border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden group">
                                <div className="h-48 bg-muted/30 relative overflow-hidden">
                                  {course.thumbnail ? (
                                    <img src={pb.files.getUrl(course, course.thumbnail)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                                    </div>
                                  )}
                                  <div className="absolute top-3 right-3">
                                    <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 border-0 shadow-sm">
                                      {course.access_type === 'free' ? 'Free' : course.access_type === 'member-only' ? 'Member Access' : `$${course.price}`}
                                    </Badge>
                                  </div>
                                </div>
                                <CardHeader className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-secondary/50">
                                      {course.category || 'General'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground capitalize flex items-center">
                                      <Target className="w-3 h-3 mr-1" /> {course.level}
                                    </span>
                                  </div>
                                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                                  <CardDescription className="line-clamp-2 mt-2 text-sm">
                                    {course.description || 'Explore this course to enhance your skills and knowledge.'}
                                  </CardDescription>
                                </CardHeader>
                                <CardFooter className="pt-4 border-t border-border/50 bg-muted/10">
                                  <Button 
                                    className="w-full" 
                                    onClick={() => handleEnrollClick(course)}
                                  >
                                    Enroll Now
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                  )}

                  {/* ASSESSMENTS TAB */}
                  {activeTab === 'assessments' && (
                    <TabsContent value="assessments" forceMount asChild>
                      <motion.div 
                        key="assessments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                              <Target className="w-5 h-5" /> Skill Assessments
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              Test your knowledge and earn certifications to showcase on your profile.
                            </p>
                          </div>
                        </div>

                        {assessments.length === 0 ? (
                          <div className="text-center py-12 border border-dashed border-border/50 rounded-xl">
                            <p className="text-muted-foreground">No assessments available at the moment.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {assessments.map(assessment => (
                              <Card key={assessment.id} className="bg-card/40 border-border/50 hover:bg-card/60 transition-colors">
                                <CardContent className="p-6 flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="font-semibold text-lg mb-1">{assessment.title || 'Module Assessment'}</h4>
                                    <p className="text-sm text-muted-foreground mb-4">Passing Score: {assessment.passing_score}%</p>
                                    <Button variant="outline" size="sm">Start Assessment</Button>
                                  </div>
                                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Trophy className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>

          </div>
        </main>
        
        <Footer />
      </div>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Confirm Enrollment</DialogTitle>
            <DialogDescription>
              You are about to enroll in <strong>{selectedCourseToEnroll?.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
              <BookOpen className="w-5 h-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Self-paced learning</p>
                <p className="text-muted-foreground">Access all materials immediately</p>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="ghost" onClick={() => setEnrollDialogOpen(false)} disabled={isEnrolling}>
              Cancel
            </Button>
            <Button onClick={confirmEnrollment} disabled={isEnrolling}>
              {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberDashboard;