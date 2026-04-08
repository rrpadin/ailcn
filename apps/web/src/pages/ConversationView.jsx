import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ConversationView = ({ partner, onBack }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const records = await pb.collection('messages').getFullList({
        filter: `(sender_id = "${currentUser.id}" && recipient_id = "${partner.id}") || (sender_id = "${partner.id}" && recipient_id = "${currentUser.id}")`,
        sort: '+created',
        $autoCancel: false
      });
      setMessages(records);

      // Mark unread messages as read
      const unreadIds = records
        .filter(m => m.recipient_id === currentUser.id && !m.is_read)
        .map(m => m.id);
      
      for (const id of unreadIds) {
        await pb.collection('messages').update(id, { is_read: true }, { $autoCancel: false });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time messages
    pb.collection('messages').subscribe('*', function (e) {
      if (
        (e.record.sender_id === currentUser.id && e.record.recipient_id === partner.id) ||
        (e.record.sender_id === partner.id && e.record.recipient_id === currentUser.id)
      ) {
        if (e.action === 'create') {
          setMessages(prev => [...prev, e.record]);
          // If we received it, mark as read
          if (e.record.recipient_id === currentUser.id) {
            pb.collection('messages').update(e.record.id, { is_read: true }, { $autoCancel: false });
          }
        }
      }
    });

    return () => {
      pb.collection('messages').unsubscribe('*');
    };
  }, [partner.id, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await pb.collection('messages').create({
        sender_id: currentUser.id,
        recipient_id: partner.id,
        content: newMessage.trim(),
        is_read: false
      }, { $autoCancel: false });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const partnerAvatar = partner.avatar ? pb.files.getUrl(partner, partner.avatar) : null;
  const partnerInitials = partner.name ? partner.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-muted/20">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden mr-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10 rounded-xl">
          <AvatarImage src={partnerAvatar} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary rounded-xl">{partnerInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{partner.name || 'Unknown User'}</h3>
          <p className="text-xs text-muted-foreground capitalize">{partner.role || 'Member'}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <span className={`text-[10px] mt-1 block ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                    {new Date(msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim() || isSending}
            className="rounded-full shrink-0"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;