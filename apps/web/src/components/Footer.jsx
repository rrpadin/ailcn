import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Linkedin } from 'lucide-react';
import { useNavigationLinks } from '@/hooks/useNavigationLinks';

const Footer = () => {
  const { links: footerLinks, loading } = useNavigationLinks('footer');

  const renderLink = (link) => {
    // Clean up the "Footer - " prefix if it exists in the name
    const displayName = link.name.replace(/^Footer\s*-\s*/i, '');
    
    if (link.link_type === 'external' || link.url.startsWith('http')) {
      return (
        <li key={link.id}>
          <a
            href={link.url}
            target={link.open_in_new_tab ? "_blank" : undefined}
            rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {displayName}
          </a>
        </li>
      );
    }
    return (
      <li key={link.id}>
        <Link
          to={link.url}
          target={link.open_in_new_tab ? "_blank" : undefined}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          {displayName}
        </Link>
      </li>
    );
  };

  return (
    <footer className="ink-panel border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img
              src="/ailcn-lockup-transparent.png"
              alt="AILCN logo"
              className="h-16 w-auto object-contain"
            />
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              A vetted network for AI readiness, consultant certification, and stronger matches between capability and need.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 block text-white">Quick links</span>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/consultants" className="text-sm text-slate-400 hover:text-white transition-colors">
                  For consultants
                </Link>
              </li>
              <li>
                <Link to="/organizations" className="text-sm text-slate-400 hover:text-white transition-colors">
                  For organizations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 block text-white">Legal & About</span>
            <ul className="space-y-2">
              {loading ? (
                <li className="text-sm text-slate-400 animate-pulse">Loading links...</li>
              ) : footerLinks.length > 0 ? (
                footerLinks.map(renderLink)
              ) : (
                <>
                  <li>
                    <Link to="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                      Privacy policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                      Terms of service
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 block text-white">Contact</span>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-slate-400">
                <Mail className="w-4 h-4" />
                <span>contact@ailcn.com</span>
              </li>
              <li>
                <a
                  href="https://my.expandlms.com/default.aspx?encBrand=122505&name=AILCN_Academy_by_exitou_inc_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Academy</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/ailcn/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>


        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-sm text-slate-500 text-center uppercase tracking-[0.16em]">
            © 2026 AILCN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
