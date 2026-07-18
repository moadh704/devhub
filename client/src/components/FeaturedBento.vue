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
  <div v-if="hero" class="mb-8 md:mb-10">
    <div class="mb-3 flex items-center gap-3">
      <p class="section-label !mb-0">
        <span class="text-accent">★</span>
        Featured today
      </p>
      <div class="section-rule flex-1" />
    </div>

    <div
      class="grid auto-rows-[minmax(148px,auto)] grid-cols-1 gap-2.5 md:grid-cols-6 md:auto-rows-[minmax(168px,auto)]"
    >
      <!-- Hero -->
      <article
        class="card group relative flex flex-col overflow-hidden md:col-span-4 md:row-span-2"
        @mousemove="onMove"
        @mouseleave="onLeave"
      >
        <div
          class="pointer-events-none absolute inset-0 z-0 opacity-70 transition-opacity duration-150"
          :style="spotlightStyle"
        />

        <!-- Cover strip -->
        <div class="relative z-10 h-28 overflow-hidden border-b border-line sm:h-36 md:h-40">
          <img
            :src="hero.imageUrl"
            :alt="hero.title"
            class="h-full w-full object-cover transition duration-500 ease-expo group-hover:scale-[1.03]"
            loading="eager"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-elevated via-elevated/40 to-transparent"
          />
          <span
            class="absolute left-4 top-4 rounded-md border border-line-accent bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent backdrop-blur-sm"
          >
            #01 · Hot
          </span>
        </div>

        <div class="relative z-10 flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <RouterLink :to="`/project/${hero.slug}`">
                <h3
                  class="font-display text-xl font-semibold tracking-tight text-fg transition-colors duration-150 group-hover:text-white sm:text-2xl"
                >
                  {{ hero.title }}
                </h3>
                <p class="mt-2 max-w-lg text-[13px] leading-relaxed text-fg-muted">
                  {{ hero.tagline }}
                </p>
              </RouterLink>
              <div class="mt-3 flex flex-wrap gap-1.5">
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

          <div class="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
            <RouterLink
              :to="`/u/${hero.author.username}`"
              class="inline-flex items-center gap-2 text-[13px] text-fg-muted transition-colors hover:text-fg"
            >
              <img
                :src="hero.author.avatar"
                class="h-6 w-6 rounded-md border border-line object-cover"
                alt=""
              />
              <span>{{ hero.author.name }}</span>
            </RouterLink>
            <RouterLink
              :to="`/project/${hero.slug}`"
              class="btn-soft !h-8 !text-xs"
            >
              Open project
            </RouterLink>
          </div>
        </div>
      </article>

      <!-- Side tiles -->
      <article
        v-for="(p, i) in rest"
        :key="p.id"
        class="card group relative flex flex-col justify-between p-4 md:col-span-2"
      >
        <div class="flex items-start justify-between gap-3">
          <RouterLink :to="`/project/${p.slug}`" class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <img
                :src="p.imageUrl"
                :alt="p.title"
                class="h-8 w-8 rounded-lg border border-line object-cover"
                loading="lazy"
              />
              <p class="font-mono text-[10px] tracking-widest text-fg-subtle">
                #{{ String(i + 2).padStart(2, '0') }}
              </p>
            </div>
            <h3
              class="mt-2.5 line-clamp-2 font-display text-[14px] font-semibold tracking-tight text-fg transition-colors group-hover:text-white"
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
        <p class="mt-2 line-clamp-2 text-[12px] leading-relaxed text-fg-muted">
          {{ p.tagline }}
        </p>
        <div class="mt-3 flex flex-wrap gap-1">
          <span v-for="t in p.tags.slice(0, 2)" :key="t.id" class="chip">{{ t.name }}</span>
        </div>
      </article>
    </div>
  </div>
</template>
