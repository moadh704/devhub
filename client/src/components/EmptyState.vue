<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: { type: String, default: 'Try adjusting filters or check back soon.' },
});
</script>

<template>
  <div class="card-static flex flex-col items-center px-6 py-16 text-center">
    <div
      class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent shadow-inset"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
    </div>
    <h3 class="text-base font-semibold tracking-tight text-fg">{{ title }}</h3>
    <p class="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
