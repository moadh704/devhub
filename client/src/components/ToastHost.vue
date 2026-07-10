<script setup>
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-card backdrop-blur-md"
        :class="{
          'border-mist/30 bg-ink-850/95 text-mist': t.type === 'success',
          'border-ember-deep/40 bg-ink-850/95 text-ember-soft': t.type === 'error',
          'border-ink-600 bg-ink-850/95 text-ink-100': t.type === 'info',
        }"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
