<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: { type: String, default: 'Try adjusting filters or check back soon.' },
});
</script>

<template>
  <div class="card flex flex-col items-center px-6 py-16 text-center">
    <div
      class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-600 bg-ink-850 text-ember"
    >
      <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
    </div>
    <h3 class="font-display text-lg font-bold text-ink-50">{{ title }}</h3>
    <p class="mt-2 max-w-sm text-sm text-ink-400">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
