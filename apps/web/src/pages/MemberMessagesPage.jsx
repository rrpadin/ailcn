import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Search } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import ConversationView from './ConversationView.jsx';

const MemberMessagesPage = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(location.state?.startChatWith || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Fetch all messages involving current user
        const records = await pb.collection('messages').getFullList({
          filter: `sender_id = "${currentUser.id}" || recipient_id = "${currentUser.id}"`,
          sort: '-created',
          expand: 'sender_id,recipient_id',
          $autoCancel: false
        });

        // Group by partner
        const partnerMap = new Map();
        
        records.forEach(msg => {
          const isSender = msg.sender_id === currentUser.id;
          const partnerId = isSender ? msg.recipient_id : msg.sender_id;
          const partnerData = isSender ? msg.expand?.recipient_id : msg.expand?.sender_id;
          
          if (!partnerData) return;

          if (!partnerMap.has(partnerId)) {
            partnerMap.set(partnerId, {
              partner: partnerData,
              lastMessage: msg,
              unreadCount: (!isSender && !msg.is_read) ? 1 : 0
            });
          } else {
            const existing = partnerMap.get(partnerId);
            if (!isSender && !msg.is_read) {
              existing.unreadCount += 1;
            }
          }
        });

        // If we navigated here with a specific partner to chat with, ensure they are in the list
        if (activePartner && !partnerMap.has(activePartner.id)) {
          partnerMap.set(activePartner.id, {
            partner: activePartner,
            lastMessage: null,
            unreadCount: 0
          });
        }

        setConversations(Array.from(partnerMap.values()));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser.id, activePartner]);

  const filteredConversations = conversations.filter(c => 
    (c.partner.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Messages - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] min-h-[600px] flex gap-6">
            
            {/* Sidebar - Conversation List */}
            <Card className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col border-0 shadow-sm ring-1 ring-border/50 overflow-hidden ${activePartner ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b bg-card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Messages
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/50"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-card">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No conversations found.</p>
                    <p className="text-sm mt-2">Go to the Directory to start a chat.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conv) => {
                      const isActive = activePartner?.id === conv.partner.id;
                      const avatarUrl = conv.partner.avatar ? pb.files.getUrl(conv.partner, conv.partner.avatar) : null;
                      const initials = conv.partner.name ? conv.partner.name.charAt(0).toUpperCase() : 'U';
                      
                      return (
                        <button
                          key={conv.partner.id}
                          onClick={() => setActivePartner(conv.partner)}
                          className={`w-full p-4 flex items-start gap-3 text-left transition-colors hover:bg-muted/50 ${isActive ? 'bg-muted/80' : ''}`}
                        >
                          <Avatar className="w-12 h-12 rounded-xl shrink-0">
                            <AvatarImage src={avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary rounded-xl">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-medium truncate pr-2">{conv.partner.name}</h4>
                              {conv.lastMessage && (
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {new Date(conv.lastMessage.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                {conv.lastMessage ? conv.lastMessage.content : 'Start a conversation'}
                              </p>
                              {conv.unreadCount > 0 && (
                                <Badge className="h-5 min-w-5 flex items-center justify-center px-1 rounded-full bg-primary shrink-0">
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Main Chat Area */}
            <div className={`flex-1 h-full ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
              {activePartner ? (
                <ConversationView 
                  partner={activePartner} 
                  onBack={() => setActivePartner(null)} 
                />
              ) : (
                <Card className="w-full h-full flex flex-col items-center justify-center border-0 shadow-sm ring-1 ring-border/50 bg-card text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Your Messages</h3>
                  <p>Select a conversation from the sidebar to start chatting.</p>
                </Card>
              )}
            </div>

          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MemberMessagesPage;