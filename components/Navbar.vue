<!-- Please remove this file from your project -->
<template>
  <div
    class="relative flex justify-between items-center p-5 bg-blue text-white h-16"
  >
    <div class="flex items-center">
      <img src="/logo.png" alt="" class="h-16 w-16" />
      <h1 class="font-krub hidden sm:block">ASCLEPIUS</h1>
    </div>
    <div class="flex items-center">
      <button class="m-2 px-3 py-1 font-krub">English</button>

      <button class="m-2 px-3 py-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z "
          />
        </svg>
      </button>
      <button class="m-2 px-3 py-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16m-7"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NuxtTutorial",
};
</script>
