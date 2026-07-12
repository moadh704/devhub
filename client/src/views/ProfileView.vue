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
    <div v-if="loading" class="card h-40 animate-pulse" />

    <div v-else-if="error" class="card p-10 text-center">
      <h1 class="font-display text-2xl font-bold">User not found</h1>
      <p class="mt-2 text-ink-400">{{ error }}</p>
    </div>

    <template v-else-if="user">
      <section class="card mb-8 overflow-hidden">
        <div class="h-24 bg-gradient-to-r from-ember/30 via-ink-800 to-ink-850 sm:h-32" />
        <div class="relative px-6 pb-6 sm:px-8">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="-mt-10 h-20 w-20 rounded-2xl border-4 border-ink-900 bg-ink-850 object-cover shadow-card sm:h-24 sm:w-24"
          />
          <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 class="font-display text-2xl font-extrabold text-ink-50 sm:text-3xl">
                {{ user.name }}
              </h1>
              <p class="text-sm text-ink-400">@{{ user.username }} · joined {{ timeAgo(user.createdAt) }}</p>
              <p v-if="user.bio" class="mt-3 max-w-xl text-sm text-ink-300">{{ user.bio }}</p>
            </div>
            <div class="flex gap-4 text-center">
              <div>
                <p class="font-display text-xl font-bold tabular-nums text-ink-50">{{ user.projectCount }}</p>
                <p class="text-xs uppercase tracking-wide text-ink-400">Projects</p>
              </div>
              <div>
                <p class="font-display text-xl font-bold tabular-nums text-ink-50">{{ user.voteCount }}</p>
                <p class="text-xs uppercase tracking-wide text-ink-400">Votes</p>
              </div>
              <div>
                <p class="font-display text-xl font-bold tabular-nums text-ink-50">{{ user.commentCount }}</p>
                <p class="text-xs uppercase tracking-wide text-ink-400">Comments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <h2 class="mb-4 font-display text-lg font-bold text-ink-50">Launched projects</h2>

      <EmptyState
        v-if="!projects.length"
        title="No launches yet"
        description="This maker hasn't shipped on DevHub — yet."
      />

      <div v-else class="space-y-3">
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
