<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  projectId: { type: String, required: true },
  voteCount: { type: Number, required: true },
  hasVoted: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
});

const emit = defineEmits(['update']);

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();
const busy = ref(false);

async function toggle() {
  if (!auth.isAuthenticated) {
    toast.info('Log in to upvote projects');
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  if (busy.value) return;
  busy.value = true;
  try {
    const data = await api.vote(props.projectId);
    emit('update', data);
  } catch (e) {
    toast.error(e.message || 'Could not vote');
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <button
    type="button"
    class="group flex flex-col items-center justify-center rounded-lg border transition-all duration-150 ease-expo active:translate-y-px"
    :class="[
      size === 'lg' ? 'min-w-[3.75rem] px-2.5 py-2' : 'min-w-[3rem] px-2 py-1.5',
      hasVoted
        ? 'border-line-accent bg-accent/15 text-accent'
        : 'border-line bg-white/[0.02] text-fg-muted hover:border-line-hover hover:bg-surface-hover hover:text-fg',
      busy ? 'opacity-60' : '',
    ]"
    :disabled="busy"
    :aria-pressed="hasVoted"
    @click.stop="toggle"
  >
    <svg
      class="transition-transform duration-250 ease-expo group-hover:-translate-y-0.5 group-active:translate-y-0"
      :class="size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 5l7 10H5l7-10z" />
    </svg>
    <span
      class="mt-0.5 font-semibold tabular-nums tracking-tight"
      :class="size === 'lg' ? 'text-base' : 'text-sm'"
    >
      {{ voteCount }}
    </span>
  </button>
</template>
