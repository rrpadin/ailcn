import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ConsultantLandingPage from './pages/ConsultantLandingPage.jsx';
import OrganizationLandingPage from './pages/OrganizationLandingPage.jsx';
import ApplicantPage from './pages/ApplicantPage.jsx';
import MemberDashboard from './pages/MemberDashboard.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import MemberAnnouncementsPage from './pages/MemberAnnouncementsPage.jsx';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage.jsx';
import MemberDirectoryPage from './pages/MemberDirectoryPage.jsx';
import MemberProfilePage from './pages/MemberProfilePage.jsx';
import MemberMessagesPage from './pages/MemberMessagesPage.jsx';
import MemberCommunityPage from './pages/MemberCommunityPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminCMS from './pages/AdminCMS.jsx';
import AdminApplications from './pages/AdminApplications.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminPrograms from './pages/AdminPrograms.jsx';
import AdminAnalytics from './pages/AdminAnalytics.jsx';
import AdminNavigationLinks from './pages/AdminNavigationLinks.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import AdminCourses from './pages/AdminCourses.jsx';
import AdminAISettings from './pages/AdminAISettings.jsx';
import AdminAIKnowledge from './pages/AdminAIKnowledge.jsx';
import AdminAIGenerations from './pages/AdminAIGenerations.jsx';
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage.jsx';
import PageManagementPage from './pages/PageManagementPage.jsx';
import PageView from './pages/PageView.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/consultants" element={<ConsultantLandingPage />} />
          <Route path="/organizations" element={<OrganizationLandingPage />} />
          <Route path="/applicants" element={<ApplicantPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dynamic Pages Route */}
          <Route path="/page/:slug" element={<PageView />} />

          {/* Protected Member Routes */}
          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/profile"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/announcements"
            element={
              <ProtectedRoute>
                <MemberAnnouncementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/announcements/:id"
            element={
              <ProtectedRoute>
                <AnnouncementDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/directory"
            element={
              <ProtectedRoute>
                <MemberDirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/directory/:id"
            element={
              <ProtectedRoute>
                <MemberProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/messages"
            element={
              <ProtectedRoute>
                <MemberMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/community"
            element={
              <ProtectedRoute>
                <MemberCommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/community/:id"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <TrainingPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminAnnouncementsPage />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/pages"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <PageManagementPage />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminCourses />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/cms"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminCMS />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminApplications />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/programs"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminPrograms />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/navigation-links"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminNavigationLinks />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/ai-settings"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminAISettings />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/ai-knowledge"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminAIKnowledge />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/ai-generations"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminAIGenerations />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;