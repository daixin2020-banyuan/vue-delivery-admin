<template>
  <div v-if="show" class="loading-container">
    <img src="@/assets/loading.gif" alt="" />
  </div>
</template>

<script>
import "./Loading.scss";

import { mapState } from "vuex";

export default {
  name: "Loading",
  computed: {
    ...mapState({
      show: state => state.loading.show
    })
  }
};
</script>
