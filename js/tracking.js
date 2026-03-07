// ================================================
// tracking.js
// Custom Mixpanel user profiling & spam detection
// ================================================

(function () {

  // ------------------------------------------------
  // SPAM LIST — add new device IDs here as you spot them
  // Find them in Mixpanel > Events, look for $device_id
  // ------------------------------------------------
  var knownSpamDeviceIds = [
    '90df5651-8e13-4ec0-abcb-671a2082e7a0'
  ];

  // ------------------------------------------------
  // USER PROFILING
  // Promotes every anonymous visitor into a real
  // profile so they appear in Mixpanel > Users
  // ------------------------------------------------
  mixpanel.identify(mixpanel.get_distinct_id());

  // Recorded once, on their very first visit — never overwritten
  mixpanel.people.set_once({
    first_seen: new Date().toISOString(),
    initial_referrer: document.referrer || 'direct'
  });

  // Updated on every visit
  mixpanel.people.set({
    last_seen: new Date().toISOString()
  });

  // ------------------------------------------------
  // SPAM DETECTION
  // Flags known spammer device IDs on any future visit,
  // regardless of what referrer domain they spoof
  // ------------------------------------------------
  var currentDeviceId = mixpanel.get_distinct_id().replace('$device:', '');

  if (knownSpamDeviceIds.includes(currentDeviceId)) {
    mixpanel.people.set({
      is_spammer: true,
      spammer_type: 'referral_spoofing'
    });
  }

})();
