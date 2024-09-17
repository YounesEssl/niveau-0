import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import TodoList from '../views/TodoList.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/todo-list', name: 'TodoList', component: TodoList }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

