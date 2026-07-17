<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/lib/api';
import { useTime } from '@/composables/useTime';
import ProjectCard from '@/components/ProjectCard.vue';
import EmptyState from '@/components/EmptyState.vue';

const route = useRoute();
const { timeAgo } = useTime();

const user = ref(null);
const projects = ref([]);
const loading = ref(true);
const error = ref(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const data = await api.getUser(route.params.username);
    user.value = data.user;
    projects.value = data.projects;
  } catch (e) {
    error.value = e.message;
    user.value = null;
  } finally {
    loading.value = false;
  }
}

function onVote({ id, hasVoted, voteCount }) {
  const p = projects.value.find((x) => x.id === id);
  if (p) {
    p.hasVoted = hasVoted;
    p.voteCount = voteCount;
  }
}

onMounted(load);
watch(() => route.params.username, load);
</script>

<template>
  <div class="page-enter">
    <div v-if="loading" class="card-static h-40 animate-pulse" />

    <div v-else-if="error" class="card-static p-10 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">User not found</h1>
      <p class="mt-2 text-sm text-fg-muted">{{ error }}</p>
    </div>

    <template v-else-if="user">
      <section class="card-static mb-8 overflow-hidden">
        <div
          class="relative h-28 bg-gradient-to-br from-accent/30 via-elevated to-deep sm:h-36"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(94,106,210,0.35),transparent_55%)]"
          />
        </div>
        <div class="relative px-6 pb-6 sm:px-8">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="-mt-10 h-20 w-20 rounded-2xl border-4 border-base bg-elevated object-cover shadow-card sm:h-24 sm:w-24"
          />
          <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 class="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {{ user.name }}
              </h1>
              <p class="font-mono text-xs text-fg-muted">
                @{{ user.username }} · joined {{ timeAgo(user.createdAt) }}
              </p>
              <p v-if="user.bio" class="mt-3 max-w-xl text-sm leading-relaxed text-fg-subtle">
                {{ user.bio }}
              </p>
            </div>
            <div class="flex gap-6 text-center">
              <div>
                <p class="text-xl font-semibold tabular-nums text-fg">{{ user.projectCount }}</p>
                <p class="font-mono text-[10px] uppercase tracking-widest text-fg-muted">Projects</p>
              </div>
              <div>
                <p class="text-xl font-semibold tabular-nums text-fg">{{ user.voteCount }}</p>
                <p class="font-mono text-[10px] uppercase tracking-widest text-fg-muted">Votes</p>
              </div>
              <div>
                <p class="text-xl font-semibold tabular-nums text-fg">{{ user.commentCount }}</p>
                <p class="font-mono text-[10px] uppercase tracking-widest text-fg-muted">Comments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <h2 class="mb-4 text-base font-semibold tracking-tight text-fg">Launched projects</h2>

      <EmptyState
        v-if="!projects.length"
        title="No launches yet"
        description="This maker hasn't shipped on DevHub — yet."
      />

      <div v-else class="space-y-2.5">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @vote="onVote"
        />
      </div>
    </template>
  </div>
</template>
