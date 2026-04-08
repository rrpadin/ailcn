import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, ArrowLeft, MessageSquare, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPostAndComments = async () => {
    setIsLoading(true);
    try {
      const postRecord = await pb.collection('member_posts').getOne(id, {
        expand: 'author_id',
        $autoCancel: false
      });
      setPost(postRecord);

      const commentsRecord = await pb.collection('member_comments').getFullList({
        filter: `post_id = "${id}"`,
        sort: '+created',
        expand: 'author_id',
        $autoCancel: false
      });
      setComments(commentsRecord);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Post not found');
      navigate('/member/community');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPostAndComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await pb.collection('member_comments').create({
        post_id: id,
        author_id: currentUser.id,
        content: newComment.trim()
      }, { $autoCancel: false });
      
      // Update comment count on post
      await pb.collection('member_posts').update(id, {
        comments_count: (post.comments_count || 0) + 1
      }, { $autoCancel: false });

      setNewComment('');
      fetchPostAndComments(); // Refresh to get new comment with expanded author
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
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

  if (!post) return null;

  const author = post.expand?.author_id;
  const authorAvatar = author?.avatar ? pb.files.getUrl(author, author.avatar) : null;
  const authorInitials = author?.name ? author.name.charAt(0).toUpperCase() : 'U';
  const postDate = new Date(post.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Helmet>
        <title>{post.title} - Community - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Community
            </Button>

            {/* Main Post */}
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-8">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-12 h-12 rounded-xl">
                    <AvatarImage src={authorAvatar} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary rounded-xl">{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{author?.name || 'Unknown Member'}</h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-3 mt-0.5">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {postDate}</span>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 capitalize bg-muted">{post.post_type}</Badge>
                    </div>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-6">{post.title}</h1>
                
                <div 
                  className="prose prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="flex items-center gap-6 mt-8 pt-6 border-t text-muted-foreground">
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes_count || 0} Likes</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments_count || 0} Comments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Comments ({comments.length})</h3>
              
              {/* Add Comment */}
              <div className="bg-card rounded-xl border shadow-sm p-4 flex gap-4">
                <Avatar className="w-10 h-10 rounded-xl shrink-0 hidden sm:block">
                  <AvatarFallback className="bg-primary/10 text-primary rounded-xl">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea 
                    placeholder="Add a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-y bg-muted/30"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment} disabled={!newComment.trim() || isSubmitting}>
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {comments.map(comment => {
                  const cAuthor = comment.expand?.author_id;
                  const cAvatar = cAuthor?.avatar ? pb.files.getUrl(cAuthor, cAuthor.avatar) : null;
                  const cInitials = cAuthor?.name ? cAuthor.name.charAt(0).toUpperCase() : 'U';
                  
                  return (
                    <div key={comment.id} className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 flex gap-4">
                      <Avatar className="w-10 h-10 rounded-xl shrink-0">
                        <AvatarImage src={cAvatar} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary rounded-xl">{cInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-2">
                          <h4 className="font-medium text-sm">{cAuthor?.name || 'Unknown'}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PostDetailPage;