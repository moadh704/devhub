<script setup>
import { useTime } from '@/composables/useTime';
import VoteButton from '@/components/VoteButton.vue';

const props = defineProps({
  project: { type: Object, required: true },
  rank: { type: Number, default: null },
});

const emit = defineEmits(['vote']);
const { timeAgo } = useTime();

function onVote(data) {
  emit('vote', { id: props.project.id, ...data });
}
</script>

<template>
  <article
    class="group flex items-start gap-3 rounded-xl border border-line bg-elevated p-3.5 transition-colors duration-150 hover:border-line-hover hover:bg-surface-hover sm:gap-4 sm:p-4"
  >
    <!-- Rank -->
    <div
      v-if="rank != null"
      class="hidden w-6 shrink-0 pt-2 text-center sm:block"
    >
      <span
        class="font-mono text-[12px] tabular-nums"
        :class="rank <= 3 ? 'font-medium text-accent' : 'text-fg-subtle'"
      >
        {{ rank }}
      </span>
    </div>

    <!-- Vote -->
    <div class="shrink-0">
      <VoteButton
        :project-id="project.id"
        :vote-count="project.voteCount"
        :has-voted="project.hasVoted"
        @update="onVote"
      />
    </div>

    <!-- Thumbnail -->
    <RouterLink
      :to="`/project/${project.slug}`"
      class="hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-raised sm:block"
    >
      <img
        :src="project.imageUrl"
        :alt="project.title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </RouterLink>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <RouterLink :to="`/project/${project.slug}`" class="min-w-0">
          <h2
            class="font-display text-[14px] font-semibold tracking-tight text-fg transition-colors group-hover:text-white sm:text-[15px]"
          >
            {{ project.title }}
          </h2>
          <p class="mt-0.5 line-clamp-2 text-[13px] leading-snug text-fg-muted">
            {{ project.tagline }}
          </p>
        </RouterLink>
        <span class="hidden shrink-0 font-mono text-[10px] text-fg-subtle sm:inline">
          {{ timeAgo(project.createdAt) }}
        </span>
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="t in project.tags.slice(0, 3)"
            :key="t.id"
            class="rounded-md border border-line bg-white/[0.02] px-1.5 py-0.5 text-[11px] text-fg-muted"
          >
            {{ t.name }}
          </span>
        </div>
        <span class="flex items-center gap-2 text-[12px] text-fg-subtle">
          <span class="inline-flex items-center gap-1">
            <svg class="h-3.5 w-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {{ project.commentCount }}
          </span>
          <RouterLink
            :to="`/u/${project.author.username}`"
            class="inline-flex items-center gap-1.5 hover:text-fg"
            @click.stop
          >
            <img
              :src="project.author.avatar"
              class="h-4 w-4 rounded border border-line object-cover"
              alt=""
            />
            {{ project.author.username }}
          </RouterLink>
        </span>
      </div>
    </div>
  </article>
</template>
