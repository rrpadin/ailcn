import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, FileText, Headphones, HelpCircle, Edit, Trash2, GripVertical, Plus } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LessonBuilder from './LessonBuilder';

const LessonList = ({ moduleId }) => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('lessons').getFullList({
        filter: `module_id="${moduleId}"`,
        sort: 'order',
        $autoCancel: false
      });
      setLessons(records);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchLessons();
    }
  }, [moduleId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await pb.collection('lessons').delete(id, { $autoCancel: false });
      toast.success('Lesson deleted');
      fetchLessons();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  const openCreateModal = () => {
    setEditingLesson(null);
    setIsBuilderOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setIsBuilderOpen(true);
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
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading lessons...</div>;
  }

  return (
    <div className="space-y-4">
      {lessons.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/10 border-dashed">
          <p className="text-sm text-muted-foreground mb-4">No lessons in this module yet.</p>
          <Button onClick={openCreateModal} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" /> Add First Lesson
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              className="flex items-center justify-between p-3 bg-card border rounded-lg hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
                <span className="text-xs font-medium text-muted-foreground w-6">{lesson.order || index + 1}.</span>
                <div className="flex items-center justify-center w-8 h-8 rounded bg-muted/50 flex-shrink-0">
                  {getLessonIcon(lesson.lesson_type)}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-medium truncate">{lesson.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground capitalize">{lesson.lesson_type}</span>
                    <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 h-4">
                      {lesson.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(lesson)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(lesson.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button onClick={openCreateModal} variant="ghost" className="w-full mt-2 border border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Lesson
          </Button>
        </div>
      )}

      <LessonBuilder 
        isOpen={isBuilderOpen} 
        onClose={() => setIsBuilderOpen(false)} 
        moduleId={moduleId}
        existingLesson={editingLesson}
        onSaveSuccess={fetchLessons}
      />
    </div>
  );
};

export default LessonList;