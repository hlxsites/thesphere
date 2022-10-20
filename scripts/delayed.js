// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './scripts.js';

const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// Global site tag (gtag.js) - Google Analytics Start

// Initialize the data layer for Google Tag Manager (this should mandatorily be done before the Cookie Solution is loaded)
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
// Default consent mode is "denied" for both ads and analytics as well as the optional types, but delay for 2 seconds until the Cookie Solution is loaded
gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied", // optional
  personalization_storage: "denied", // optional
  security_storage: "denied", // optional
  wait_for_update: 2000 // milliseconds
});

// Improve ad click measurement quality (optional)
gtag('set', 'url_passthrough', true);

// Further redact your ads data (optional)
gtag("set", "ads_data_redaction", true);

//Global site tag (gtag.js) - Google Analytics End-->

//Google Tag Manager Start

(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({
    'gtm.start':
      new Date().getTime(), event: 'gtm.js'
  });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-PQFSS83');

//End Google Tag Manager

// OneTrust Cookies Consent Notice start

loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
  type: 'text/javascript',
  charset: 'UTF-8',
  'data-domain-script': 'f7c01035-72d2-4100-8be0-2b69fc01a195',
});

window.OptanonWrapper = () => { };
// OneTrust Cookies Consent Notice end
