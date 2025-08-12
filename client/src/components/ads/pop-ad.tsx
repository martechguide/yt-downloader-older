import { useEffect } from "react";

interface PopAdProps {
  siteId?: string;
  enabled?: boolean;
}

export default function PopAd({ siteId, enabled = true }: PopAdProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // PopAds implementation
    const loadPopAd = () => {
      try {
        if (siteId && !document.querySelector('#pop-ad-script')) {
          const script = document.createElement('script');
          script.id = 'pop-ad-script';
          script.src = 'https://c.popads.net/pop.js';
          script.async = true;
          
          script.onload = () => {
            (window as any).pa_site_id = siteId;
          };
          
          document.head.appendChild(script);
        }
      } catch (error) {
        console.warn('PopAd initialization failed:', error);
      }
    };

    // Load after a short delay to not interfere with main content
    const timer = setTimeout(loadPopAd, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [siteId, enabled]);

  return null;
}