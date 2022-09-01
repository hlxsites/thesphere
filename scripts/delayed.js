// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

window.fsData = [{
  page: {
    pageInfo: {
      pageName: 'Sphere website',
      geoRegion: 'global',
      language: 'en',
    },
    category: {
      primaryCategory: 'investors',
      subCategory1: 'events',
    },
  },
}];

// Google Tag Manager
// eslint-disable-next-line
(function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f); })(window, document, 'script', 'dataLayer', 'GTM-KL3PT7C');
// End Google Tag Manager
