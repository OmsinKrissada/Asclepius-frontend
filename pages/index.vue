<template>
  <div class="bg-cream min-h-screen">
    <Navbar />
    <div
      class="flex flex-col sm:flex-row justify-center items-center my-10 min-w-full"
    >
      <div class="flex flex-col items-center">
        <p class="m-2 text-2xl">Welcome</p>
        <h2 id="name" class="m-2 font-mitr font-semibold text-blue text-6xl">
          ASCLEPIUS
        </h2>
        <img src="/logo.png" alt="" width="300" class="sm:hidden" />
        <p class="m-2">
          Easily communicate with person having hearing or speech disability.
        </p>
      </div>
      <img src="" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndexPage",
});
</script>

<style lang="scss" scoped>
#name {
  text-shadow: -5px 3px 0px $turmeric;
}
</style>
