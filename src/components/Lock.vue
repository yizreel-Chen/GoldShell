<template>
  <div>
    <v-icon dense class="ml-3" color="blue" v-if="isLogin">mdi-lock-open</v-icon>
    <v-icon dense class="ml-3" v-else>mdi-lock</v-icon>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      isLogin: 'isLogin'
    })
  }
}
</script>

<style>
</style>