import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Loader2, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pb from '@/lib/pocketbaseClient';

const EditProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Split name into first and last for the form
  const nameParts = currentUser?.name ? currentUser.name.split(' ') : ['', ''];
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    bio: currentUser?.bio || '' // Note: bio might not exist in DB yet
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      // Combine first and last name back into 'name' field
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      submitData.append('name', fullName);
      
      // Append bio if it exists in schema (might fail silently or throw depending on PB strict mode)
      // We append it anyway as requested by the task
      if (formData.bio !== undefined) {
        submitData.append('bio', formData.bio);
      }
      
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      await pb.collection('users').update(currentUser.id, submitData, { $autoCancel: false });
      
      toast.success('Profile updated successfully');
      navigate('/member/dashboard');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error?.response?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Profile - AILCN</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Link to="/member/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-3">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <Card className="shadow-sm border-0 ring-1 ring-border/50">
              <CardHeader className="border-b bg-card pb-6">
                <CardTitle className="text-2xl">Edit Profile</CardTitle>
                <CardDescription>Update your personal information and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Avatar Upload Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 rounded-2xl ring-4 ring-background shadow-sm">
                        <AvatarImage src={avatarPreview} className="object-cover" />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary rounded-2xl">
                          {formData.firstName.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        aria-label="Change profile picture"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-sm font-medium mb-1">Profile Picture</h3>
                      <p className="text-xs text-muted-foreground mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/jpeg,image/png,image/gif,image/webp" 
                        className="hidden" 
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>

                  {/* Personal Info Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={currentUser?.email || ''} 
                        disabled 
                        className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleChange} 
                        placeholder="Tell us a little about yourself..."
                        className="min-h-[120px] resize-y"
                      />
                      <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Link to="/member/dashboard">
                      <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default EditProfilePage;