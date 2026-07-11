<template>
  <div class="space-y-3">
    <div
      v-for="n in 5"
      :key="n"
      class="card flex gap-4 p-5"
      :style="{ animationDelay: `${n * 60}ms` }"
    >
      <div class="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-ink-800" />
      <div class="min-w-0 flex-1 space-y-3">
        <div class="h-5 w-1/3 animate-pulse rounded bg-ink-800" />
        <div class="h-4 w-2/3 animate-pulse rounded bg-ink-800/80" />
        <div class="flex gap-2">
          <div class="h-5 w-14 animate-pulse rounded-full bg-ink-800" />
          <div class="h-5 w-14 animate-pulse rounded-full bg-ink-800" />
        </div>
      </div>
    </div>
  </div>
</template>
