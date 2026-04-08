import { useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';

const categoryCache = {};

export const useNavigationLinks = (category) => {
  const [links, setLinks] = useState(categoryCache[category] || []);
  const [loading, setLoading] = useState(!categoryCache[category]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    if (categoryCache[category]) {
      setLinks(categoryCache[category]);
      setLoading(false);
      return;
    }

    const fetchLinks = async () => {
      try {
        const records = await pb.collection('navigation_links').getFullList({
          filter: `category="${category}" && is_active=true`,
          sort: 'created',
          $autoCancel: false
        });
        
        categoryCache[category] = records;
        
        if (isMounted.current) {
          setLinks(records);
        }
      } catch (error) {
        if (isMounted.current) {
          setLinks([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchLinks();
  }, [category]);

  return { links, loading };
};