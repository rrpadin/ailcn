import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Normalize email input
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log('🔐 Attempting admin login for:', normalizedEmail);

    try {
      // Call PocketBase admin collection authentication
      const authData = await pb.collection('admins').authWithPassword(normalizedEmail, password, {
        $autoCancel: false
      });
      
      // Log successful authentication
      console.log('✅ Admin authentication successful');
      console.log('User ID:', authData.record.id);
      console.log('User Email:', authData.record.email);
      
      // Show success toast
      toast.success('Admin login successful');
      
      // CRITICAL FIX: Redirect to admin dashboard immediately after successful auth
      // This happens synchronously before any other logic
      console.log('🚀 Redirecting to /admin...');
      navigate('/admin');
      
    } catch (error) {
      // Detailed error logging for debugging
      console.error('❌ Admin login failed');
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error response:', error.response);
      
      // Display user-friendly error message
      let errorMessage = 'Invalid email or password';
      
      if (error.response?.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Login failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - AILCN</title>
        <meta name="description" content="Admin login for AILCN management dashboard" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <Card className="w-full max-w-md shadow-lg rounded-2xl border-border/50">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center tracking-tight">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground"
                  placeholder="admin@ailcn.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full transition-all duration-200 active:scale-[0.98] mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLoginPage;