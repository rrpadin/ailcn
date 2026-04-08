import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, MessageSquare, UserPlus } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MemberDirectoryPage = () => {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [connections, setConnections] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembersAndConnections = async () => {
      setIsLoading(true);
      try {
        // Fetch members (excluding admins for privacy, or just fetch all members)
        const membersRecord = await pb.collection('users').getList(1, 100, {
          filter: 'role != "admin"',
          sort: '-created',
          $autoCancel: false
        });
        
        // Fetch current user's connections
        const connectionsRecord = await pb.collection('member_connections').getFullList({
          filter: `user_id = "${currentUser.id}" || connected_user_id = "${currentUser.id}"`,
          $autoCancel: false
        });

        const connectedIds = new Set();
        connectionsRecord.forEach(conn => {
          if (conn.user_id === currentUser.id) connectedIds.add(conn.connected_user_id);
          if (conn.connected_user_id === currentUser.id) connectedIds.add(conn.user_id);
        });

        setMembers(membersRecord.items);
        setConnections(connectedIds);
      } catch (error) {
        console.error('Error fetching directory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembersAndConnections();
  }, [currentUser.id]);

  const filteredMembers = members.filter(member => 
    (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
    member.id !== currentUser.id // Don't show self in directory
  );

  return (
    <>
      <Helmet>
        <title>Member Directory - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  Member Directory
                </h1>
                <p className="text-muted-foreground mt-2">
                  Connect and collaborate with other AI professionals.
                </p>
              </div>
              
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search members by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card shadow-sm"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="border-0 shadow-sm ring-1 ring-border/50">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Skeleton className="w-20 h-20 rounded-2xl mb-4" />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-16 w-full mb-6" />
                      <div className="flex gap-2 w-full">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No members found</h3>
                <p className="text-muted-foreground">Try adjusting your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const avatarUrl = member.avatar ? pb.files.getUrl(member, member.avatar) : null;
                  const initials = member.name ? member.name.charAt(0).toUpperCase() : 'U';
                  const isConnected = connections.has(member.id);
                  
                  return (
                    <Card key={member.id} className="border-0 shadow-sm ring-1 ring-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6 flex flex-col items-center text-center h-full">
                        <Avatar className="w-20 h-20 rounded-2xl mb-4 ring-2 ring-background shadow-sm">
                          <AvatarImage src={avatarUrl} className="object-cover" />
                          <AvatarFallback className="text-2xl bg-primary/10 text-primary rounded-2xl">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="text-lg font-semibold line-clamp-1">{member.name || 'Unnamed Member'}</h3>
                        <p className="text-sm text-muted-foreground mb-4 capitalize">{member.role || 'Member'}</p>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                          {member.bio || 'No bio provided.'}
                        </p>
                        
                        <div className="flex gap-2 w-full mt-auto">
                          <Link to={`/member/directory/${member.id}`} className="flex-1">
                            <Button variant="outline" className="w-full text-xs h-9">
                              View Profile
                            </Button>
                          </Link>
                          <Link to={`/member/messages`} state={{ startChatWith: member }} className="flex-1">
                            <Button variant="secondary" className="w-full text-xs h-9 bg-primary/10 text-primary hover:bg-primary/20">
                              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                              Message
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MemberDirectoryPage;