import Layout from '../layouts/MainLayout.vue'
import Index from '@/views/HomeView.vue'
import DataView from '@/views/data/DataView.vue'
// import LoginView from '@/views/login/LoginView.vue'
import SparingMonitor from '@/views/monitoring/SparingMonitor.vue'
import Ispu from '@/views/data/IspuView.vue'
import AwlrView from '@/views/data/AwlrView.vue'

const routes = [
  {
    component: Layout,
    path: '/',
    name: 'app',
    children: [
      {
        component: Index,
        path: '',
        name: 'index',
      },
      {
        component: DataView,
        path: 'data',
        name: 'data',
      },
      {
        component: SparingMonitor,
        path: 'monitoring',
        name: 'monitoring',
      },
      {
        component: Ispu,
        path: 'ispu',
        name: 'ispu',
      },
      {
        component: AwlrView,
        path: 'awlr',
        name: 'awlr',
      },
    ],
  },
]

export default routes
