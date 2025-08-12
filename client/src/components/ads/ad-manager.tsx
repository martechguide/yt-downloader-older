import { useEffect } from "react";
import AdBanner from "./ad-banner";
import PopAd from "./pop-ad";
import PropellerAd from "./propeller-ad";

interface AdConfig {
  // Google AdSense
  googleAdsense?: {
    client: string;
    slots: {
      header?: string;
      sidebar?: string;
      footer?: string;
      content?: string;
    };
  };
  
  // Media.net
  mediaNet?: {
    cid: string;
    slots: {
      header?: string;
      content?: string;
    };
  };
  
  // Propeller Ads
  propellerAds?: {
    zoneIds: {
      banner?: string;
      native?: string;
      interstitial?: string;
      push?: string;
    };
  };
  
  // PopAds
  popAds?: {
    siteId: string;
    enabled: boolean;
  };
  
  // Amazon Associates
  amazonAssociates?: {
    trackingId: string;
    marketplace: string;
    region: string;
  };
  
  // Custom ad codes
  customAds?: {
    header?: string;
    footer?: string;
    sidebar?: string;
  };
}

interface AdManagerProps {
  config: AdConfig;
  showAds?: boolean;
}

export default function AdManager({ config, showAds = true }: AdManagerProps) {
  useEffect(() => {
    if (!showAds || typeof window === 'undefined') return;

    // Load ad scripts
    const loadAdScripts = async () => {
      const scripts: { src: string; id: string; onload?: () => void }[] = [];

      // Google AdSense
      if (config.googleAdsense?.client) {
        scripts.push({
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.googleAdsense.client}`,
          id: 'google-adsense-script'
        });
      }

      // Media.net
      if (config.mediaNet?.cid) {
        scripts.push({
          src: `https://contextual.media.net/dmedianet.js?cid=${config.mediaNet.cid}`,
          id: 'medianet-script'
        });
      }

      // Amazon Associates
      if (config.amazonAssociates) {
        scripts.push({
          src: '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US',
          id: 'amazon-associates-script'
        });
      }

      // Load scripts
      scripts.forEach(({ src, id, onload }) => {
        if (!document.getElementById(id)) {
          const script = document.createElement('script');
          script.id = id;
          script.src = src;
          script.async = true;
          script.crossOrigin = 'anonymous';
          
          if (onload) {
            script.onload = onload;
          }
          
          script.onerror = () => {
            console.warn(`Failed to load ad script: ${src}`);
          };
          
          document.head.appendChild(script);
        }
      });

      // Initialize window objects
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
    };

    loadAdScripts();
  }, [config, showAds]);

  if (!showAds) return null;

  return (
    <>
      {/* PopAds */}
      {config.popAds && (
        <PopAd 
          siteId={config.popAds.siteId} 
          enabled={config.popAds.enabled} 
        />
      )}
      
      {/* Propeller Ads */}
      {config.propellerAds?.zoneIds.push && (
        <PropellerAd 
          zoneId={config.propellerAds.zoneIds.push} 
          type="push" 
        />
      )}
      
      {config.propellerAds?.zoneIds.interstitial && (
        <PropellerAd 
          zoneId={config.propellerAds.zoneIds.interstitial} 
          type="interstitial" 
        />
      )}
    </>
  );
}

// Hook for easy ad placement
export function useAdPlacement() {
  const renderAd = (
    position: 'header' | 'content' | 'sidebar' | 'footer',
    config: AdConfig,
    className?: string
  ) => {
    const ads = [];

    // Google AdSense
    if (config.googleAdsense?.slots[position]) {
      ads.push(
        <AdBanner
          key={`adsense-${position}`}
          slot={config.googleAdsense.slots[position]!}
          className={className}
          format={position === 'sidebar' ? 'vertical' : 'auto'}
        />
      );
    }

    // Propeller Banner Ads
    if (config.propellerAds?.zoneIds.banner) {
      ads.push(
        <PropellerAd
          key={`propeller-${position}`}
          zoneId={config.propellerAds.zoneIds.banner}
          type="banner"
          className={className}
        />
      );
    }

    // Custom ad codes
    if (config.customAds?.[position]) {
      ads.push(
        <div
          key={`custom-${position}`}
          className={`custom-ad ${className || ''}`}
          dangerouslySetInnerHTML={{ __html: config.customAds[position]! }}
        />
      );
    }

    return ads;
  };

  return { renderAd };
}