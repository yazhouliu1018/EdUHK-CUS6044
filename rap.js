'use strict';

const backgroundVideo = document.querySelector('#hero-video');
const heroMedia = document.querySelector('.hero-media');
const ticker = document.querySelector('.lyric-ticker');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const tickerTrack = ticker.querySelector('.ticker-track');
const tickerPhrase = tickerTrack.firstElementChild;

function fillTicker() {
  const phraseWidth = Number.parseFloat(getComputedStyle(tickerPhrase).width);
  if (!phraseWidth) return;

  // One phrase leaves the viewport per cycle, so keep another full viewport covered.
  const copies = Math.ceil(ticker.clientWidth / phraseWidth) + 2;
  while (tickerTrack.childElementCount < copies) {
    tickerTrack.append(tickerPhrase.cloneNode(true));
  }
  while (tickerTrack.childElementCount > copies) {
    tickerTrack.lastElementChild.remove();
  }

  tickerTrack.style.setProperty('--ticker-step', `${phraseWidth}px`);
  tickerTrack.style.setProperty('--ticker-duration', `${phraseWidth / 46}s`);
}

function applyMotionPreference() {
  if (reducedMotion.matches || document.hidden) {
    backgroundVideo.pause();
  } else {
    backgroundVideo.play().catch(() => {});
  }
}

backgroundVideo.addEventListener('playing', () => {
  heroMedia.classList.add('is-playing');
});
backgroundVideo.addEventListener('error', () => {
  heroMedia.classList.remove('is-playing');
});
document.addEventListener('visibilitychange', applyMotionPreference);
reducedMotion.addEventListener('change', applyMotionPreference);

fillTicker();
const tickerSizeObserver = new ResizeObserver(fillTicker);
tickerSizeObserver.observe(ticker);
tickerSizeObserver.observe(tickerPhrase);
applyMotionPreference();
