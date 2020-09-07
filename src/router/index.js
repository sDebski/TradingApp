import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuctionCreateView from '../views/AuctionCreateView'
import RegistrationView from '../views/RegistrationView'
import LoginView from '../views/LoginView'
import UserView from '../views/UserView'
import AuctionView from '../views/AuctionView'
import Messenger from '../components/MessageToSend'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/auctions/create',
    name: 'AuctionsCreate',
    component: AuctionCreateView
  },
  {
    path: '/registration',
    name: 'RegistrationView',
    component: RegistrationView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/auctions/:id',
    name: 'AuctionView',
    component: AuctionView,
    params: true
  },
  {
    path: '/user',
    name: 'UserView',
    component: UserView
  },
  {
    path: '/messenger',
    name: 'MessageToSend',
    component: Messenger
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const publicPagesRegexes = [/\/login/, /\/register/, /\//, /\/auctions\/(?!create)/];
  const authRequired = publicPagesRegexes.some(regex => regex.test(to.path)) === false;
  const loggedIn = localStorage.getItem('user');

  if(authRequired && !loggedIn) {
    return next('/login');
  }

  if( to === from) return;

  next();
});

export default router
