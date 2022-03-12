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
        <span class="material-icons">help_outlined</span>
      </button>
      <button class="m-2 px-3 py-1">
        <span class="material-icons">menu</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NuxtTutorial",
};
</script>
