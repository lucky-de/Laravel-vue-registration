import App from './App.vue'
import vuetify from './vuetify';
import Vue from 'vue'
import router from './router.js'
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib';

Vue.use(VueTelInputVuetify, {
  vuetify,
});

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app');