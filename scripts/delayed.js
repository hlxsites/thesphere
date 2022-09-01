// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// Global site tag (gtag.js) - Google Analytics

// Initialize the data layer for Google Tag Manager
// (this should mandatorily be done before the Cookie Solution is loaded)
window.dataLayer = window.dataLayer || [];

function gtag(...args) {
  window.dataLayer.push(args);
}

// Default consent mode is "denied" for both ads and analytics as well as the optional types,
// but delay for 2 seconds until the Cookie Solution is loaded
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied', // optional
  personalization_storage: 'denied', // optional
  security_storage: 'denied', // optional
  wait_for_update: 2000, // milliseconds
});

// Improve ad click measurement quality (optional)
gtag('set', 'url_passthrough', true);

// Further redact your ads data (optional)
gtag('set', 'ads_data_redaction', true);

// Google Tag Manager
// eslint-disable-next-line
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KL3PT7C');