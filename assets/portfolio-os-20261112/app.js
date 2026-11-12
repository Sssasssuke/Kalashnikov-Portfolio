if (window.lucide) window.lucide.createIcons();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let smoothScroll;
function configureScroll() {
  smoothScroll?.destroy();
  smoothScroll = undefined;
  if (!reducedMotion.matches && window.Lenis) {
    smoothScroll = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -30 },
      allowNestedScroll: true
    });
  }
}
reducedMotion.addEventListener('change', configureScroll);
configureScroll();
