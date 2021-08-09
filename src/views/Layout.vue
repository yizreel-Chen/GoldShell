<template>
  <v-app>
    <v-app-bar app color="blue darken-3" dark flat>
      <!-- 侧边栏显示，隐藏 -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- 登录，退出 -->
      <div v-if="isLogin">
        <span class="pr-2 green--text body-1">{{ $t('MINER_UNLOCKED') }}</span>
        <v-btn class="ma-2" color="white" dark outlined small @click="logout">
          <v-icon small class="mr-1">mdi-lock-open</v-icon>
          {{ $t('UNLOCK_LOCK') }}
        </v-btn>
      </div>
      <div v-else>
        <span class="pr-2 grey--text body-1">{{ $t('MINER_LOCKED') }}</span>
        <v-btn class="ma-2" color="white" dark outlined small @click="$router.push('/login')">
          <v-icon small class="mr-1">mdi-lock</v-icon>
          {{ $t('UNLOCK_BUTTON') }}
        </v-btn>
      </div>

      <!-- 语言模块 -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-img :src="flagImg[language]" alt="" max-width="30" class="mr-2" />
            {{ language === 'zh-CN' ? '中文' : 'English' }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changeLanguage(item.value)" v-for="(item, index) in languageItems" :key="index">
            <v-list-item-icon>
              <v-img :src="flagImg[item.value]" max-width="30"></v-img>
            </v-list-item-icon>
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 侧边栏 -->
    <v-navigation-drawer v-model="drawer" class="white" :mini-variant="miniVariant" app>
      <v-list-item>
        <v-list-item-content>
          <div class="d-flex align-center" v-if="!miniVariant">
            <a :href="language === 'zh-CN' ? 'https://www.goldshell.com/zh/home/' : 'https://www.goldshell.com/'" target="_blank">
              <v-img alt="Goldshell Logo" class="shrink mr-2" contain src="../assets/images/top-bar-logo.png" transition="scale-transition" width="180" height="40" />
            </a>
            <v-icon @click="miniVariant = !miniVariant">mdi-format-align-justify</v-icon>
          </div>
          <v-icon @click="miniVariant = !miniVariant" v-else>mdi-format-align-justify</v-icon>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t(item.title) }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 主要模块 -->
    <v-main app class="grey lighten-4">
      <router-view class="px-4 my-5" style="max-width: 1200px" />
    </v-main>

    <!-- 页脚 -->
    <v-footer class="d-flex justify-end">
      <span class="text-caption">
        Powered by
        <a href="https://www.goldshell.com/" target="_blank" rel="noopener noreferrer">Goldshell</a>
        © 2021 Goldshell Co., LTD
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { userLogout } from '../api/user'
import { getmcbstatus } from '../api/mcb'
export default {
  name: 'App',

  data() {
    return {
      language: null,
      drawer: null,
      minerInfo: null,
      miniVariant: false,
      model: '',
      languageItems: [
        { title: '中文', value: 'zh-CN' },
        { title: 'English', value: 'en' }
      ],
      items: [
        {
          title: 'BUTTON_ASIDE_HOME',
          icon: 'mdi-home',
          link: '/'
        },
        {
          title: 'BUTTON_ASIDE_MINER',
          icon: 'mdi-cog',
          link: '/config'
        },
        {
          title: 'BUTTON_ASIDE_SYSTEM',
          icon: 'mdi-monitor',
          link: '/system'
        }
      ],
      flagImg: {
        'zh-CN': require('../assets/flag/china.svg'),
        en: require('../assets/flag/america.svg')
      }
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'isLogin',
      lang: 'language'
    })
  },

  created() {
    this.language = localStorage.getItem('language') === null ? 'zh-CN' : localStorage.getItem('language')
    this.$store.dispatch('setLanguage', this.language)
    this.$store.dispatch('setIsLogin', localStorage.getItem('token') !== null)
    this.getMinerInfo()
  },

  methods: {
    logout() {
      userLogout()
        .then(() => {
          localStorage.removeItem('token')
          this.$store.dispatch('setIsLogin', false)
        })
        .catch(() => {
          this.$snackbar.error(this.$t('WARNING_SETLOGOUT'))
        })
    },

    changeLanguage(lang) {
      localStorage.setItem('language', lang)
      this.$store.dispatch('setLanguage', lang)
      this.language = lang
      this.$i18n.locale = lang
    },

    getMinerInfo() {
      this.isMinerInfoLoading = true
      getmcbstatus()
        .then((res) => {
          this.$store.dispatch('setMinerInfo', res)
        })
        .catch(() => {})
    }
  }
}
</script>
