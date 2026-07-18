<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import ProjectCard from '@/components/ProjectCard.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';
import EmptyState from '@/components/EmptyState.vue';

const store = useProjectsStore();
const route = useRoute();
const router = useRouter();

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

const activeTags = computed(() => store.tags.filter((x) => x.projectCount > 0));

const heading = computed(() => {
  if (q.value) return `Results for “${q.value}”`;
  if (tag.value) {
    const t = store.tags.find((x) => x.slug === tag.value);
    return t ? t.name : 'Filtered';
  }
  if (sort.value === 'new') return 'Newest launches';
  if (sort.value === 'top') return 'Top projects';
  return 'Today’s launches';
});

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

function clearFilters() {
  q.value = '';
  tag.value = '';
  searchInput.value = '';
  sort.value = 'hot';
  syncQuery();
  load();
}

function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    q.value = searchInput.value.trim();
    syncQuery();
    load();
  }, 280);
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
  <div class="mx-auto max-w-3xl">
    <!-- Page header — compact, not a marketing billboard -->
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          {{ heading }}
        </h1>
        <p class="mt-1 text-[13px] text-fg-muted">
          Discover side projects. Upvote what you love. Launch yours.
        </p>
      </div>
      <RouterLink to="/submit" class="btn-primary shrink-0">
        Launch
        <svg class="h-3.5 w-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </RouterLink>
    </header>

    <!-- Controls -->
    <div
      class="sticky top-16 z-30 -mx-1 mb-4 space-y-3 border-b border-line bg-base/90 px-1 py-3 backdrop-blur-md"
    >
      <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div class="inline-flex w-fit rounded-lg border border-line bg-elevated p-0.5">
          <button
            v-for="s in sorts"
            :key="s.id"
            type="button"
            class="rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150"
            :class="
              sort === s.id
                ? 'bg-surface-hover text-fg'
                : 'text-fg-muted hover:text-fg'
            "
            @click="setSort(s.id)"
          >
            {{ s.label }}
          </button>
        </div>

        <div class="relative w-full sm:max-w-[240px]">
          <svg
            class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle"
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
            class="input !h-8 !pl-9"
            placeholder="Search…"
            aria-label="Search projects"
            @input="onSearchInput"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          class="chip"
          :class="{ 'chip-active': !tag }"
          @click="setTag('')"
        >
          All
        </button>
        <button
          v-for="t in activeTags"
          :key="t.id"
          type="button"
          class="chip"
          :class="{ 'chip-active': tag === t.slug }"
          @click="setTag(t.slug)"
        >
          {{ t.name }}
        </button>
        <button
          v-if="q || tag"
          type="button"
          class="ml-1 text-[12px] text-fg-muted underline-offset-2 hover:text-fg hover:underline"
          @click="clearFilters"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Feed -->
    <LoadingSkeleton v-if="store.loading" />

    <EmptyState
      v-else-if="!store.projects.length"
      title="Nothing here yet"
      description="No projects match your filters. Try clearing search or be the first to launch."
    >
      <div class="flex flex-wrap justify-center gap-2">
        <button v-if="q || tag" type="button" class="btn-secondary" @click="clearFilters">
          Clear filters
        </button>
        <RouterLink to="/submit" class="btn-primary">Launch a project</RouterLink>
      </div>
    </EmptyState>

    <div v-else class="space-y-2">
      <ProjectCard
        v-for="(project, i) in store.projects"
        :key="project.id"
        :project="project"
        :rank="i + 1"
        @vote="onVote"
      />
    </div>
  </div>
</template>
