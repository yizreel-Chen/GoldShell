import Vue from 'vue'

const title = Vue.directive('title', {
  inserted: function(el) {
    document.title = el.innerText
    el.parentNode.removeChild(el)
  },
  componentUpdated: function(el) {
    document.title = el.innerText
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
})

export default {
  title
}
