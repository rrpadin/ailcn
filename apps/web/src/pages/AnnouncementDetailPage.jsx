import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, ArrowLeft, Calendar, User, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';

const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setIsLoading(true);
      try {
        const record = await pb.collection('announcements').getOne(id, {
          expand: 'posted_by',
          $autoCancel: false
        });
        setAnnouncement(record);
      } catch (err) {
        console.error('Error fetching announcement:', err);
        setError('Announcement not found or you do not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

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

  if (error || !announcement) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <h1 className="text-2xl font-bold">Announcement Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = announcement.featured_image 
    ? pb.files.getUrl(announcement, announcement.featured_image) 
    : null;

  const postedDate = new Date(announcement.created).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const authorName = announcement.expand?.posted_by?.name || 'Admin';

  return (
    <>
      <Helmet>
        <title>{announcement.title} - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 py-12">
          <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 -ml-4 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="capitalize bg-primary/10 text-primary hover:bg-primary/20">
                  {announcement.announcement_type}
                </Badge>
                {announcement.is_pinned && (
                  <Badge variant="outline" className="border-primary/30 text-primary">Pinned</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-foreground">
                {announcement.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{postedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Posted by {authorName}</span>
                </div>
              </div>
            </header>

            {imageUrl && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border bg-card">
                <img 
                  src={imageUrl} 
                  alt={announcement.title} 
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              </div>
            )}

            {announcement.video_url && (
              <div className="mb-10 aspect-video rounded-2xl overflow-hidden shadow-sm border bg-black">
                <iframe 
                  src={announcement.video_url.replace('watch?v=', 'embed/')} 
                  title="Video player"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary bg-card p-8 rounded-2xl shadow-sm border"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </article>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AnnouncementDetailPage;