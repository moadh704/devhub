<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/lib/api';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const toast = useToast();

const form = ref({
  title: '',
  tagline: '',
  description: '',
  url: '',
  repoUrl: '',
  imageUrl: '',
  tags: '',
});
const loading = ref(false);
const error = ref('');

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    const tags = form.value.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const { project } = await api.createProject({
      title: form.value.title,
      tagline: form.value.tagline,
      description: form.value.description,
      url: form.value.url,
      repoUrl: form.value.repoUrl || '',
      imageUrl: form.value.imageUrl || '',
      tags,
    });

    toast.success('Project launched');
    router.push({ name: 'project', params: { slug: project.slug } });
  } catch (e) {
    error.value = e.message || 'Could not launch project';
    if (e.details?.length) {
      error.value = e.details.map((d) => d.message).join(' · ');
    }
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="page-enter mx-auto max-w-2xl">
    <div class="mb-8">
      <p class="section-label">Launch</p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl sm:tracking-[-0.02em]">
        Ship your project
      </h1>
      <p class="mt-2 text-sm leading-relaxed text-fg-muted sm:text-base">
        Share something you built. Keep the tagline sharp — first impressions matter.
      </p>
    </div>

    <form class="card-static space-y-5 p-6 sm:p-8" @submit.prevent="submit">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div
        v-if="error"
        class="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ error }}
      </div>

      <div>
        <label class="label" for="title">Project name</label>
        <input id="title" v-model="form.title" class="input" required maxlength="80" placeholder="Orbit Notes" />
      </div>

      <div>
        <label class="label" for="tagline">Tagline</label>
        <input
          id="tagline"
          v-model="form.tagline"
          class="input"
          required
          minlength="8"
          maxlength="140"
          placeholder="One sentence that makes people click"
        />
      </div>

      <div>
        <label class="label" for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="input min-h-[140px] resize-y"
          required
          minlength="20"
          placeholder="What it does, who it's for, and why it's different…"
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="label" for="url">Website URL</label>
          <input id="url" v-model="form.url" type="url" class="input" required placeholder="https://" />
        </div>
        <div>
          <label class="label" for="repoUrl">
            Repo URL <span class="normal-case tracking-normal text-fg-muted/60">(optional)</span>
          </label>
          <input id="repoUrl" v-model="form.repoUrl" type="url" class="input" placeholder="https://github.com/…" />
        </div>
      </div>

      <div>
        <label class="label" for="imageUrl">
          Cover image URL <span class="normal-case tracking-normal text-fg-muted/60">(optional)</span>
        </label>
        <input id="imageUrl" v-model="form.imageUrl" type="url" class="input" placeholder="https://…" />
      </div>

      <div>
        <label class="label" for="tags">
          Tags <span class="normal-case tracking-normal text-fg-muted/60">(comma-separated)</span>
        </label>
        <input id="tags" v-model="form.tags" class="input" placeholder="Vue, Express, Open Source" />
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2.5 border-t border-line pt-5">
        <RouterLink to="/" class="btn-ghost">Cancel</RouterLink>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Launching…' : 'Launch project' }}
        </button>
      </div>
    </form>
  </div>
</template>
