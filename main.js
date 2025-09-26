// Fade the giant name as you scroll down; restore when scrolling up.
const nameEl = document.querySelector('.name');

// distance (in px) over which it fully fades; tweak to taste
let fadeDistance = window.innerHeight * 0.7;

let lastY = 0, ticking = false;

function updateFade() {
  const t = Math.min(Math.max(lastY / fadeDistance, 0), 1); // 0..1
  nameEl.style.opacity = String(1 - t);
  // subtle drift downward as it fades (optional)
  nameEl.style.transform = `translateY(${t * 20}px)`;
  ticking = false;
}

function onScroll() {
  lastY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(updateFade);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  fadeDistance = window.innerHeight * 0.7;
  onScroll();
});

// initialize state on load
onScroll();


