import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export const ContentBlock = ({ 
  title, 
  description, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg bg-card overflow-hidden"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
        <div className="text-left">
          <h4 className="font-medium text-sm">{title}</h4>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 border-t">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const IntroductionBlock = ({ value, onChange }) => (
  <ContentBlock 
    title="Introduction" 
    description="A brief overview of what this lesson covers."
  >
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start with an overview..."
      className="min-h-[100px]"
    />
  </ContentBlock>
);

export const TeachingContentBlock = ({ value, onChange }) => (
  <ContentBlock 
    title="Teaching Content" 
    description="The core instructional material."
  >
    <RichTextEditor
      value={value || ''}
      onChange={onChange}
      placeholder="Enter the main lesson content here..."
    />
  </ContentBlock>
);

export const ExamplesBlock = ({ value, onChange }) => (
  <ContentBlock 
    title="Examples" 
    description="Practical scenarios or case studies."
    defaultOpen={false}
  >
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Provide practical examples..."
      className="min-h-[120px]"
    />
  </ContentBlock>
);

export const ReflectionPromptsBlock = ({ value, onChange }) => (
  <ContentBlock 
    title="Reflection Prompts" 
    description="Questions to encourage critical thinking."
    defaultOpen={false}
  >
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ask students to reflect..."
      className="min-h-[100px]"
    />
  </ContentBlock>
);

export const KeyTakeawaysBlock = ({ value, onChange }) => (
  <ContentBlock 
    title="Key Takeaways" 
    description="Summary of the most important points."
    defaultOpen={false}
  >
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Summarize main points..."
      className="min-h-[100px]"
    />
  </ContentBlock>
);