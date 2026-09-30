// Runs before first paint (loaded synchronously from index.html; no inline script, so the CSP can forbid it).

// 1. Clickjacking: GitHub Pages can't send frame-ancestors or X-Frame-Options headers, so the page refuses
//    to show itself inside another site's frame, and asks to be the top window instead.
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try {
    window.top.location = window.self.location.href;
  } catch (e) {
    // cross-origin frame without navigation rights: stay hidden
  }
}

// 2. Night or day, set before the page paints (src/site/timeOfDay.ts keeps it in sync afterwards)
try {
  var time = new URLSearchParams(location.search).get('time') || localStorage.getItem('jpb:time');
  if (time === 'day' || time === 'night') document.documentElement.setAttribute('data-theme', time);
} catch (e) {
  // storage blocked: the default theme applies
}
