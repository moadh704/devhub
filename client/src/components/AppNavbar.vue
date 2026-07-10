<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const open = ref(false);

function logout() {
  auth.logout();
  open.value = false;
  router.push({ name: 'home' });
}
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/75 backdrop-blur-xl"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="group flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-850 ring-1 ring-ember/40 shadow-glow transition group-hover:scale-105"
        >
          <span class="font-display text-lg font-extrabold text-ember">D</span>
        </span>
        <span class="font-display text-xl font-bold tracking-tight text-ink-50">
          Dev<span class="text-ember">Hub</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-2 text-sm font-medium text-ink-300 transition hover:bg-ink-850 hover:text-ink-50"
          active-class="!text-ink-50 !bg-ink-850"
        >
          Discover
        </RouterLink>
        <RouterLink
          to="/submit"
          class="rounded-lg px-3 py-2 text-sm font-medium text-ink-300 transition hover:bg-ink-850 hover:text-ink-50"
          active-class="!text-ink-50 !bg-ink-850"
        >
          Launch
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="auth.isAuthenticated">
          <RouterLink
            :to="`/u/${auth.user.username}`"
            class="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 py-1.5 pl-1.5 pr-3 transition hover:border-ink-500"
          >
            <img
              :src="auth.user.avatar"
              :alt="auth.user.name"
              class="h-7 w-7 rounded-lg bg-ink-800 object-cover"
            />
            <span class="text-sm font-medium text-ink-100">{{ auth.user.name }}</span>
          </RouterLink>
          <button type="button" class="btn-ghost !py-2" @click="logout">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-ghost !py-2">Log in</RouterLink>
          <RouterLink to="/register" class="btn-primary !py-2">Join free</RouterLink>
        </template>
      </div>

      <button
        type="button"
        class="btn-ghost !px-3 md:hidden"
        aria-label="Menu"
        @click="open = !open"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            v-if="!open"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 7h16M4 12h16M4 17h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 6l12 12M18 6L6 18"
          />
        </svg>
      </button>
    </div>

    <div v-if="open" class="border-t border-ink-800 bg-ink-950/95 px-4 py-4 md:hidden">
      <div class="flex flex-col gap-2">
        <RouterLink to="/" class="btn-ghost justify-start" @click="open = false">
          Discover
        </RouterLink>
        <RouterLink to="/submit" class="btn-ghost justify-start" @click="open = false">
          Launch project
        </RouterLink>
        <template v-if="auth.isAuthenticated">
          <RouterLink
            :to="`/u/${auth.user.username}`"
            class="btn-ghost justify-start"
            @click="open = false"
          >
            Profile
          </RouterLink>
          <button type="button" class="btn-soft justify-start" @click="logout">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-ghost justify-start" @click="open = false">
            Log in
          </RouterLink>
          <RouterLink to="/register" class="btn-primary justify-start" @click="open = false">
            Join free
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
