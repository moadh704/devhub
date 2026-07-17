<template>
  <div class="page-enter flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p class="font-mono text-xs tracking-widest text-accent">ERROR</p>
    <p class="mt-2 text-6xl font-semibold tracking-tight text-fg">404</p>
    <h1 class="mt-2 text-xl font-semibold text-fg">Page not found</h1>
    <p class="mt-2 text-sm text-fg-muted">That route doesn't exist on DevHub.</p>
    <RouterLink to="/" class="btn-primary mt-6">Back to feed</RouterLink>
  </div>
</template>
