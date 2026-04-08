import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, ArrowLeft, Calendar, MessageSquare, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MemberProfilePage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchProfileAndConnection = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const userRecord = await pb.collection('users').getOne(id, { $autoCancel: false });
        setProfile(userRecord);

        // Fetch connection status if not viewing own profile
        if (currentUser.id !== id) {
          try {
            const connRecord = await pb.collection('member_connections').getFirstListItem(
              `(user_id = "${currentUser.id}" && connected_user_id = "${id}") || (user_id = "${id}" && connected_user_id = "${currentUser.id}")`,
              { $autoCancel: false }
            );
            setConnection(connRecord);
          } catch (e) {
            // No connection exists, that's fine
            setConnection(null);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Profile not found');
        navigate('/member/directory');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfileAndConnection();
    }
  }, [id, currentUser.id, navigate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (connection) {
        // Disconnect
        await pb.collection('member_connections').delete(connection.id, { $autoCancel: false });
        setConnection(null);
        toast.success('Disconnected');
      } else {
        // Connect
        const newConn = await pb.collection('member_connections').create({
          user_id: currentUser.id,
          connected_user_id: id,
          status: 'connected' // Auto-connect for simplicity in this demo
        }, { $autoCancel: false });
        setConnection(newConn);
        toast.success('Connected successfully');
      }
    } catch (error) {
      toast.error('Failed to update connection');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMessage = () => {
    // Navigate to messages with this user selected
    navigate('/member/messages', { state: { startChatWith: profile } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const isOwnProfile = currentUser.id === profile.id;
  const avatarUrl = profile.avatar ? pb.files.getUrl(profile, profile.avatar) : null;
  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';
  const joinDate = new Date(profile.created).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <Helmet>
        <title>{profile.name || 'Member Profile'} - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
            </Button>

            <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-border/50">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
              <CardContent className="px-6 sm:px-10 pb-10 relative">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-8">
                  <Avatar className="w-32 h-32 rounded-2xl ring-4 ring-background shadow-md bg-card">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary rounded-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 pb-2">
                    <h1 className="text-3xl font-bold tracking-tight">{profile.name || 'Unnamed Member'}</h1>
                    <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                      <Badge variant="secondary" className="capitalize font-normal">{profile.role || 'Member'}</Badge>
                      <span className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Joined {joinDate}
                      </span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <div className="flex flex-wrap gap-3 pb-2">
                      <Button onClick={handleMessage} variant="outline" className="shadow-sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        onClick={handleConnect} 
                        disabled={isConnecting}
                        variant={connection ? "secondary" : "default"}
                        className="shadow-sm min-w-[120px]"
                      >
                        {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                         connection ? <><UserCheck className="w-4 h-4 mr-2" /> Connected</> : 
                         <><UserPlus className="w-4 h-4 mr-2" /> Connect</>}
                      </Button>
                    </div>
                  )}
                  {isOwnProfile && (
                    <div className="pb-2">
                      <Link to="/member/profile">
                        <Button variant="outline">Edit Profile</Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    {profile.bio ? (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">This member hasn't added a bio yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MemberProfilePage;