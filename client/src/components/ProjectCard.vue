<script setup>
import { useTime } from '@/composables/useTime';
import { useSpotlight } from '@/composables/useSpotlight';
import VoteButton from '@/components/VoteButton.vue';

const props = defineProps({
  project: { type: Object, required: true },
  rank: { type: Number, default: null },
});

const emit = defineEmits(['vote']);
const { timeAgo } = useTime();
const { spotlightStyle, onMove, onLeave } = useSpotlight();

function onVote(data) {
  emit('vote', { id: props.project.id, ...data });
}
</script>

<template>
  <article
    class="card group relative flex gap-4 p-5 sm:gap-5 sm:p-6"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div
      class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-250 ease-expo"
      :style="spotlightStyle"
    />
    <div
      class="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
    />

    <div
      v-if="rank != null"
      class="relative z-10 hidden w-7 shrink-0 flex-col items-center pt-1.5 sm:flex"
    >
      <span
        class="text-sm font-semibold tabular-nums"
        :class="rank <= 3 ? 'text-accent' : 'text-fg-muted/50'"
      >
        {{ String(rank).padStart(2, '0') }}
      </span>
    </div>

    <div class="relative z-10">
      <VoteButton
        :project-id="project.id"
        :vote-count="project.voteCount"
        :has-voted="project.hasVoted"
        @update="onVote"
      />
    </div>

    <RouterLink :to="`/project/${project.slug}`" class="relative z-10 min-w-0 flex-1">
      <div class="flex gap-4">
        <div
          class="hidden h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-elevated sm:block"
        >
          <img
            :src="project.imageUrl"
            :alt="project.title"
            class="h-full w-full object-cover transition duration-300 ease-expo group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <h2
              class="text-base font-semibold tracking-tight text-fg transition-colors duration-250 group-hover:text-white sm:text-lg"
            >
              {{ project.title }}
            </h2>
            <span class="font-mono text-[11px] text-fg-muted">{{ timeAgo(project.createdAt) }}</span>
          </div>

          <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {{ project.tagline }}
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span v-for="tag in project.tags" :key="tag.id" class="chip">
              {{ tag.name }}
            </span>
            <span class="ml-auto flex items-center gap-3 text-xs text-fg-muted">
              <span class="inline-flex items-center gap-1" :title="`${project.commentCount} comments`">
                <svg class="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.75"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span class="sr-only">Comments:</span>
                {{ project.commentCount }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <img :src="project.author.avatar" class="h-4 w-4 rounded" alt="" />
                {{ project.author.username }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
