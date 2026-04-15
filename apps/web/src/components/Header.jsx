import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, LayoutDashboard, Menu, X, User, Megaphone, MessageSquare, Users, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigationLink } from '@/hooks/useNavigationLink.js';
import pb from '@/lib/pocketbaseClient';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerLinks, setHeaderLinks] = useState([]);
  const [dynamicPages, setDynamicPages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const { link: applyLink } = useNavigationLink('Apply Button');

  useEffect(() => {
    const fetchHeaderLinks = async () => {
      try {
        const records = await pb.collection('navigation_links').getFullList({
          filter: 'category="header_menu" && is_active=true',
          sort: 'sort_order,name',   // ← now sorted by sort_order first
          $autoCancel: false
        });
        setHeaderLinks(records);
      } catch (error) {
        console.error('Failed to fetch header links', error);
      }
    };

    const fetchDynamicPages = async () => {
      try {
        const records = await pb.collection('pages').getList(1, 50, {
          filter: 'is_visible=true',
          sort: 'order,-created',
          $autoCancel: false
        });
        setDynamicPages(records.items);
      } catch (error) {
        console.error('Failed to fetch dynamic pages', error);
      }
    };

    const fetchUnreadMessages = async () => {
      if (!isAuthenticated || !currentUser) return;
      try {
        const records = await pb.collection('messages').getList(1, 1, {
          filter: `recipient_id = "${currentUser.id}" && is_read = false`,
          $autoCancel: false
        });
        setUnreadMessages(records.totalItems);
      } catch (error) {
        console.error('Failed to fetch unread messages', error);
      }
    };

    fetchHeaderLinks();
    fetchDynamicPages();
    fetchUnreadMessages();

    pb.collection('pages').subscribe('*', () => fetchDynamicPages());
    if (isAuthenticated && currentUser) {
      pb.collection('messages').subscribe('*', (e) => {
        if (e.record.recipient_id === currentUser.id) {
          fetchUnreadMessages();
        }
      });
    }

    return () => {
      pb.collection('pages').unsubscribe('*');
      pb.collection('messages').unsubscribe('*');
    };
  }, [isAuthenticated, currentUser]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const applyUrl = applyLink?.url || '/signup';
  const applyIsExternal = applyLink?.link_type === 'external';
  const applyTarget = applyLink?.open_in_new_tab ? "_blank" : undefined;

  const renderNavLink = (link, isMobile = false) => {
    const baseClasses = isMobile
      ? `text-sm font-medium uppercase tracking-[0.14em] ${isActive(link.url) ? 'text-primary' : 'text-foreground'}`
      : `text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive(link.url) ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`;

    if (link.link_type === 'external') {
      return (
        <a
          key={link.id}
          href={link.url}
          target={link.open_in_new_tab ? "_blank" : undefined}
          rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
          className={baseClasses}
          onClick={isMobile ? closeMobileMenu : undefined}
        >
          {link.name}
        </a>
      );
    }

    return (
      <Link
        key={link.id}
        to={link.url}
        target={link.open_in_new_tab ? "_blank" : undefined}
        className={baseClasses}
        onClick={isMobile ? closeMobileMenu : undefined}
      >
        {link.name}
      </Link>
    );
  };

  const renderDynamicPageLink = (page, isMobile = false) => {
    const url = `/page/${page.slug}`;
    const baseClasses = isMobile
      ? `text-sm font-medium uppercase tracking-[0.14em] ${isActive(url) ? 'text-primary' : 'text-foreground'}`
      : `text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive(url) ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`;

    return (
      <Link
        key={`page-${page.id}`}
        to={url}
        className={baseClasses}
        onClick={isMobile ? closeMobileMenu : undefined}
      >
        {page.title}
      </Link>
    );
  };

  const renderConsultantDirectoryLink = (isMobile = false) => {
    const url = '/consultants/directory';
    const baseClasses = isMobile
      ? `text-sm font-medium uppercase tracking-[0.14em] ${isActive(url) ? 'text-primary' : 'text-foreground'}`
      : `text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive(url) ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`;

    return (
      <Link
        key="consultant-directory-nav"
        to={url}
        className={baseClasses}
        onClick={isMobile ? closeMobileMenu : undefined}
      >
        Consultant Directory
      </Link>
    );
  };

  const userInitials = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  const avatarUrl = currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <img src="/ailcn-icon.png" alt="AILCN logo" className="h-11 w-11 rounded-xl shadow-sm" />
            <div>
              <div className="font-display text-2xl leading-none tracking-[0.08em] text-primary">AILCN</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">AI Learning Consultant Network</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {!isAuthenticated ? (
              <>
                {headerLinks.length > 0 ? (
                  <>
                    {headerLinks.map(link => renderNavLink(link, false))}
                    {renderConsultantDirectoryLink(false)}
                  </>
                ) : (
                  <>
                    <Link to="/" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive('/') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>Home</Link>
                    <Link to="/consultants" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive('/consultants') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>For Consultants</Link>
                    {renderConsultantDirectoryLink(false)}
                    <Link to="/organizations" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive('/organizations') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>For Organizations</Link>
                    <Link to="/resources" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary ${isActive('/resources') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>Resources</Link>
                  </>
                )}
                {dynamicPages.map(page => renderDynamicPageLink(page, false))}
              </>
            ) : (
              <>
                <Link to="/member/dashboard" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/member/dashboard') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/member/announcements" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/member/announcements') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>
                  <Megaphone className="w-4 h-4" /> Announcements
                </Link>
                <Link to="/member/community" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/member/community') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>
                  <MessageSquare className="w-4 h-4" /> Community
                </Link>
                <Link to="/member/directory" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/member/directory') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>
                  <Users className="w-4 h-4" /> Directory
                </Link>
                <Link to="/member/messages" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/member/messages') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>
                  <div className="relative">
                    <Mail className="w-4 h-4" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                    )}
                  </div>
                  Messages
                </Link>
                {isAdmin && (
                  <Link to="/admin/announcements" className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/admin/announcements') ? 'text-foreground border-b border-gold pb-1' : 'text-muted-foreground'}`}>
                    Manage
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-none text-xs uppercase tracking-[0.18em] transition-all duration-200">
                    Log in
                  </Button>
                </Link>

                {applyIsExternal ? (
                  <a href={applyUrl} target={applyTarget} rel={applyTarget ? "noopener noreferrer" : undefined}>
                    <Button size="sm" className="rounded-none border border-primary bg-primary px-4 text-xs uppercase tracking-[0.18em] transition-all duration-200">
                      Sign Up
                    </Button>
                  </a>
                ) : (
                  <Link to="/signup">
                    <Button size="sm" className="rounded-none border border-primary bg-primary px-4 text-xs uppercase tracking-[0.18em] transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="transition-all duration-200">
                      Admin Panel
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-2 border-l">
                  <Link to="/member/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8 rounded-lg border">
                      <AvatarImage src={avatarUrl} alt={currentUser?.name || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs rounded-lg">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline-block">
                      {currentUser?.name?.split(' ')[0] || 'Member'}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && unreadMessages > 0 && (
              <Link to="/member/messages" onClick={closeMobileMenu}>
                <Badge variant="destructive" className="h-5 px-1.5">{unreadMessages}</Badge>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {isAuthenticated && (
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="w-10 h-10 rounded-lg border">
                  <AvatarImage src={avatarUrl} alt={currentUser?.name || 'User'} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{currentUser?.name || 'Member'}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-4">
              {!isAuthenticated ? (
                <>
                  {headerLinks.length > 0 ? (
                    <>
                      {headerLinks.map(link => renderNavLink(link, true))}
                      {renderConsultantDirectoryLink(true)}
                    </>
                  ) : (
                    <>
                      <Link to="/" onClick={closeMobileMenu} className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-foreground'}`}>Home</Link>
                      <Link to="/consultants" onClick={closeMobileMenu} className={`text-sm font-medium ${isActive('/consultants') ? 'text-primary' : 'text-foreground'}`}>For Consultants</Link>
                      {renderConsultantDirectoryLink(true)}
                      <Link to="/organizations" onClick={closeMobileMenu} className={`text-sm font-medium ${isActive('/organizations') ? 'text-primary' : 'text-foreground'}`}>For Organizations</Link>
                      <Link to="/resources" onClick={closeMobileMenu} className={`text-sm font-medium ${isActive('/resources') ? 'text-primary' : 'text-foreground'}`}>Resources</Link>
                    </>
                  )}
                  {dynamicPages.map(page => renderDynamicPageLink(page, true))}
                </>
              ) : (
                <>
                  <Link to="/member/dashboard" onClick={closeMobileMenu} className={`text-sm font-medium flex items-center gap-2 ${isActive('/member/dashboard') ? 'text-primary' : 'text-foreground'}`}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/member/announcements" onClick={closeMobileMenu} className={`text-sm font-medium flex items-center gap-2 ${isActive('/member/announcements') ? 'text-primary' : 'text-foreground'}`}>
                    <Megaphone className="w-4 h-4" /> Announcements
                  </Link>
                  <Link to="/member/community" onClick={closeMobileMenu} className={`text-sm font-medium flex items-center gap-2 ${isActive('/member/community') ? 'text-primary' : 'text-foreground'}`}>
                    <MessageSquare className="w-4 h-4" /> Community
                  </Link>
                  <Link to="/member/directory" onClick={closeMobileMenu} className={`text-sm font-medium flex items-center gap-2 ${isActive('/member/directory') ? 'text-primary' : 'text-foreground'}`}>
                    <Users className="w-4 h-4" /> Directory
                  </Link>
                  <Link to="/member/messages" onClick={closeMobileMenu} className={`text-sm font-medium flex items-center gap-2 ${isActive('/member/messages') ? 'text-primary' : 'text-foreground'}`}>
                    <Mail className="w-4 h-4" /> Messages
                    {unreadMessages > 0 && <Badge variant="destructive" className="ml-auto h-5 px-1.5">{unreadMessages}</Badge>}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/announcements" onClick={closeMobileMenu} className={`text-sm font-medium flex items-center gap-2 ${isActive('/admin/announcements') ? 'text-primary' : 'text-foreground'}`}>
                      Manage Announcements
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="pt-4 border-t flex flex-col space-y-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full justify-center">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <Button className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full justify-center">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link to="/member/profile" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-center">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
