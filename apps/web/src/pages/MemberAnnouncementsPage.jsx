import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, Calendar, Pin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';

const MemberAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const records = await pb.collection('announcements').getList(1, 50, {
          filter: 'is_published = true',
          sort: '-is_pinned,-created',
          $autoCancel: false
        });
        setAnnouncements(records.items);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      <Helmet>
        <title>Announcements - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Megaphone className="w-8 h-8 text-primary" />
                Announcements
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Stay updated with the latest news, resources, and events.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="overflow-hidden border-0 shadow-sm ring-1 ring-border/50">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No announcements yet</h3>
                <p className="text-muted-foreground">Check back later for updates from the community.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((item) => {
                  const imageUrl = item.featured_image 
                    ? pb.files.getUrl(item, item.featured_image) 
                    : null;
                  
                  const previewText = stripHtml(item.content).substring(0, 150) + '...';
                  const date = new Date(item.created).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });

                  return (
                    <Card key={item.id} className="flex flex-col overflow-hidden border-0 shadow-sm ring-1 ring-border/50 hover:shadow-md transition-all duration-200 group">
                      {imageUrl && (
                        <div className="h-48 overflow-hidden bg-muted">
                          <img 
                            src={imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="capitalize bg-primary/10 text-primary">
                            {item.announcement_type}
                          </Badge>
                          {item.is_pinned && (
                            <Pin className="w-4 h-4 text-primary fill-primary" />
                          )}
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          <Link to={`/member/announcements/${item.id}`}>
                            {item.title}
                          </Link>
                        </h3>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {previewText}
                        </p>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/10 pt-4 flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {date}
                        </div>
                        <Link to={`/member/announcements/${item.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                            Read More <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </Link>
                      </CardFooter>
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

export default MemberAnnouncementsPage;