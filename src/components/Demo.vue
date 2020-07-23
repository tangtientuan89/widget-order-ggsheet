<template>
  <div>
    <button @click="getData">get</button>
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
const API = "";
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    async getData() {
      try {
        console.log("test run");
        let res = await fetch.get("http://localhost:3000/test");
        //  console.log("res data form", res.data.data.body);

        // detect entry from response
        let arr = res.data.data.body.split("data-params=");
        console.log("split arr", arr);
        arr.shift();
        console.log("split arr", arr);
        let text = [];
        for (let i = 0; i < arr.length; i++) {
          let e = arr[i].split(",[[")[1].split(",")[0];
          text.push(e);
        }
        ////
        console.log("text arr", text);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>