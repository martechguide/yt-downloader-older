// Window object extensions for ad networks
declare global {
  interface Window {
    // Google AdSense
    adsbygoogle?: any[];
    
    // Media.net
    _mNHandle?: {
      queue?: any[];
      [key: string]: any;
    };
    _mNDetails?: {
      loadTag?: (slot: string, element: HTMLElement) => void;
      [key: string]: any;
    };
    
    // Propeller Ads
    PropellerAds?: {
      [key: string]: any;
    };
    
    // PopAds
    pa_site_id?: string;
    pa_page_id?: string;
    
    // Amazon Associates
    amazon_ad_tag?: any;
    amzn_assoc_ad_mode?: string;
    
    // Taboola
    _taboola?: any[];
    
    // Outbrain
    OBR?: {
      extern?: {
        researchWidget?: () => void;
      };
    };
    
    // RevContent
    RCwidget?: any;
    
    // General ad callbacks
    [key: string]: any;
  }
}

export {};