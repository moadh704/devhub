<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
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
      <div class="card h-48 animate-pulse bg-ink-900" />
      <div class="card h-64 animate-pulse bg-ink-900" />
    </div>

    <div v-else-if="error" class="card p-10 text-center">
      <h1 class="font-display text-2xl font-bold text-ink-50">Project not found</h1>
      <p class="mt-2 text-ink-400">{{ error }}</p>
      <RouterLink to="/" class="btn-primary mt-6 inline-flex">Back to feed</RouterLink>
    </div>

    <template v-else-if="project">
      <RouterLink
        to="/"
        class="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 transition hover:text-ember-soft"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to feed
      </RouterLink>

      <section class="card overflow-hidden">
        <div class="grid gap-0 lg:grid-cols-[1fr_280px]">
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
                <div class="flex flex-wrap items-center gap-2 text-xs text-ink-400">
                  <span>{{ timeAgo(project.createdAt) }}</span>
                  <span>·</span>
                  <RouterLink
                    :to="`/u/${project.author.username}`"
                    class="inline-flex items-center gap-1.5 hover:text-ember-soft"
                  >
                    <img :src="project.author.avatar" class="h-5 w-5 rounded" alt="" />
                    {{ project.author.name }}
                  </RouterLink>
                </div>

                <h1 class="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
                  {{ project.title }}
                </h1>
                <p class="mt-3 text-lg text-ink-300">{{ project.tagline }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="t in project.tags" :key="t.id" class="chip">{{ t.name }}</span>
                </div>

                <div class="mt-6 flex flex-wrap gap-3">
                  <a
                    :href="project.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-primary"
                  >
                    Visit project
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <a
                    v-if="project.repoUrl"
                    :href="project.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-ghost"
                  >
                    Source
                  </a>
                </div>
              </div>
            </div>

            <div class="prose-dev mt-8 border-t border-ink-700/80 pt-8">
              <h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink-400">
                About
              </h2>
              <p
                class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-200 sm:text-base"
              >
                {{ project.description }}
              </p>
            </div>
          </div>

          <aside class="border-t border-ink-700/80 bg-ink-850/40 p-6 lg:border-l lg:border-t-0">
            <div
              class="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900"
            >
              <img
                :src="project.imageUrl"
                :alt="project.title"
                class="aspect-square w-full object-cover"
              />
            </div>
            <dl class="mt-5 space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-ink-400">Upvotes</dt>
                <dd class="font-semibold tabular-nums text-ink-100">{{ project.voteCount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-ink-400">Comments</dt>
                <dd class="font-semibold tabular-nums text-ink-100">{{ project.commentCount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-ink-400">Maker</dt>
                <dd>
                  <RouterLink
                    :to="`/u/${project.author.username}`"
                    class="font-semibold text-ember-soft hover:underline"
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
        <h2 class="font-display text-xl font-bold text-ink-50">
          Discussion
          <span class="text-ink-500">({{ comments.length }})</span>
        </h2>

        <form class="card mt-4 p-4 sm:p-5" @submit.prevent="submitComment">
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

        <div v-if="!comments.length" class="mt-4 text-sm text-ink-400">
          No comments yet — start the conversation.
        </div>

        <ul class="mt-4 space-y-3">
          <li v-for="c in comments" :key="c.id" class="card p-4 sm:p-5">
            <div class="flex items-start gap-3">
              <img
                :src="c.user.avatar"
                :alt="c.user.name"
                class="h-9 w-9 rounded-lg bg-ink-800 object-cover"
              />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <RouterLink
                    :to="`/u/${c.user.username}`"
                    class="text-sm font-semibold text-ink-100 hover:text-ember-soft"
                  >
                    {{ c.user.name }}
                  </RouterLink>
                  <span class="text-xs text-ink-500">@{{ c.user.username }}</span>
                  <span class="text-xs text-ink-500">· {{ timeAgo(c.createdAt) }}</span>
                </div>
                <p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-200">
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
