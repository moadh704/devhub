<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useTime } from '@/composables/useTime';
import { useToast } from '@/composables/useToast';
import VoteButton from '@/components/VoteButton.vue';

const route = useRoute();
const auth = useAuthStore();
const { timeAgo } = useTime();
const toast = useToast();

const project = ref(null);
const comments = ref([]);
const loading = ref(true);
const commentBody = ref('');
const posting = ref(false);
const error = ref(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const { project: p } = await api.getProject(route.params.slug);
    project.value = p;
    const { comments: list } = await api.getComments(p.id);
    comments.value = list;
  } catch (e) {
    error.value = e.message || 'Project not found';
    project.value = null;
  } finally {
    loading.value = false;
  }
}

function onVote(data) {
  if (!project.value) return;
  project.value.hasVoted = data.hasVoted;
  project.value.voteCount = data.voteCount;
}

async function submitComment() {
  if (!auth.isAuthenticated) {
    toast.info('Log in to join the discussion');
    return;
  }
  if (!commentBody.value.trim() || posting.value) return;
  posting.value = true;
  try {
    const { comment } = await api.addComment(project.value.id, {
      body: commentBody.value.trim(),
    });
    comments.value.unshift(comment);
    project.value.commentCount += 1;
    commentBody.value = '';
    toast.success('Comment posted');
  } catch (e) {
    toast.error(e.message || 'Could not post comment');
  } finally {
    posting.value = false;
  }
}

onMounted(load);
watch(() => route.params.slug, load);
</script>

<template>
  <div class="page-enter">
    <div v-if="loading" class="space-y-4">
      <div class="card-static h-48 animate-pulse" />
      <div class="card-static h-64 animate-pulse" />
    </div>

    <div v-else-if="error" class="card-static p-10 text-center">
      <h1 class="text-2xl font-semibold tracking-tight text-fg">Project not found</h1>
      <p class="mt-2 text-sm text-fg-muted">{{ error }}</p>
      <RouterLink to="/" class="btn-primary mt-6 inline-flex">Back to feed</RouterLink>
    </div>

    <template v-else-if="project">
      <RouterLink
        to="/"
        class="mb-6 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors duration-250 ease-expo hover:text-fg"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 19l-7-7 7-7" />
        </svg>
        Back to feed
      </RouterLink>

      <section class="card-static overflow-hidden">
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div class="grid gap-0 lg:grid-cols-[1fr_260px]">
          <div class="p-6 sm:p-8">
            <div class="flex flex-wrap items-start gap-5">
              <VoteButton
                size="lg"
                :project-id="project.id"
                :vote-count="project.voteCount"
                :has-voted="project.hasVoted"
                @update="onVote"
              />

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 font-mono text-[11px] text-fg-muted">
                  <span>{{ timeAgo(project.createdAt) }}</span>
                  <span class="opacity-40">·</span>
                  <RouterLink
                    :to="`/u/${project.author.username}`"
                    class="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
                  >
                    <img :src="project.author.avatar" class="h-4 w-4 rounded" alt="" />
                    {{ project.author.name }}
                  </RouterLink>
                </div>

                <h1
                  class="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl sm:tracking-[-0.02em]"
                >
                  {{ project.title }}
                </h1>
                <p class="mt-3 text-lg leading-relaxed text-fg-muted">{{ project.tagline }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="t in project.tags" :key="t.id" class="chip">{{ t.name }}</span>
                </div>

                <div class="mt-6 flex flex-wrap gap-2.5">
                  <a
                    :href="project.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-primary"
                  >
                    Visit project
                    <svg class="h-3.5 w-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.75"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <a
                    v-if="project.repoUrl"
                    :href="project.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary"
                  >
                    Source
                  </a>
                </div>
              </div>
            </div>

            <div class="mt-8 border-t border-line pt-8">
              <h2 class="section-label">About</h2>
              <p class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg-subtle sm:text-[15px]">
                {{ project.description }}
              </p>
            </div>
          </div>

          <aside class="border-t border-line bg-white/[0.02] p-6 lg:border-l lg:border-t-0">
            <div class="overflow-hidden rounded-xl border border-white/10 bg-elevated">
              <img
                :src="project.imageUrl"
                :alt="project.title"
                class="aspect-square w-full object-cover"
              />
            </div>
            <dl class="mt-5 space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-fg-muted">Upvotes</dt>
                <dd class="font-semibold tabular-nums text-fg">{{ project.voteCount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-fg-muted">Comments</dt>
                <dd class="font-semibold tabular-nums text-fg">{{ project.commentCount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-fg-muted">Maker</dt>
                <dd>
                  <RouterLink
                    :to="`/u/${project.author.username}`"
                    class="font-medium text-accent hover:text-accent-bright"
                  >
                    @{{ project.author.username }}
                  </RouterLink>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <!-- Comments -->
      <section class="mt-8">
        <h2 class="text-lg font-semibold tracking-tight text-fg">
          Discussion
          <span class="text-fg-muted font-normal">({{ comments.length }})</span>
        </h2>

        <form class="card-static mt-4 p-4 sm:p-5" @submit.prevent="submitComment">
          <label class="label" for="comment">Add a comment</label>
          <textarea
            id="comment"
            v-model="commentBody"
            rows="3"
            class="input resize-y"
            :placeholder="
              auth.isAuthenticated
                ? 'Share feedback, questions, or kudos…'
                : 'Log in to join the discussion'
            "
            :disabled="!auth.isAuthenticated"
          />
          <div class="mt-3 flex justify-end">
            <button
              type="submit"
              class="btn-primary"
              :disabled="!auth.isAuthenticated || posting || !commentBody.trim()"
            >
              {{ posting ? 'Posting…' : 'Post comment' }}
            </button>
          </div>
        </form>

        <div v-if="!comments.length" class="mt-4 text-sm text-fg-muted">
          No comments yet — start the conversation.
        </div>

        <ul class="mt-4 space-y-2.5">
          <li v-for="c in comments" :key="c.id" class="card-static p-4 sm:p-5">
            <div class="flex items-start gap-3">
              <img
                :src="c.user.avatar"
                :alt="c.user.name"
                class="h-8 w-8 rounded-lg border border-white/10 bg-elevated object-cover"
              />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <RouterLink
                    :to="`/u/${c.user.username}`"
                    class="text-sm font-medium text-fg hover:text-white"
                  >
                    {{ c.user.name }}
                  </RouterLink>
                  <span class="font-mono text-[11px] text-fg-muted">@{{ c.user.username }}</span>
                  <span class="font-mono text-[11px] text-fg-muted">· {{ timeAgo(c.createdAt) }}</span>
                </div>
                <p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg-subtle">
                  {{ c.body }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
