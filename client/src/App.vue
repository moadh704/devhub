<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import ToastHost from '@/components/ToastHost.vue';

const auth = useAuthStore();

onMounted(() => {
  auth.bootstrap();
});
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <div
      class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -left-32 top-20 h-72 w-72 rounded-full bg-ember/10 blur-3xl"
      />
      <div
        class="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-ember-glow/5 blur-3xl"
      />
    </div>

    <AppNavbar />

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    <ToastHost />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
