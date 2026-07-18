<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AmbientBackground from '@/components/AmbientBackground.vue';
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
    <AmbientBackground />

    <AppNavbar />

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-6 lg:px-8">
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
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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
