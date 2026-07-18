<script setup>
/**
 * Restrained ambient layer — Orbit-family.
 * Soft top wash + noise only. No floating purple blobs.
 */
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-base" />
    <!-- Subtle accent wash at top (not a gradient hero blob) -->
    <div
      class="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[100px]"
    />
    <!-- Noise -->
    <div class="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay" />
    <!-- Faint technical grid -->
    <div class="absolute inset-0 bg-grid-64 bg-grid opacity-[0.025]" />
  </div>
</template>
