<template>
  <div class="login">
    <div v-title>{{ $t('UNLOCK_TITLE') }}</div>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="6" xl="6">
        <v-card outlined>
          <v-card-title> {{ $t('UNLOCK_TITLE') }} </v-card-title>
          <v-card-text>
            <v-text-field v-model="username" :label="$t('POOL_USERNAME')" disabled></v-text-field>
            <v-text-field v-model="password" :label="$t('UNLOCK_PASSWORD')" type="password" :placeholder="$t('UNLOCK_PASSWORD_NOTE')"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="login">{{ $t('UNLOCK_BUTTON') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { userLogin } from '../api/user'
export default {
  data() {
    return {
      username: 'admin',
      password: ''
    }
  },
  methods: {
    login() {
      const data = {
        username: 'admin',
        password: this.password
      }
      userLogin(data)
        .then((res) => {
          localStorage.setItem('token', res['JWT Token'])
          this.$store.dispatch('setIsLogin', true)
          this.$router.go(-1)
        })
        .catch(() => {
          this.$snackbar.error(this.$t('UNLOCK_WRONG_PASSWORD_WARNING'))
        })
    }
  }
}
</script>