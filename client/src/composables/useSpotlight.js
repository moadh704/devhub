import { ref, onUnmounted } from 'vue';

/**
 * Mouse-tracking radial spotlight for card surfaces (Linear-style).
 * Returns style binding for a pseudo-spotlight layer.
 */
export function useSpotlight() {
  const spotlightStyle = ref({
    opacity: 0,
    background:
      'radial-gradient(300px circle at 50% 50%, rgba(94,106,210,0.15), transparent 60%)',
  });

  function onMove(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightStyle.value = {
      opacity: 1,
      background: `radial-gradient(300px circle at ${x}px ${y}px, rgba(94,106,210,0.15), transparent 60%)`,
    };
  }

  function onLeave() {
    spotlightStyle.value = {
      ...spotlightStyle.value,
      opacity: 0,
    };
  }

  onUnmounted(() => {
    spotlightStyle.value.opacity = 0;
  });

  return { spotlightStyle, onMove, onLeave };
}
