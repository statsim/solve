const Vue = require('vue')
const app = require('./app.vue')

const vm = new Vue({
  el: '#app',
  render: f => f(app)
})

if (!vm) {
  throw new Error('Browser: Where is Vue?')
}
