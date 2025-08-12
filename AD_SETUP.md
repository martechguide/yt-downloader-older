# Ad System Setup Guide

## Overview

The YouTube MP3 Downloader includes a comprehensive ad management system that supports multiple ad networks and platforms. This system is designed to be flexible, allowing you to easily integrate various ad providers to monetize your application.

## Supported Ad Networks

### 1. Google AdSense
- **Best for**: High-quality display ads with good revenue
- **Setup**: Requires AdSense account approval
- **Configuration**: Set client ID and slot IDs

### 2. Media.net
- **Best for**: Contextual ads, good AdSense alternative
- **Setup**: Media.net account required
- **Configuration**: Set CID and zone IDs

### 3. Propeller Ads
- **Best for**: Pop-unders, push notifications, native ads
- **Setup**: Quick approval process
- **Configuration**: Multiple zone types supported

### 4. PopAds
- **Best for**: Pop-under monetization
- **Setup**: Instant approval
- **Configuration**: Site ID required

### 5. Amazon Associates
- **Best for**: Product recommendations
- **Setup**: Amazon affiliate account
- **Configuration**: ASIN and tracking ID

### 6. Custom Ad Codes
- **Best for**: Direct advertisers, affiliate networks
- **Setup**: No account needed
- **Configuration**: Direct HTML/JavaScript insertion

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your ad network credentials:

```bash
cp .env.example .env
```

### 2. Google AdSense Setup

1. Apply for AdSense at https://www.google.com/adsense/
2. Get your publisher ID (ca-pub-xxxxxxxxxxxxxxxx)
3. Create ad units and note the slot IDs
4. Add to your `.env`:

```env
VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSENSE_HEADER_SLOT=1234567890
VITE_ADSENSE_CONTENT_SLOT=1234567891
VITE_ADSENSE_SIDEBAR_SLOT=1234567892
VITE_ADSENSE_FOOTER_SLOT=1234567893
```

### 3. Propeller Ads Setup

1. Sign up at https://propellerads.com/
2. Create campaigns for different ad types
3. Get zone IDs for each ad type
4. Add to your `.env`:

```env
VITE_PROPELLER_BANNER_ZONE=123456
VITE_PROPELLER_NATIVE_ZONE=123457
VITE_PROPELLER_INTERSTITIAL_ZONE=123458
VITE_PROPELLER_PUSH_ZONE=123459
```

### 4. PopAds Setup

1. Register at https://www.popads.net/
2. Add your website and get site ID
3. Add to your `.env`:

```env
VITE_POPADS_SITE_ID=123456
VITE_ENABLE_POPADS=true
```

### 5. Custom Ad Code Integration

For direct advertisers or other networks:

```env
VITE_CUSTOM_HEADER_AD=<script src="https://example.com/ads.js"></script>
VITE_CUSTOM_FOOTER_AD=<div>Your banner HTML here</div>
```

## Ad Placement Locations

The system includes strategic ad placements:

1. **Header Ad**: Above the main content (728x90 or responsive)
2. **Content Ad**: Between converter and features (300x250 or responsive)
3. **Sidebar Ad**: Sticky sidebar ad (300x600 or responsive)
4. **Footer Ad**: Bottom of page (728x90 or responsive)
5. **Pop-up/Pop-under**: Background ads (configurable timing)

## Customization

### Adding New Ad Networks

1. Create a new component in `client/src/components/ads/`
2. Add configuration interface to `AdConfig` type
3. Update `AdManager` component to load scripts
4. Add rendering logic to `useAdPlacement` hook

### Disabling Ads

Set in your `.env`:

```env
VITE_ENABLE_ADS=false
```

Or modify the `showAds` prop in `Home.tsx`:

```tsx
<AdManager config={adConfig} showAds={false} />
```

### Ad Refresh

Ads can be refreshed periodically:

```env
VITE_AD_REFRESH_INTERVAL=30000  # 30 seconds
```

## Best Practices

### Revenue Optimization
- Use multiple ad networks for better fill rates
- Test different ad sizes and positions
- Monitor performance and adjust accordingly
- Consider user experience in ad placement

### Performance
- Ads are loaded asynchronously to not block page rendering
- Scripts are deduplicated to avoid multiple loads
- Error handling prevents ad failures from breaking the app

### Compliance
- Ensure compliance with each network's policies
- Add privacy policy mentioning ad cookies
- Consider GDPR/CCPA compliance for international users
- Test ads don't interfere with core functionality

## Troubleshooting

### Common Issues

1. **Ads not showing**
   - Check environment variables are set correctly
   - Verify ad network account status
   - Check browser ad blockers
   - Review browser console for errors

2. **Script loading errors**
   - Ensure network URLs are correct
   - Check for HTTPS/HTTP mixed content issues
   - Verify ad network status

3. **Revenue not tracking**
   - Confirm tracking codes are implemented
   - Check ad network dashboards
   - Verify click/impression tracking

### Debug Mode

Enable console logging to debug ad loading:

```tsx
// In AdManager component, set debug to true
const debug = true;
if (debug) console.log('Loading ad script:', src);
```

## Support

For ad network specific issues:
- Google AdSense: https://support.google.com/adsense/
- Media.net: https://help.media.net/
- Propeller Ads: https://propellerads.com/support/
- PopAds: https://www.popads.net/contact

For implementation issues, check the component source code in `client/src/components/ads/`.