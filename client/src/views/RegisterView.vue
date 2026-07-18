<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
});
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register({ ...form.value });
    toast.success('Account created — welcome to DevHub');
    router.push('/');
  } catch (e) {
    error.value = e.message || 'Registration failed';
    if (e.details?.length) {
      error.value = e.details.map((d) => d.message).join(' · ');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="page-enter mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
    <div class="mb-8 text-center">
      <h1 class="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Join DevHub
      </h1>
      <p class="mt-2 text-[13px] text-fg-muted">Create an account to launch and upvote</p>
    </div>

    <form class="card-static space-y-4 p-6 sm:p-8" @submit.prevent="submit">

      <div
        v-if="error"
        class="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200"
      >
        {{ error }}
      </div>

      <div>
        <label class="label" for="name">Display name</label>
        <input id="name" v-model="form.name" class="input" required maxlength="60" />
      </div>

      <div>
        <label class="label" for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          class="input"
          required
          minlength="3"
          maxlength="24"
          pattern="[a-zA-Z0-9_]+"
          placeholder="maker_name"
        />
      </div>

      <div>
        <label class="label" for="email">Email</label>
        <input id="email" v-model="form.email" type="email" class="input" required />
      </div>

      <div>
        <label class="label" for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="input"
          required
          minlength="6"
        />
      </div>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Creating…' : 'Create account' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-fg-muted">
      Already have an account?
      <RouterLink to="/login" class="font-medium text-accent hover:text-accent-bright">
        Log in
      </RouterLink>
    </p>
  </div>
</template>
