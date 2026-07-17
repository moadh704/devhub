<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useHeroParallax } from '@/composables/useHeroParallax';
import { useReveal } from '@/composables/useReveal';
import ProjectCard from '@/components/ProjectCard.vue';
import FeaturedBento from '@/components/FeaturedBento.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';
import EmptyState from '@/components/EmptyState.vue';

const store = useProjectsStore();
const route = useRoute();
const router = useRouter();
const { style: heroStyle } = useHeroParallax();
const { el: feedEl, visible: feedVisible } = useReveal();

const sort = ref(route.query.sort || 'hot');
const q = ref(route.query.q || '');
const tag = ref(route.query.tag || '');
const searchInput = ref(route.query.q || '');
let searchTimer;

const sorts = [
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New' },
  { id: 'top', label: 'Top' },
];

const showBento = computed(
  () =>
    !store.loading &&
    store.projects.length >= 3 &&
    !q.value &&
    !tag.value &&
    sort.value === 'hot'
);

const listProjects = computed(() =>
  showBento.value ? store.projects.slice(5) : store.projects
);

async function load() {
  await store.fetchProjects({
    sort: sort.value,
    q: q.value,
    tag: tag.value,
  });
}

function syncQuery() {
  const query = {};
  if (sort.value !== 'hot') query.sort = sort.value;
  if (q.value) query.q = q.value;
  if (tag.value) query.tag = tag.value;
  router.replace({ query });
}

function setSort(id) {
  sort.value = id;
  syncQuery();
  load();
}

function setTag(slug) {
  tag.value = tag.value === slug ? '' : slug;
  syncQuery();
  load();
}

function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    q.value = searchInput.value.trim();
    syncQuery();
    load();
  }, 300);
}

function onVote({ id, hasVoted, voteCount }) {
  store.updateVoteLocal(id, hasVoted, voteCount);
}

onMounted(async () => {
  await Promise.all([load(), store.fetchTags()]);
});

watch(
  () => route.query,
  (query) => {
    sort.value = query.sort || 'hot';
    q.value = query.q || '';
    tag.value = query.tag || '';
    searchInput.value = query.q || '';
  }
);
</script>

<template>
  <div>
    <!-- Hero with scroll parallax -->
    <section
      class="card-static relative mb-10 overflow-hidden p-6 sm:p-10 md:mb-14 md:p-12 lg:p-14"
      :style="heroStyle"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-[100px]"
      />
      <div
        class="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px]"
      />

      <div class="relative max-w-2xl">
        <p class="section-label mb-4 stagger-1 animate-fade-up">
          <span class="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent" />
          Side project launchpad
        </p>
        <h1
          class="stagger-2 animate-fade-up text-4xl font-semibold leading-none tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.02]"
        >
          <span class="text-display">Ship it.</span>
          <br />
          <span class="text-accent-shimmer">Get found.</span>
        </h1>
        <p
          class="stagger-3 animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg md:text-xl"
        >
          DevHub is where makers launch side projects, collect real upvotes,
          and discover the next tool worth starring.
        </p>
        <div class="stagger-4 animate-fade-up mt-8 flex flex-wrap gap-3">
          <RouterLink to="/submit" class="btn-primary">Launch a project</RouterLink>
          <a href="#feed" class="btn-secondary">Browse the feed</a>
        </div>
      </div>
    </section>

    <!-- Asymmetric featured bento -->
    <FeaturedBento
      v-if="showBento"
      :projects="store.projects"
      @vote="onVote"
    />

    <div class="section-rule mb-10" />

    <!-- Controls -->
    <div
      id="feed"
      class="mb-5 flex flex-col gap-4 scroll-mt-20 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="inline-flex rounded-lg border border-line bg-white/[0.03] p-1">
        <button
          v-for="s in sorts"
          :key="s.id"
          type="button"
          class="rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-250 ease-expo"
          :class="
            sort === s.id
              ? 'bg-white/[0.08] text-fg shadow-inset'
              : 'text-fg-muted hover:text-fg'
          "
          @click="setSort(s.id)"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="relative w-full lg:max-w-sm">
        <svg
          class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <input
          v-model="searchInput"
          type="search"
          class="input !pl-10"
          placeholder="Search projects, stack, ideas…"
          aria-label="Search projects"
          @input="onSearchInput"
        />
      </div>
    </div>

    <!-- Tags -->
    <div class="mb-8 flex flex-wrap gap-2">
      <button
        type="button"
        class="chip"
        :class="{ 'chip-active': !tag }"
        @click="setTag('')"
      >
        All stacks
      </button>
      <button
        v-for="t in store.tags.filter((x) => x.projectCount > 0)"
        :key="t.id"
        type="button"
        class="chip"
        :class="{ 'chip-active': tag === t.slug }"
        @click="setTag(t.slug)"
      >
        {{ t.name }}
        <span class="ml-1 opacity-50">{{ t.projectCount }}</span>
      </button>
    </div>

    <!-- Feed -->
    <LoadingSkeleton v-if="store.loading" />

    <EmptyState
      v-else-if="!store.projects.length"
      title="No projects match"
      description="Try another tag, clear search, or be the first to launch something."
    >
      <RouterLink to="/submit" class="btn-primary">Launch yours</RouterLink>
    </EmptyState>

    <div
      v-else
      ref="feedEl"
      class="space-y-2.5 reveal"
      :class="{ 'is-visible': feedVisible }"
    >
      <p
        v-if="showBento && listProjects.length"
        class="section-label mb-3"
      >
        More on the board
      </p>
      <ProjectCard
        v-for="(project, i) in listProjects"
        :key="project.id"
        :project="project"
        :rank="showBento ? i + 6 : i + 1"
        :class="`stagger-${Math.min(i + 1, 6)}`"
        @vote="onVote"
      />
    </div>
  </div>
</template>
