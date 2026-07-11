<script setup>
import { ref, watch, onMounted } from 'vue';
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
  <div class="page-enter">
    <!-- Hero -->
    <section class="relative mb-10 overflow-hidden rounded-3xl border border-ink-700/70 bg-ink-900/50 p-6 sm:p-10">
      <div
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember/15 blur-3xl"
      />
      <div class="relative max-w-2xl">
        <p
          class="mb-3 inline-flex items-center gap-2 rounded-full border border-ember/25 bg-ember-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ember-soft"
        >
          <span class="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ember" />
          Side project launchpad
        </p>
        <h1 class="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-5xl sm:leading-[1.1]">
          Ship it.
          <span class="text-ember"> Get found.</span>
        </h1>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
          DevHub is where makers launch side projects, collect real upvotes,
          and discover the next tool worth starring.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink to="/submit" class="btn-primary">Launch a project</RouterLink>
          <a href="#feed" class="btn-ghost">Browse the feed</a>
        </div>
      </div>
    </section>

    <!-- Controls -->
    <div id="feed" class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex rounded-xl border border-ink-700 bg-ink-900/60 p-1">
        <button
          v-for="s in sorts"
          :key="s.id"
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-semibold transition"
          :class="
            sort === s.id
              ? 'bg-ink-700 text-ink-50 shadow-sm'
              : 'text-ink-400 hover:text-ink-100'
          "
          @click="setSort(s.id)"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="relative w-full lg:max-w-sm">
        <svg
          class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <input
          v-model="searchInput"
          type="search"
          class="input !pl-10"
          placeholder="Search projects, stack, ideas…"
          @input="onSearchInput"
        />
      </div>
    </div>

    <!-- Tags -->
    <div class="mb-6 flex flex-wrap gap-2">
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
        <span class="ml-1 text-ink-500">{{ t.projectCount }}</span>
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

    <div v-else class="space-y-3">
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
