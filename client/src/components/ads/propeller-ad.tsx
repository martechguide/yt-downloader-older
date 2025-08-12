import { useEffect } from "react";

interface PropellerAdProps {
  zoneId: string;
  type?: "banner" | "native" | "interstitial" | "push";
  className?: string;
}

export default function PropellerAd({ zoneId, type = "banner", className = "" }: PropellerAdProps) {
  useEffect(() => {
    if (!zoneId || typeof window === 'undefined') return;

    try {
      // Initialize Propeller Ads
      const script = document.createElement('script');
      script.async = true;
      
      if (type === "banner") {
        script.src = `https://www.propellerads.com/js/${zoneId}.js`;
      } else if (type === "native") {
        script.innerHTML = `
          (function(d, z, s) {
            s = d.createElement('script');
            s.async = true;
            s.src = 'https://' + (d.location.protocol === 'https:' ? 'ssl' : 'www') + '.propellerads.com/ntfc.php?p=' + z;
            d.body.appendChild(s);
          })(document, '${zoneId}');
        `;
      } else if (type === "interstitial") {
        script.innerHTML = `
          (function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://inklinkor.com/tag.min.js','${zoneId}',document.head);
        `;
      } else if (type === "push") {
        script.innerHTML = `
          (function(d,z,s){s=d.createElement('script');s.async=true;s.src='https://'+((d.location.protocol==='https:')?'ssl':'www')+'.propellerads.com/ntfc.php?p='+z;d.body.appendChild(s);})(document,'${zoneId}');
        `;
      }

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (error) {
      console.warn('Propeller Ads initialization failed:', error);
    }
  }, [zoneId, type]);

  if (type === "banner") {
    return (
      <div className={`propeller-ad-container ${className}`}>
        <div id={`propeller-${zoneId}`} />
      </div>
    );
  }

  // Other ad types are invisible/popup
  return null;
}