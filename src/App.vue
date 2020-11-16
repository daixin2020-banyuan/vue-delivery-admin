<template>
  <div id="app">
    <router-view />
    <Loading></Loading>
  </div>
</template>
<script>
import Loading from "@/components/Loading/Loading";

export default {
  name: "App",
  components: {
    Loading
  }
};
</script>

<style lang="scss"></style>
