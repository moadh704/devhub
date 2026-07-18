<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: { type: String, default: 'Try adjusting filters or check back soon.' },
});
</script>

<template>
  <div class="card-static flex flex-col items-center px-6 py-14 text-center">
    <div
      class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-elevated text-accent"
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
    <h3 class="font-display text-[15px] font-semibold tracking-tight text-fg">{{ title }}</h3>
    <p class="mt-1.5 max-w-sm text-[13px] leading-relaxed text-fg-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>
