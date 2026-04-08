import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const PageView = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const record = await pb.collection('pages').getFirstListItem(`slug="${slug}"`, {
          $autoCancel: false
        });
        
        if (!record.is_visible) {
          throw new Error('Page not found');
        }
        
        setPage(record);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Page not found or is currently unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading page...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = page.featured_image 
    ? pb.files.getUrl(page, page.featured_image) 
    : null;

  return (
    <>
      <Helmet>
        <title>{page.meta_title || page.title} - AILCN</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12 md:py-20">
          <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {page.description}
                </p>
              )}
            </header>

            {imageUrl && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border bg-muted">
                <img 
                  src={imageUrl} 
                  alt={page.title} 
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </article>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PageView;