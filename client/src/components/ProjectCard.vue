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
    class="card group relative flex gap-4 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-ink-500/70 hover:shadow-lift sm:gap-5 sm:p-5"
  >
    <div
      v-if="rank != null"
      class="hidden w-8 shrink-0 flex-col items-center pt-1 sm:flex"
    >
      <span
        class="font-display text-lg font-bold tabular-nums"
        :class="rank <= 3 ? 'text-ember' : 'text-ink-500'"
      >
        {{ rank }}
      </span>
    </div>

    <VoteButton
      :project-id="project.id"
      :vote-count="project.voteCount"
      :has-voted="project.hasVoted"
      @update="onVote"
    />

    <RouterLink :to="`/project/${project.slug}`" class="min-w-0 flex-1">
      <div class="flex gap-4">
        <div
          class="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-700 bg-ink-850 sm:block"
        >
          <img
            :src="project.imageUrl"
            :alt="project.title"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <h2
              class="font-display text-lg font-bold tracking-tight text-ink-50 transition group-hover:text-ember-soft sm:text-xl"
            >
              {{ project.title }}
            </h2>
            <span class="text-xs text-ink-400">{{ timeAgo(project.createdAt) }}</span>
          </div>

          <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-300">
            {{ project.tagline }}
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag.id"
              class="chip"
            >
              {{ tag.name }}
            </span>
            <span class="ml-auto flex items-center gap-3 text-xs text-ink-400">
              <span class="inline-flex items-center gap-1">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {{ project.commentCount }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <img
                  :src="project.author.avatar"
                  class="h-4 w-4 rounded"
                  alt=""
                />
                {{ project.author.username }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
