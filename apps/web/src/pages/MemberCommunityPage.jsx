import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Heart, Plus, Users } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import CreatePostDialog from '@/components/CreatePostDialog.jsx';

const MemberCommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let filterStr = 'is_published = true';
      if (filterType !== 'all') {
        filterStr += ` && post_type = "${filterType}"`;
      }

      const records = await pb.collection('member_posts').getList(1, 50, {
        filter: filterStr,
        sort: '-created',
        expand: 'author_id',
        $autoCancel: false
      });
      setPosts(records.items);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterType]);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      <Helmet>
        <title>Community - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  Community Feed
                </h1>
                <p className="text-muted-foreground mt-2">
                  Discuss, share, and learn with other AI professionals.
                </p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> New Post
              </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="discussion">Discussions</SelectItem>
                    <SelectItem value="question">Questions</SelectItem>
                    <SelectItem value="resource">Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <Card key={i} className="border-0 shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-6">Be the first to start a discussion!</p>
                  <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                    Create Post
                  </Button>
                </div>
              ) : (
                posts.map((post) => {
                  const author = post.expand?.author_id;
                  const avatarUrl = author?.avatar ? pb.files.getUrl(author, author.avatar) : null;
                  const initials = author?.name ? author.name.charAt(0).toUpperCase() : 'U';
                  const previewText = stripHtml(post.content).substring(0, 200) + '...';
                  
                  return (
                    <Card key={post.id} className="border-0 shadow-sm ring-1 ring-border/50 hover:shadow-md transition-all duration-200">
                      <CardHeader className="flex flex-row items-start gap-4 pb-3">
                        <Avatar className="w-10 h-10 rounded-xl mt-1">
                          <AvatarImage src={avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-primary/10 text-primary rounded-xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{author?.name || 'Unknown Member'}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-[10px] h-5 px-1.5 capitalize bg-muted">
                            {post.post_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <Link to={`/member/community/${post.id}`} className="block group">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-3">{previewText}</p>
                        </Link>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/5 pt-3 pb-3 flex items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                        <div className="flex-1 flex justify-end">
                          <Link to={`/member/community/${post.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">View Discussion</Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>

      <CreatePostDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={fetchPosts}
      />
    </>
  );
};

export default MemberCommunityPage;