import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css'
import App from './App.vue';
import Register from './pages/Register.vue';
import SetCredential from './pages/SetCredential.vue';
import Login from './pages/Login.vue';
import Home from './pages/Home.vue';

const routes = [
  { path: '/home', component: Home },
  { path: '/register', component: Register },
  { path: '/set-credential', component: SetCredential },
  { path: '/login', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
