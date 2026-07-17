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
    class="sticky top-0 z-40 border-b border-line bg-base/70 backdrop-blur-xl"
  >
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="group flex items-center gap-2.5">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-elevated shadow-inset transition-transform duration-250 ease-expo group-hover:scale-[1.03]"
        >
          <span class="text-sm font-semibold text-accent">D</span>
        </span>
        <span class="text-[15px] font-semibold tracking-tight text-fg">
          Dev<span class="text-accent">Hub</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-0.5 md:flex">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-all duration-250 ease-expo hover:bg-white/[0.05] hover:text-fg"
          active-class="!text-fg !bg-white/[0.05]"
        >
          Discover
        </RouterLink>
        <RouterLink
          to="/submit"
          class="rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-all duration-250 ease-expo hover:bg-white/[0.05] hover:text-fg"
          active-class="!text-fg !bg-white/[0.05]"
        >
          Launch
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="auth.isAuthenticated">
          <RouterLink
            :to="`/u/${auth.user.username}`"
            class="flex items-center gap-2 rounded-lg border border-line bg-white/[0.03] py-1 pl-1 pr-2.5 transition-all duration-250 ease-expo hover:border-line-hover hover:bg-white/[0.06]"
          >
            <img
              :src="auth.user.avatar"
              :alt="auth.user.name"
              class="h-6 w-6 rounded-md bg-elevated object-cover"
            />
            <span class="text-sm font-medium text-fg">{{ auth.user.name }}</span>
          </RouterLink>
          <button type="button" class="btn-ghost !py-1.5 !text-xs" @click="logout">
            Log out
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-ghost !py-1.5">Log in</RouterLink>
          <RouterLink to="/register" class="btn-primary !py-1.5">Join free</RouterLink>
        </template>
      </div>

      <button
        type="button"
        class="btn-ghost !px-2.5 md:hidden"
        aria-label="Menu"
        @click="open = !open"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            v-if="!open"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
            d="M4 7h16M4 12h16M4 17h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
            d="M6 6l12 12M18 6L6 18"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="open"
      class="border-t border-line bg-base/95 px-4 py-3 backdrop-blur-xl md:hidden"
    >
      <div class="flex flex-col gap-1.5">
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
