import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ 
  slot, 
  format = "auto", 
  responsive = true, 
  className = "",
  style = {} 
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && typeof window !== 'undefined') {
      try {
        // Google AdSense
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
        
        // Media.net
        if (window._mNHandle) {
          window._mNHandle.queue = window._mNHandle.queue || [];
          window._mNHandle.queue.push(() => {
            window._mNDetails = window._mNDetails || {};
            window._mNDetails.loadTag(slot, adRef.current);
          });
        }
      } catch (error) {
        console.warn('Ad initialization error:', error);
      }
    }
  }, [slot]);

  return (
    <div className={`ad-container ${className}`} style={style}>
      {/* Google AdSense */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
      
      {/* Media.net fallback */}
      <div
        id={`${slot}-medianet`}
        style={{ display: "none" }}
        data-type="_mgc"
        data-mcn={slot}
      />
      
      {/* Amazon Associates fallback */}
      <div
        id={`${slot}-amazon`}
        style={{ display: "none" }}
        data-amzn_assoc_ad_mode="manual"
        data-amzn_assoc_ad_type="smart"
        data-amzn_assoc_marketplace="amazon"
        data-amzn_assoc_region="US"
        data-amzn_assoc_design="enhanced_links"
        data-amzn_assoc_asins={import.meta.env.VITE_AMAZON_ASIN}
        data-amzn_assoc_placement={slot}
        data-amzn_assoc_linkid={import.meta.env.VITE_AMAZON_LINK_ID}
      />
    </div>
  );
}