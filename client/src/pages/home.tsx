import { Music } from "lucide-react";
import Converter from "@/components/converter";
import FeaturesSection from "@/components/features-section";
import InstructionsSection from "@/components/instructions-section";
import AdManager, { useAdPlacement } from "@/components/ads/ad-manager";

export default function Home() {
  const { renderAd } = useAdPlacement();
  
  // Ad configuration - easily customizable
  const adConfig = {
    googleAdsense: {
      client: import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT || "ca-pub-xxxxxxxxxxxxxxxx",
      slots: {
        header: import.meta.env.VITE_ADSENSE_HEADER_SLOT || "1234567890",
        content: import.meta.env.VITE_ADSENSE_CONTENT_SLOT || "1234567891",
        sidebar: import.meta.env.VITE_ADSENSE_SIDEBAR_SLOT || "1234567892",
        footer: import.meta.env.VITE_ADSENSE_FOOTER_SLOT || "1234567893",
      }
    },
    propellerAds: {
      zoneIds: {
        banner: import.meta.env.VITE_PROPELLER_BANNER_ZONE || "123456",
        native: import.meta.env.VITE_PROPELLER_NATIVE_ZONE || "123457",
        interstitial: import.meta.env.VITE_PROPELLER_INTERSTITIAL_ZONE || "123458",
        push: import.meta.env.VITE_PROPELLER_PUSH_ZONE || "123459",
      }
    },
    popAds: {
      siteId: import.meta.env.VITE_POPADS_SITE_ID || "123456",
      enabled: import.meta.env.VITE_ENABLE_POPADS === "true"
    },
    customAds: {
      header: import.meta.env.VITE_CUSTOM_HEADER_AD,
      footer: import.meta.env.VITE_CUSTOM_FOOTER_AD,
      sidebar: import.meta.env.VITE_CUSTOM_SIDEBAR_AD,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ad Manager for popups and background ads */}
      <AdManager config={adConfig} showAds={true} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Music className="text-primary-foreground text-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">YouTube MP3 Downloader</h1>
                  <p className="text-sm text-gray-600">Professional audio converter with quality control</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Ad */}
        <div className="border-t border-gray-100">
          {renderAd('header', adConfig, 'header-ad')}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Converter />
            
            {/* Content Ad */}
            <div className="my-8">
              {renderAd('content', adConfig, 'content-ad')}
            </div>
            
            <FeaturesSection />
            <InstructionsSection />
          </div>
          
          {/* Sidebar with Ads */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Sidebar Ad */}
              {renderAd('sidebar', adConfig, 'sidebar-ad')}
              
              {/* Additional sidebar content can go here */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Use 320 kbps for best quality</li>
                  <li>• 128 kbps for smaller file sizes</li>
                  <li>• Works with all YouTube videos</li>
                  <li>• Fast and secure conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Ad */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderAd('footer', adConfig, 'footer-ad')}
          
          <div className="py-6 text-center text-sm text-gray-500">
            <p>&copy; 2025 YouTube MP3 Downloader. Free online audio converter.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
