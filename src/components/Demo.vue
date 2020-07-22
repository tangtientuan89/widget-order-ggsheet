<template>
  <div>
    <button>get</button>
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
const API = "";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        console.log("test run");
        let res = await fetch.get(
          "https://docs.google.com/forms/d/e/1FAIpQLSetQQ3d8gCC-ppIAVGFNvWGZfYR-vBQ6rAIgWIm4ta-4MhI9Q/viewform"
        );
        console.log("res data form", res);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>