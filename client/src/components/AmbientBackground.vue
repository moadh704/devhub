<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- Layer 1: base depth radial is on body -->

    <!-- Layer 2: noise -->
    <div
      class="absolute inset-0 bg-noise opacity-[0.015] mix-blend-overlay"
    />

    <!-- Layer 3: animated gradient blobs -->
    <div
      class="absolute left-1/2 top-[-20%] h-[1400px] w-[900px] -translate-x-1/2 animate-float rounded-full bg-accent/25 blur-[150px]"
    />
    <div
      class="absolute -left-[10%] top-[20%] h-[800px] w-[600px] animate-float-slow rounded-full bg-purple-500/15 blur-[120px]"
      style="animation-delay: -3s"
    />
    <div
      class="absolute -right-[5%] top-[30%] h-[700px] w-[500px] animate-float rounded-full bg-indigo-500/12 blur-[100px]"
      style="animation-delay: -5s"
    />
    <div
      class="absolute bottom-[-10%] left-1/3 h-[500px] w-[700px] animate-pulse-glow rounded-full bg-accent/10 blur-[120px]"
    />

    <!-- Layer 4: grid -->
    <div
      class="absolute inset-0 bg-grid-64 bg-grid opacity-[0.02]"
    />
  </div>
</template>
