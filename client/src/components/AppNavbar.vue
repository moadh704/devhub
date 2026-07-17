<script setup>
import { ref, watch, onUnmounted } from 'vue';
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

function close() {
  open.value = false;
}

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-base/70 backdrop-blur-xl">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="group flex items-center gap-2.5" @click="close">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-elevated shadow-inset transition-transform duration-250 ease-expo group-hover:scale-[1.03]"
        >
          <span class="text-sm font-semibold text-accent">D</span>
        </span>
        <span class="text-[15px] font-semibold tracking-tight text-fg">
          Dev<span class="text-accent">Hub</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-0.5 md:flex" aria-label="Primary">
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

      <!-- Mobile toggle: Menu / X -->
      <button
        type="button"
        class="btn-ghost !px-2.5 md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

    <!-- Mobile panel + backdrop -->
    <Transition name="mobile-menu">
      <div v-if="open" class="md:hidden">
        <button
          type="button"
          class="fixed inset-0 top-14 z-40 bg-base/95 backdrop-blur-xl"
          aria-label="Close menu backdrop"
          @click="close"
        />
        <nav
          id="mobile-nav"
          class="relative z-50 border-t border-line bg-base/95 px-4 py-4 backdrop-blur-xl"
          aria-label="Mobile"
        >
          <div class="flex flex-col gap-1">
            <RouterLink
              to="/"
              class="rounded-lg px-3 py-3 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-fg"
              @click="close"
            >
              Discover
            </RouterLink>
            <RouterLink
              to="/submit"
              class="rounded-lg px-3 py-3 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-fg"
              @click="close"
            >
              Launch project
            </RouterLink>
            <RouterLink
              v-if="auth.isAuthenticated"
              :to="`/u/${auth.user.username}`"
              class="rounded-lg px-3 py-3 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-fg"
              @click="close"
            >
              Profile
            </RouterLink>
            <button
              v-if="auth.isAuthenticated"
              type="button"
              class="rounded-lg px-3 py-3 text-left text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-fg"
              @click="logout"
            >
              Log out
            </button>
          </div>

          <div v-if="!auth.isAuthenticated" class="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            <RouterLink to="/login" class="btn-secondary w-full" @click="close">
              Log in
            </RouterLink>
            <RouterLink to="/register" class="btn-primary w-full" @click="close">
              Join free
            </RouterLink>
          </div>
          <div v-else class="mt-4 border-t border-line pt-4">
            <RouterLink to="/submit" class="btn-primary w-full" @click="close">
              Launch a project
            </RouterLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-enter-active nav,
.mobile-menu-leave-active nav {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
.mobile-menu-enter-from nav,
.mobile-menu-leave-to nav {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
