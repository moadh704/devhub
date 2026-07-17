<template>
  <div class="space-y-3">
    <div
      v-for="n in 5"
      :key="n"
      class="card-static flex gap-4 p-5"
      :style="{ animationDelay: `${n * 50}ms` }"
    >
      <div class="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-white/[0.06]" />
      <div class="min-w-0 flex-1 space-y-3">
        <div class="h-4 w-1/3 animate-pulse rounded bg-white/[0.06]" />
        <div class="h-3.5 w-2/3 animate-pulse rounded bg-white/[0.04]" />
        <div class="flex gap-2">
          <div class="h-5 w-14 animate-pulse rounded-full bg-white/[0.04]" />
          <div class="h-5 w-14 animate-pulse rounded-full bg-white/[0.04]" />
        </div>
      </div>
    </div>
  </div>
</template>
