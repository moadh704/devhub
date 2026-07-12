<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    toast.success('Welcome back');
    router.push(route.query.redirect || '/');
  } catch (e) {
    error.value = e.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}

function fillDemo() {
  email.value = 'alex@devhub.app';
  password.value = 'password123';
}
</script>

<template>
  <div class="page-enter mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
    <div class="mb-8 text-center">
      <h1 class="font-display text-3xl font-extrabold text-ink-50">Welcome back</h1>
      <p class="mt-2 text-sm text-ink-400">Log in to upvote and launch projects</p>
    </div>

    <form class="card space-y-4 p-6 sm:p-8" @submit.prevent="submit">
      <div v-if="error" class="rounded-xl border border-ember-deep/40 bg-ember-muted px-3 py-2 text-sm text-ember-soft">
        {{ error }}
      </div>

      <div>
        <label class="label" for="email">Email</label>
        <input id="email" v-model="email" type="email" class="input" required autocomplete="email" />
      </div>

      <div>
        <label class="label" for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="input"
          required
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Log in' }}
      </button>

      <button type="button" class="btn-ghost w-full text-xs" @click="fillDemo">
        Use demo account
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-ink-400">
      New here?
      <RouterLink to="/register" class="font-semibold text-ember-soft hover:underline">
        Create an account
      </RouterLink>
    </p>
  </div>
</template>
