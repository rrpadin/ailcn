import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Trash2, Plus, ChevronDown, ChevronRight, PlayCircle, FileText, Headphones, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AssetPicker from '@/components/AssetPicker';
import LessonBuilder from '@/components/LessonBuilder';
import AIAssistantPanel from '@/components/AIAssistantPanel';
import { cn } from '@/lib/utils';

const AdminCourses = () => {
  // Data State
  const [courses, setCourses] = useState([]);
  const [modulesByCourse, setModulesByCourse] = useState({});
  const [lessonsByModule, setLessonsByModule] = useState({});
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set());
  
  // Form State
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonBuilder, setShowLessonBuilder] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [isSaving, setIsSaving] = useState(false);
  
  // Selected Items for Forms
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeParentId, setActiveParentId] = useState(null); // courseId for module form, moduleId for lesson form

  // AI Panel State
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [aiCallback, setAiCallback] = useState(() => () => {});

  // --- Data Fetching ---

  const fetchCourses = async () => {
    try {
      const records = await pb.collection('courses').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setCourses(records.items);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      const records = await pb.collection('modules').getList(1, 50, {
        filter: `course_id="${courseId}"`,
        sort: 'order_index',
        $autoCancel: false
      });
      setModulesByCourse(prev => ({ ...prev, [courseId]: records.items }));
    } catch (error) {
      toast.error('Failed to load modules');
    }
  };

  const fetchLessons = async (moduleId) => {
    try {
      const records = await pb.collection('lessons').getList(1, 50, {
        filter: `module_id="${moduleId}"`,
        sort: 'order',
        $autoCancel: false
      });
      setLessonsByModule(prev => ({ ...prev, [moduleId]: records.items }));
    } catch (error) {
      toast.error('Failed to load lessons');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- Toggle Handlers ---

  const toggleCourse = (courseId) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
      fetchModules(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
      fetchLessons(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // --- CRUD Handlers ---

  const handleDelete = async (collection, id, refreshCallback) => {
    if (!window.confirm(`Are you sure you want to delete this ${collection.slice(0, -1)}?`)) return;
    try {
      await pb.collection(collection).delete(id, { $autoCancel: false });
      toast.success('Deleted successfully');
      refreshCallback();
    } catch (error) {
      toast.error(`Failed to delete ${collection.slice(0, -1)}`);
    }
  };

  // --- Course Form ---

  const openCourseForm = (course = null) => {
    setFormMode(course ? 'edit' : 'add');
    setSelectedCourse(course || { title: '', description: '', status: 'draft', access_type: 'free', thumbnail: '' });
    setShowCourseForm(true);
  };

  const saveCourse = async () => {
    if (!selectedCourse.title?.trim()) return toast.error('Title is required');
    setIsSaving(true);
    try {
      if (formMode === 'edit') {
        await pb.collection('courses').update(selectedCourse.id, selectedCourse, { $autoCancel: false });
        toast.success('Course updated');
      } else {
        await pb.collection('courses').create(selectedCourse, { $autoCancel: false });
        toast.success('Course created');
      }
      setShowCourseForm(false);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Module Form ---

  const openModuleForm = (courseId, module = null) => {
    setActiveParentId(courseId);
    setFormMode(module ? 'edit' : 'add');
    setSelectedModule(module || { title: '', description: '', order_index: 0, course_id: courseId });
    setShowModuleForm(true);
  };

  const saveModule = async () => {
    if (!selectedModule.title?.trim()) return toast.error('Title is required');
    setIsSaving(true);
    try {
      if (formMode === 'edit') {
        await pb.collection('modules').update(selectedModule.id, selectedModule, { $autoCancel: false });
        toast.success('Module updated');
      } else {
        await pb.collection('modules').create(selectedModule, { $autoCancel: false });
        toast.success('Module created');
      }
      setShowModuleForm(false);
      fetchModules(activeParentId);
    } catch (error) {
      toast.error('Failed to save module');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Lesson Builder ---

  const openLessonBuilder = (moduleId, lesson = null) => {
    setActiveParentId(moduleId);
    setSelectedLesson(lesson);
    setShowLessonBuilder(true);
  };

  const handleLessonSaved = () => {
    setShowLessonBuilder(false);
    fetchLessons(activeParentId);
  };

  // --- AI Integration ---

  const handleOpenAI = (context, callback) => {
    setAiContext(context);
    setAiCallback(() => callback);
    setAiPanelOpen(true);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'text': return <FileText className="w-4 h-4 text-orange-500" />;
      case 'audio': return <Headphones className="w-4 h-4 text-purple-500" />;
      case 'quiz': return <HelpCircle className="w-4 h-4 text-green-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Course Management - Admin - AILCN</title>
      </Helmet>
      
      <div className="container mx-auto max-w-6xl pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              Course Management
            </h1>
            <p className="text-muted-foreground mt-1">Create and organize courses, modules, and lessons.</p>
          </div>
          <Button onClick={() => openCourseForm()} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New Course
          </Button>
        </div>

        {courses.length === 0 ? (
          <Card className="border-dashed bg-muted/10">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">Get started by creating your first course. You can add modules and lessons later.</p>
              <Button onClick={() => openCourseForm()}>
                <Plus className="w-4 h-4 mr-2" /> Add New Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-border/50">
                {/* Course Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-card gap-4">
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer group"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                      {expandedCourses.has(course.id) ? (
                        <ChevronDown className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-semibold">{course.title}</h2>
                        <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {course.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {course.access_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                        {course.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pl-12 sm:pl-0">
                    <Button variant="outline" size="sm" onClick={() => openCourseForm(course)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete('courses', course.id, fetchCourses)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Modules Section (Expanded) */}
                {expandedCourses.has(course.id) && (
                  <div className="border-t bg-muted/5 p-5 pl-6 sm:pl-16">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Modules</h3>
                      <Button size="sm" variant="secondary" onClick={() => openModuleForm(course.id)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Module
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(!modulesByCourse[course.id] || modulesByCourse[course.id].length === 0) ? (
                        <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg bg-card">
                          No modules in this course.
                        </div>
                      ) : (
                        modulesByCourse[course.id].map(module => (
                          <div key={module.id} className="border rounded-xl bg-card overflow-hidden shadow-sm">
                            {/* Module Header Row */}
                            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                              <div 
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => toggleModule(module.id)}
                              >
                                {expandedModules.has(module.id) ? (
                                  <ChevronDown className="w-4 h-4 text-primary" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className="text-xs font-mono text-muted-foreground w-6">{module.order_index}.</span>
                                <span className="font-medium">{module.title}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModuleForm(course.id, module)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete('modules', module.id, () => fetchModules(course.id))}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Lessons Section (Expanded) */}
                            {expandedModules.has(module.id) && (
                              <div className="border-t bg-background p-4 pl-12">
                                <div className="space-y-2">
                                  {(!lessonsByModule[module.id] || lessonsByModule[module.id].length === 0) ? (
                                    <div className="text-xs text-muted-foreground py-3">No lessons yet.</div>
                                  ) : (
                                    lessonsByModule[module.id].map((lesson, idx) => (
                                      <div key={lesson.id} className="flex items-center justify-between p-2.5 border rounded-lg bg-card hover:border-primary/40 transition-colors group">
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs font-mono text-muted-foreground w-5">{lesson.order || idx + 1}.</span>
                                          <div className="flex items-center justify-center w-7 h-7 rounded bg-muted/50">
                                            {getLessonIcon(lesson.lesson_type)}
                                          </div>
                                          <div>
                                            <span className="text-sm font-medium">{lesson.title}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span className="text-[10px] text-muted-foreground capitalize">{lesson.lesson_type}</span>
                                              <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'} className="text-[9px] px-1.5 py-0 h-3.5">
                                                {lesson.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openLessonBuilder(module.id, lesson)}>
                                            <Edit className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete('lessons', lesson.id, () => fetchLessons(module.id))}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                  <Button variant="outline" size="sm" className="w-full mt-2 border-dashed text-xs h-8" onClick={() => openLessonBuilder(module.id)}>
                                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Lesson
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Course Form Modal */}
        <Dialog open={showCourseForm} onOpenChange={setShowCourseForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{formMode === 'add' ? 'Create New Course' : 'Edit Course'}</DialogTitle>
            </DialogHeader>
            {selectedCourse && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Course Title <span className="text-destructive">*</span></Label>
                  <div className="flex gap-2">
                    <Input 
                      value={selectedCourse.title} 
                      onChange={(e) => setSelectedCourse({...selectedCourse, title: e.target.value})} 
                      placeholder="e.g., Advanced Leadership"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleOpenAI('Course Title', (text) => setSelectedCourse(prev => ({...prev, title: text})))}>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="flex gap-2 items-start">
                    <Textarea 
                      value={selectedCourse.description} 
                      onChange={(e) => setSelectedCourse({...selectedCourse, description: e.target.value})} 
                      rows={3}
                    />
                    <Button variant="outline" size="icon" onClick={() => handleOpenAI('Course Description', (text) => setSelectedCourse(prev => ({...prev, description: text})))}>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Access Type</Label>
                    <Select value={selectedCourse.access_type} onValueChange={(val) => setSelectedCourse({...selectedCourse, access_type: val})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="member-only">Member Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={selectedCourse.status} onValueChange={(val) => setSelectedCourse({...selectedCourse, status: val})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail Image</Label>
                  <div className="flex items-center gap-3">
                    <AssetPicker 
                      type="image" 
                      selectedId={selectedCourse.thumbnail}
                      onSelect={(asset) => setSelectedCourse({...selectedCourse, thumbnail: asset.id})}
                      triggerText={selectedCourse.thumbnail ? "Change Image" : "Select Image"}
                    />
                    {selectedCourse.thumbnail && <span className="text-sm text-muted-foreground">Image Selected</span>}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCourseForm(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={saveCourse} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Module Form Modal */}
        <Dialog open={showModuleForm} onOpenChange={setShowModuleForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{formMode === 'add' ? 'Add Module' : 'Edit Module'}</DialogTitle>
            </DialogHeader>
            {selectedModule && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Module Title <span className="text-destructive">*</span></Label>
                  <div className="flex gap-2">
                    <Input 
                      value={selectedModule.title} 
                      onChange={(e) => setSelectedModule({...selectedModule, title: e.target.value})} 
                    />
                    <Button variant="outline" size="icon" onClick={() => handleOpenAI('Module Title', (text) => setSelectedModule(prev => ({...prev, title: text})))}>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="flex gap-2 items-start">
                    <Textarea 
                      value={selectedModule.description} 
                      onChange={(e) => setSelectedModule({...selectedModule, description: e.target.value})} 
                      rows={3}
                    />
                    <Button variant="outline" size="icon" onClick={() => handleOpenAI('Module Description', (text) => setSelectedModule(prev => ({...prev, description: text})))}>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Order Index</Label>
                  <Input 
                    type="number" 
                    value={selectedModule.order_index} 
                    onChange={(e) => setSelectedModule({...selectedModule, order_index: parseInt(e.target.value) || 0})} 
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModuleForm(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={saveModule} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lesson Builder Modal */}
        {showLessonBuilder && (
          <LessonBuilder 
            lessonData={selectedLesson}
            moduleId={activeParentId}
            onSave={handleLessonSaved}
            onCancel={() => setShowLessonBuilder(false)}
          />
        )}

        {/* Global AI Assistant Panel */}
        <AIAssistantPanel 
          isOpen={aiPanelOpen} 
          onClose={() => setAiPanelOpen(false)} 
          context={aiContext} 
          onContentGenerated={aiCallback} 
        />
      </div>
    </>
  );
};

export default AdminCourses;