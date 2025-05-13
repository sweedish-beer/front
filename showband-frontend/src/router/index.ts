import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/performers',
      name: 'performers',
      component: () => import('@/views/PerformerListView.vue'),
    },
    {
      path: '/performers/:slug',
      name: 'performer-detail',
      component: () => import('@/views/PerformerDetailView.vue'),
      props: true,
    },
    {
      path: '/tracks',
      name: 'tracks',
      component: () => import('@/views/TrackListView.vue'),
    },
    {
      path: '/albums',
      name: 'albums',
      component: () => import('@/views/AlbumListView.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/EventListView.vue'),
    },
  ],
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 }
  },
})

export default router
