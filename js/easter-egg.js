// ================================================
// easter-egg.js
// Nav toggle slot machine — cycles hd-swatch-color
// through palette colors when the nav toggle fires.
// ================================================

document.addEventListener('DOMContentLoaded', function () {

  var navToggle = document.getElementById('navDarkMode');
  var swatchColor = document.getElementById('hdSwatchColor');
  if (!navToggle || !swatchColor) return;

  var isSpinning = false;

  navToggle.addEventListener('change', function () {
    if (isSpinning) return;
    isSpinning = true;

    // Defer until after render() and all synchronous handlers complete
    setTimeout(function () {
      var style = getComputedStyle(document.documentElement);
      var palette = ['--c1','--c2','--c3','--c4','--c5','--c6','--c7','--c8','--c9','--c10','--c11']
        .map(function (v) { return style.getPropertyValue(v).trim(); });

      // Capture the real color so we can restore it after
      var finalBg = swatchColor.style.background || getComputedStyle(swatchColor).backgroundColor;

      // Kill the CSS transition so rapid frames are visible
      swatchColor.style.transition = 'none';

      var total = 16; // ~1.5 cycles
      var i = 0;

      function spin() {
        swatchColor.style.background = palette[i % palette.length];
        i++;
        if (i < total) {
          var delay = 120 + Math.pow(i / total, 2) * 400; // ease out
          setTimeout(spin, delay);
        } else {
          // Restore real color and transition
          swatchColor.style.background = finalBg;
          setTimeout(function () {
            swatchColor.style.transition = '';
            isSpinning = false;
          }, 50);
        }
      }

      spin();
    }, 0);
  });

});
