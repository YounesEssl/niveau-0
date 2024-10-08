// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify();

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');
