import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Trash2, History } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminAIGenerations = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const records = await pb.collection('ai_generation_sessions').getFullList({
        sort: '-created',
        expand: 'admin_user_id,course_id,module_id,lesson_id',
        $autoCancel: false
      });
      setSessions(records);
    } catch (error) {
      toast.error('Failed to load generation history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this generation record?')) return;
    
    try {
      await pb.collection('ai_generation_sessions').delete(id, { $autoCancel: false });
      toast.success('Record deleted');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const handleView = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Generations - Admin - AILCN</title>
      </Helmet>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              AI Generation History
            </h1>
            <p className="text-muted-foreground mt-1">Review past AI-generated content and prompts.</p>
          </div>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No generation history found
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {new Date(session.created).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {session.generation_type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {session.expand?.course_id?.title || session.expand?.lesson_id?.title || 'General'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {session.expand?.admin_user_id?.name || session.expand?.admin_user_id?.email || 'Admin'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleView(session)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="capitalize">{selectedSession?.generation_type} Generation Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prompt Input</h4>
                  <div className="bg-muted/50 p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                    {selectedSession?.prompt_input || 'No prompt recorded'}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Generated Output</h4>
                  <div className="bg-card border p-4 rounded-md text-sm whitespace-pre-wrap">
                    {selectedSession?.generated_output || 'No output recorded'}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex justify-between border-t pt-4">
                  <span>ID: {selectedSession?.id}</span>
                  <span>{new Date(selectedSession?.created).toLocaleString()}</span>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminAIGenerations;