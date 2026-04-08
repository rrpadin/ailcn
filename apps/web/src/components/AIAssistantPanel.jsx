import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Sparkles, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AIAssistantPanel = ({ context, onContentGenerated, isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for the AI.');
      return;
    }

    setIsGenerating(true);
    setGeneratedText('');

    // Simulate AI API call
    setTimeout(() => {
      let output = '';
      const lowerContext = (context || '').toLowerCase();
      
      if (lowerContext.includes('title')) {
        output = `Advanced Strategies for ${prompt}`;
      } else if (lowerContext.includes('description')) {
        output = `This comprehensive module covers ${prompt}. Students will learn the foundational principles, practical applications, and advanced techniques required to master this subject.`;
      } else if (lowerContext.includes('introduction')) {
        output = `Welcome to this lesson on ${prompt}. In this session, we will explore the core concepts and why they matter in real-world scenarios.`;
      } else {
        output = `Here is the generated content based on your prompt: "${prompt}".\n\n1. Key Concept A\n2. Key Concept B\n3. Practical Application\n\nThis content is tailored for the context: ${context || 'General'}.`;
      }

      setGeneratedText(output);
      setIsGenerating(false);
      toast.success('Content generated successfully.');
    }, 1500);
  };

  const handleAccept = () => {
    if (onContentGenerated && generatedText) {
      onContentGenerated(generatedText);
      setGeneratedText('');
      setPrompt('');
      onClose();
    }
  };

  const handleClear = () => {
    setGeneratedText('');
    setPrompt('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] p-0 flex flex-col shadow-2xl border-l z-[100]">
        <SheetHeader className="p-4 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <SheetTitle>AI Assistant</SheetTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Context: {context ? context.replace(/_/g, ' ') : 'General'}
            </Label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like the AI to generate? (e.g., 'Write a 3-paragraph introduction about machine learning')"
              className="min-h-[120px] resize-none"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()} 
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Content
                </>
              )}
            </Button>
          </div>

          {generatedText && (
            <div className="space-y-3 pt-4 border-t animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Generated Output
                </Label>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs">
                  Clear
                </Button>
              </div>
              <Textarea 
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="min-h-[250px] font-mono text-sm bg-muted/30"
              />
              <Button onClick={handleAccept} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Check className="w-4 h-4 mr-2" /> Accept & Insert
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistantPanel;