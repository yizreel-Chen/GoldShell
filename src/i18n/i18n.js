import Vue from 'vue'
import VueI18n from 'vue-i18n'
import vuetifyEnLocale from 'vuetify/lib/locale/en'
import vuetifyZhLocale from 'vuetify/lib/locale/zh-Hans'
import zhLocale from './zh.json'
import enLocale from './en.json'

Vue.use(VueI18n)

const messages = {
  'en': {
    ...vuetifyEnLocale,
    ...enLocale
  },
  'zh-CN': {
    ...vuetifyZhLocale,
    ...zhLocale
  },
}

// 使用选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: localStorage.getItem('language') === null ? 'zh-CN' : localStorage.getItem('language'), // set locale
  messages, // set locale messages
})

export default i18n