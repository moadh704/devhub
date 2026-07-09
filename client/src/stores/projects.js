import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/lib/api';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([]);
  const pagination = ref({ page: 1, limit: 20, total: 0, pages: 1 });
  const tags = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchProjects(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const data = await api.getProjects(params);
      projects.value = data.projects;
      pagination.value = data.pagination;
    } catch (e) {
      error.value = e.message;
      projects.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchTags() {
    try {
      const data = await api.getTags();
      tags.value = data.tags;
    } catch {
      tags.value = [];
    }
  }

  function updateVoteLocal(projectId, hasVoted, voteCount) {
    const p = projects.value.find((x) => x.id === projectId);
    if (p) {
      p.hasVoted = hasVoted;
      p.voteCount = voteCount;
    }
  }

  return {
    projects,
    pagination,
    tags,
    loading,
    error,
    fetchProjects,
    fetchTags,
    updateVoteLocal,
  };
});
