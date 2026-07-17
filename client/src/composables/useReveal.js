import { onMounted, onUnmounted, ref } from 'vue';

/**
 * IntersectionObserver reveal — once: true, ~15% threshold.
 * Respects prefers-reduced-motion by revealing immediately.
 */
export function useReveal(options = {}) {
  const el = ref(null);
  const visible = ref(false);
  let observer;

  onMounted(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !el.value) {
      visible.value = true;
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.value = true;
          observer?.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    observer.observe(el.value);
  });

  onUnmounted(() => observer?.disconnect());

  return { el, visible };
}
