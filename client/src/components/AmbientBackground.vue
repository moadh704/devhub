<script setup>
import { onMounted, ref } from 'vue';

const reduceMotion = ref(false);

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
});
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- Noise texture -->
    <div class="absolute inset-0 bg-noise opacity-[0.015] mix-blend-overlay" />

    <!-- Animated gradient blobs (static if reduced motion) -->
    <div
      class="absolute left-1/2 top-[-20%] h-[1400px] w-[900px] -translate-x-1/2 rounded-full bg-accent/25 blur-[150px]"
      :class="reduceMotion ? '' : 'animate-float'"
    />
    <div
      class="absolute -left-[10%] top-[20%] h-[800px] w-[600px] rounded-full bg-purple-500/15 blur-[120px]"
      :class="reduceMotion ? '' : 'animate-float-slow'"
      :style="reduceMotion ? {} : { animationDelay: '-3s' }"
    />
    <div
      class="absolute -right-[5%] top-[30%] h-[700px] w-[500px] rounded-full bg-indigo-500/12 blur-[100px]"
      :class="reduceMotion ? '' : 'animate-float'"
      :style="reduceMotion ? {} : { animationDelay: '-5s' }"
    />
    <div
      class="absolute bottom-[-10%] left-1/3 h-[500px] w-[700px] rounded-full bg-accent/10 blur-[120px]"
      :class="reduceMotion ? '' : 'animate-pulse-glow'"
    />

    <!-- Technical grid -->
    <div class="absolute inset-0 bg-grid-64 bg-grid opacity-[0.02]" />
  </div>
</template>
