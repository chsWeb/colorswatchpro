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

// ------------------------------------------------
// HERO DEMO PANEL TRACKING
// Precision events for all #hd-panel interactions
// ------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

  // Color picker — fires on mouseup/change, not every drag tick
  var colorPicker = document.getElementById('hdColorPicker');
  if (colorPicker) {
    colorPicker.addEventListener('change', function (e) {
      var hex = e.target.value.replace('#', '');
      var r = parseInt(hex.substring(0, 2), 16) / 255;
      var g = parseInt(hex.substring(2, 4), 16) / 255;
      var b = parseInt(hex.substring(4, 6), 16) / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      var h = 0, s = 0, l = (max + min) / 2;
      if (d) {
        s = d / (1 - Math.abs(2 * l - 1));
        if (max === r) h = ((g - b) / d + 6) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h = Math.round(h * 60);
      }
      mixpanel.track('Demo Color Changed', {
        hex: '#' + hex,
        hue: h,
        saturation: Math.round(s * 100),
        lightness: Math.round(l * 100),
        source: 'color_picker'
      });
    });
  }

  // Hex text input — fires after user stops typing
  var hexInput = document.getElementById('hdHexInput');
  if (hexInput) {
    hexInput.addEventListener('blur', function (e) {
      var v = e.target.value.replace(/[^0-9a-fA-F]/g, '');
      if (v.length === 6) {
        mixpanel.track('Demo Color Changed', { hex: '#' + v, source: 'hex_input' });
      }
    });
  }

  // Dark mode toggle
  var darkMode = document.getElementById('hdDarkMode');
  if (darkMode) {
    darkMode.addEventListener('change', function (e) {
      mixpanel.track('Demo Dark Mode Toggled', { dark_mode: e.target.checked });
    });
  }

  // Contrast mode segmented control
  var contrastMode = document.getElementById('hdContrastMode');
  if (contrastMode) {
    contrastMode.addEventListener('click', function (e) {
      if (e.target.dataset.val) {
        mixpanel.track('Demo Contrast Mode Selected', { contrast_mode: e.target.dataset.val });
      }
    });
  }

  // --name field — on blur
  var hdName = document.getElementById('hdName');
  if (hdName) {
    hdName.addEventListener('blur', function (e) {
      mixpanel.track('Demo Name Changed', { name: e.target.value });
    });
  }

  // -value field — on blur
  var hdValue = document.getElementById('hdValue');
  if (hdValue) {
    hdValue.addEventListener('blur', function (e) {
      mixpanel.track('Demo Value Changed', { value: e.target.value });
    });
  }

  // Token 1 toggle
  var token1 = document.getElementById('hdToken1');
  if (token1) {
    token1.addEventListener('change', function (e) {
      if (e.target.checked) {
        var tokenVal = document.getElementById('hdToken1Val');
        mixpanel.track('Demo Token Enabled', {
          token_name: tokenVal ? tokenVal.value : ''
        });
      }
    });
  }

  // Token 1 name — on blur
  var token1Val = document.getElementById('hdToken1Val');
  if (token1Val) {
    token1Val.addEventListener('blur', function (e) {
      mixpanel.track('Demo Token Named', { token_name: e.target.value });
    });
  }

});
