import { useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';

const linkCache = {};

export const useNavigationLink = (linkName) => {
  const [link, setLink] = useState(linkCache[linkName] || null);
  const [loading, setLoading] = useState(!linkCache[linkName]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!linkName) {
      setLoading(false);
      return;
    }

    if (linkCache[linkName]) {
      setLink(linkCache[linkName]);
      setLoading(false);
      return;
    }

    const fetchLink = async () => {
      try {
        const record = await pb.collection('navigation_links').getFirstListItem(`name="${linkName}" && is_active=true`, {
          $autoCancel: false
        });
        
        const linkData = {
          id: record.id,
          url: record.url,
          open_in_new_tab: record.open_in_new_tab,
          is_active: record.is_active,
          link_type: record.link_type,
          category: record.category,
          name: record.name
        };
        
        linkCache[linkName] = linkData;
        
        if (isMounted.current) {
          setLink(linkData);
        }
      } catch (error) {
        // Silently fail if link not found, just return null
        if (isMounted.current) {
          setLink(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchLink();
  }, [linkName]);

  return { link, loading };
};