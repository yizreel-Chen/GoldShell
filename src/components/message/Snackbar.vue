<template>
  <div class="v-application">
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      <!-- <v-icon :color="color">{{ icon }}</v-icon> -->
      {{ mes }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
 
<script>
export default {
  name: 'Snackbar',
  props: {},
  components: {},
  data() {
    return {
      icon: '',
      color: '',
      snackbar: '',
      mes: ''
    }
  },
  created() {},
  methods: {
    info(mes) {
      this.color = 'grey'
      this.mes = mes
      this.snackbar = true
    },
    error(mes) {
      this.color = 'red darken-2'
      this.mes = mes
      this.snackbar = true
    },
    warning(mes) {
      this.color = 'orange'
      this.mes = mes
      this.snackbar = true
    },
    success(mes) {
      this.color = 'success'
      this.mes = mes
      this.snackbar = true
    }
  }
}
</script>
 
<style lang='scss'>
.v-snack {
  .v-snack__content {
    justify-content: flex-start;
    color: #fff;
    i {
      margin-right: 10px;
    }
  }
}
</style>