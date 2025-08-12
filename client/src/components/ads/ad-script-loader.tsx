import { useEffect } from "react";

interface AdScript {
  src: string;
  async?: boolean;
  defer?: boolean;
  crossOrigin?: string;
  onLoad?: () => void;
}

export default function AdScriptLoader() {
  useEffect(() => {
    const scripts: AdScript[] = [
      // Google AdSense
      {
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT}`,
        async: true,
        crossOrigin: "anonymous"
      },
      // Media.net
      {
        src: "https://contextual.media.net/dmedianet.js?cid=" + import.meta.env.VITE_MEDIANET_CID,
        async: true
      },
      // Amazon Associates
      {
        src: "//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US",
        async: true
      },
      // Propeller Ads
      {
        src: `https://www.propellerads.com/js/${import.meta.env.VITE_PROPELLER_ZONE_ID}.js`,
        async: true
      },
      // PopAds
      {
        src: `https://c.popads.net/pop.js`,
        async: true
      },
      // RevContent
      {
        src: "https://labs-cdn.revcontent.com/build/lb.min.js",
        async: true
      },
      // Taboola
      {
        src: "https://cdn.taboola.com/libtrc/unip/loader.js",
        async: true
      },
      // Outbrain
      {
        src: "https://widgets.outbrain.com/outbrain.js",
        async: true
      }
    ];

    const loadedScripts: HTMLScriptElement[] = [];

    scripts.forEach((scriptConfig) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src*="${scriptConfig.src.split('?')[0]}"]`);
      if (existingScript) return;

      const script = document.createElement('script');
      script.src = scriptConfig.src;
      script.async = scriptConfig.async || false;
      script.defer = scriptConfig.defer || false;
      
      if (scriptConfig.crossOrigin) {
        script.crossOrigin = scriptConfig.crossOrigin;
      }

      if (scriptConfig.onLoad) {
        script.onload = scriptConfig.onLoad;
      }

      script.onerror = () => {
        console.warn(`Failed to load ad script: ${scriptConfig.src}`);
      };

      document.head.appendChild(script);
      loadedScripts.push(script);
    });

    // Initialize window objects for ad networks
    if (typeof window !== 'undefined') {
      // Google AdSense
      window.adsbygoogle = window.adsbygoogle || [];
      
      // Media.net
      window._mNHandle = window._mNHandle || {};
      window._mNHandle.queue = window._mNHandle.queue || [];
      
      // Propeller Ads
      window.PropellerAds = window.PropellerAds || {};
      
      // PopAds configuration
      if (import.meta.env.VITE_POPADS_SITE_ID) {
        window.pa_site_id = import.meta.env.VITE_POPADS_SITE_ID;
      }
    }

    // Cleanup function
    return () => {
      loadedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return null;
}