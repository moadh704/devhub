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
        class="pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-card backdrop-blur-xl"
        :class="{
          'border-emerald-500/30 bg-elevated/95 text-emerald-200': t.type === 'success',
          'border-red-500/30 bg-elevated/95 text-red-200': t.type === 'error',
          'border-line bg-elevated/95 text-fg': t.type === 'info',
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
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
