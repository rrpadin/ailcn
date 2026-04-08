import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const QuizBuilder = ({ lessonId }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (lessonId) fetchQuizData();
  }, [lessonId]);

  const fetchQuizData = async () => {
    setIsLoading(true);
    try {
      // Find quiz for this lesson
      const quizzes = await pb.collection('quizzes').getFullList({
        filter: `lesson_id="${lessonId}"`,
        $autoCancel: false
      });

      if (quizzes.length > 0) {
        setQuiz(quizzes[0]);
        // Fetch questions
        const qs = await pb.collection('quiz_questions').getFullList({
          filter: `quiz_id="${quizzes[0].id}"`,
          $autoCancel: false
        });
        
        // Parse options JSON
        const parsedQs = qs.map(q => ({
          ...q,
          optionsList: q.options ? JSON.parse(q.options) : ['', '', '', '']
        }));
        setQuestions(parsedQs);
      } else {
        // Create default quiz
        const newQuiz = await pb.collection('quizzes').create({
          lesson_id: lessonId,
          title: 'Lesson Assessment',
          passing_score: 80
        }, { $autoCancel: false });
        setQuiz(newQuiz);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Failed to load quiz', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: `temp_${Date.now()}`,
      question: '',
      optionsList: ['', '', '', ''],
      correct_answer: '0',
      explanation: '',
      isNew: true
    }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].optionsList[optIndex] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = async (index) => {
    const q = questions[index];
    if (!q.isNew) {
      try {
        await pb.collection('quiz_questions').delete(q.id, { $autoCancel: false });
      } catch (e) {
        toast.error('Failed to delete question from database');
        return;
      }
    }
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSaveAll = async () => {
    try {
      // Save quiz settings
      if (quiz) {
        await pb.collection('quizzes').update(quiz.id, {
          title: quiz.title,
          passing_score: quiz.passing_score
        }, { $autoCancel: false });
      }

      // Save questions
      for (const q of questions) {
        const data = {
          quiz_id: quiz.id,
          question: q.question,
          options: JSON.stringify(q.optionsList),
          correct_answer: q.correct_answer,
          explanation: q.explanation
        };

        if (q.isNew) {
          await pb.collection('quiz_questions').create(data, { $autoCancel: false });
        } else {
          await pb.collection('quiz_questions').update(q.id, data, { $autoCancel: false });
        }
      }
      
      toast.success('Quiz saved successfully');
      fetchQuizData(); // Refresh to get real IDs
    } catch (error) {
      toast.error('Failed to save quiz');
    }
  };

  const simulateAIGeneration = (count) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newQs = Array.from({ length: count }).map((_, i) => ({
        id: `temp_ai_${Date.now()}_${i}`,
        question: `AI Generated Question ${i + 1} about the lesson content?`,
        optionsList: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
        correct_answer: '0',
        explanation: 'This is the correct answer because it aligns with the core concepts taught in the lesson.',
        isNew: true
      }));
      
      setQuestions([...questions, ...newQs]);
      setIsGenerating(false);
      toast.success(`Generated ${count} questions`);
    }, 2000);
  };

  if (isLoading) return <div className="p-4 text-center">Loading quiz builder...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Sparkles className="w-5 h-5" /> AI Quiz Actions
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => simulateAIGeneration(3)} disabled={isGenerating}>
              Generate 3 Questions
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateAIGeneration(5)} disabled={isGenerating}>
              Generate 5 Questions
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.info('Rewriting questions...')} disabled={isGenerating}>
              <RefreshCw className="w-4 h-4 mr-2" /> Rewrite for Simplicity
            </Button>
          </div>
        </CardContent>
      </Card>

      {quiz && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Quiz Title</Label>
            <Input 
              value={quiz.title} 
              onChange={(e) => setQuiz({...quiz, title: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Passing Score (%)</Label>
            <Input 
              type="number" 
              value={quiz.passing_score} 
              onChange={(e) => setQuiz({...quiz, passing_score: parseInt(e.target.value)})} 
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <Card key={q.id} className="relative">
            <Button 
              variant="ghost" size="icon" 
              className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
              onClick={() => handleRemoveQuestion(qIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <CardContent className="p-4 pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Question {qIndex + 1}</Label>
                <Input 
                  value={q.question} 
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} 
                />
              </div>
              
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <Label className="text-muted-foreground">Options & Correct Answer</Label>
                <RadioGroup 
                  value={q.correct_answer} 
                  onValueChange={(val) => handleQuestionChange(qIndex, 'correct_answer', val)}
                >
                  {q.optionsList.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-3">
                      <RadioGroupItem value={optIndex.toString()} id={`q${qIndex}-opt${optIndex}`} />
                      <Input 
                        value={opt} 
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} 
                        placeholder={`Option ${optIndex + 1}`}
                        className={q.correct_answer === optIndex.toString() ? 'border-primary' : ''}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Explanation (shown after answering)</Label>
                <Textarea 
                  value={q.explanation} 
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} 
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleAddQuestion}>
          <Plus className="w-4 h-4 mr-2" /> Add Blank Question
        </Button>
        <Button onClick={handleSaveAll}>
          Save Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizBuilder;