<script setup lang="ts">
import { inject } from '@vercel/analytics';

// Make sure to call this only once in your app
inject();
</script>
<template>
  <div class="flex flex-col min-h-screen bg-slate-50 ">
    <Navbar />
    <slot />
  </div>
</template>
