<script setup>
import { computed } from 'vue';
import { useSpotlight } from '@/composables/useSpotlight';
import VoteButton from '@/components/VoteButton.vue';

const props = defineProps({
  projects: { type: Array, default: () => [] },
});

const emit = defineEmits(['vote']);

const featured = computed(() => props.projects.slice(0, 5));
const hero = computed(() => featured.value[0] || null);
const rest = computed(() => featured.value.slice(1, 5));

const { spotlightStyle, onMove, onLeave } = useSpotlight();
</script>

<template>
  <div
    v-if="hero"
    class="mb-10 grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-3 md:grid-cols-6 md:auto-rows-[180px]"
  >
    <!-- Hero bento: 4 cols × 2 rows -->
    <article
      class="card group relative flex flex-col justify-between p-6 md:col-span-4 md:row-span-2 md:p-8"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <div
        class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-250 ease-expo"
        :style="spotlightStyle"
      />
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div class="relative z-10 flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="section-label mb-3">
            <span class="text-accent">#01</span>
            Featured
          </p>
          <RouterLink :to="`/project/${hero.slug}`">
            <h3
              class="text-2xl font-semibold tracking-tight text-fg transition-colors duration-250 group-hover:text-white md:text-3xl lg:text-4xl"
            >
              {{ hero.title }}
            </h3>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-fg-muted md:text-base">
              {{ hero.tagline }}
            </p>
          </RouterLink>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="t in hero.tags" :key="t.id" class="chip">{{ t.name }}</span>
          </div>
        </div>
        <VoteButton
          :project-id="hero.id"
          :vote-count="hero.voteCount"
          :has-voted="hero.hasVoted"
          size="lg"
          @update="(d) => emit('vote', { id: hero.id, ...d })"
        />
      </div>

      <div class="relative z-10 mt-8 flex items-center justify-between gap-4">
        <RouterLink
          :to="`/u/${hero.author.username}`"
          class="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <img :src="hero.author.avatar" class="h-6 w-6 rounded-md border border-white/10" alt="" />
          {{ hero.author.name }}
        </RouterLink>
        <RouterLink :to="`/project/${hero.slug}`" class="btn-soft !py-1.5 !text-xs">
          View project
        </RouterLink>
      </div>
    </article>

    <!-- Side tiles: 2 cols each -->
    <article
      v-for="(p, i) in rest"
      :key="p.id"
      class="card group relative flex flex-col justify-between p-5 md:col-span-2"
      :class="i === 0 ? 'md:row-span-1' : ''"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div class="flex items-start justify-between gap-3">
        <RouterLink :to="`/project/${p.slug}`" class="min-w-0 flex-1">
          <p class="font-mono text-[10px] tracking-widest text-fg-muted">
            #{{ String(i + 2).padStart(2, '0') }}
          </p>
          <h3
            class="mt-1.5 line-clamp-2 text-base font-semibold tracking-tight text-fg transition-colors group-hover:text-white"
          >
            {{ p.title }}
          </h3>
        </RouterLink>
        <VoteButton
          :project-id="p.id"
          :vote-count="p.voteCount"
          :has-voted="p.hasVoted"
          @update="(d) => emit('vote', { id: p.id, ...d })"
        />
      </div>
      <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-muted">{{ p.tagline }}</p>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span v-for="t in p.tags.slice(0, 2)" :key="t.id" class="chip">{{ t.name }}</span>
      </div>
    </article>
  </div>
</template>
