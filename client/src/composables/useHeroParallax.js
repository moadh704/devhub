import { onMounted, onUnmounted, ref } from 'vue';

/**
 * Hero scroll parallax: opacity 1→0, scale 1→0.95, y 0→100px
 * over the first ~50% of a typical hero scroll range.
 */
export function useHeroParallax() {
  const style = ref({
    opacity: 1,
    transform: 'translateY(0px) scale(1)',
  });

  function onScroll() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      style.value = { opacity: 1, transform: 'translateY(0px) scale(1)' };
      return;
    }

    const max = 320;
    const y = Math.min(window.scrollY, max);
    const p = y / max;

    style.value = {
      opacity: 1 - p,
      transform: `translateY(${p * 100}px) scale(${1 - p * 0.05})`,
    };
  }

  onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });

  return { style };
}
