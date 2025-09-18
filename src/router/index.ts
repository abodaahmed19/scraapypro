import { createRouter, createWebHistory } from 'vue-router'
import SeeMoreProducts from '../components/marketFront/seeMoreProducts.vue'

import AuthRoutes from './auth'
import User from '@/store/User'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/PortfolioView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutUsView.vue')
    },
    {
      path: '/partner',
      name: 'partner',
      component: () => import('@/views/BecomeOurPartnerView.vue')
    },
    {
      path: '/career',
      name: 'career',
      component: () => import('@/views/CareerView.vue')
    },
    {
      path: '/materials_policy',
      name: 'materials_policy',
      component: () => import('@/views/MaterialsTheftPolicyView.vue')
    },
    {
      path: '/return_policy',
      name: 'return_policy',
      component: () => import('@/views/ReturnRefundPolicyView.vue')
    },
    {
      path: '/privacy_policy',
      name: 'privacy_policy',
      component: () => import('@/views/PrivacyPolicyView.vue')
    },
    {
      path: '/service_providers',
      name: 'service_providers',
      component: () => import('@/views/ServiceProvidersView.vue')
    },
    {
      path: '/qhs',
      name: 'qhs',
      component: () => import('@/views/QualityHealthSafetyPolicyView.vue')
    },
    {
      path: '/franchise',
      name: 'franchise',
      component: () => import('@/views/FranchiseView.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue')
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('@/views/SubscriptionsView.vue')
    },
    {
      path: '/demolition_works',
      name: 'demolition_works',
      component: () => import('@/views/DemolitionWorksView.vue')
    },
    {
      path: '/service_request',
      name: 'ServiceRequest',
      component: () => import('@/views/service_request/ServiceRequest.vue'),
    },
    {
      path: '/service_request_confirmation',
      name: 'ServiceRequestConfirmation',
      meta: { requiresAuth: true },
      component: () => import('@/views/service_request/Confirmation.vue'),
    },
    {
      path: '/service_request_evaluation',
      name: 'ServiceRequestEvaluation',
      meta: { requiresAuth: true },
      component: () => import('@/views/service_request/Evaluation.vue'),
    },
    {
      path: '/service_request_demolition',
      name: 'ServiceRequestDemolition',
      meta: { requiresAuth: true },
      component: () => import('@/views/service_request/Demolition.vue'),
    },
    {
      path: '/download-now',
      name: 'DownloadNow',
      component: () => import('@/views/DownloadNow.vue')
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/management/:page?/:subPage?',
      name: 'management',
      meta: { requiresAuth: true },
      component: () => import('@/views/ManagementView.vue')
    },
  {
  path: '/management/Inspections/details/:id',
  name: 'detailsInspections',
  meta: { requiresAuth: true },
  component: () => import('@/views/management/vendor/inspections/Details.vue'),
  props: (route) => ({
    id: route.params.id,
    inspectionData: route.query.data ? JSON.parse(route.query.data) : null
  })
},
    {
  path: '/management/inspections/show/:id',  // Ajoutez :id comme paramètre
  name: 'showInspections',
  meta: { requiresAuth: true },
  component: () => import('@/views/management/vendor/inspections/Show.vue'),
  props: true
},
    {
      path: '/management/Inspections/upload/:id',
      name: 'uploadInspections',
      meta: { requiresAuth: true },
      component: () => import('@/views/management/vendor/inspections/upload.vue'),
      props: true
    },
    {
      path: '/management/Inspections/details2/:id',
      name: 'details2Inspections',
      meta: { requiresAuth: true },
      component: () => import('@/views/management/vendor/inspections/Details2.vue'),
      props: true
    },
    {
      path: '/management/Inspections/details3/:id',
      name: 'details3Inspections',
      meta: { requiresAuth: true },
      component: () => import('@/views/management/vendor/inspections/Details3.vue'),
      props: true
    },
    {
      path: '/management/Inspections/details4/:id',
      name: 'details4Inspections',
      meta: { requiresAuth: true },
      component: () => import('@/views/management/vendor/inspections/Details4.vue'),
      props: true
    },
    {
      path: '/management/Inspections/done/:id',
      name: 'doneInspections',
      meta: { requiresAuth: true },
      component: () => import('@/views/management/vendor/inspections/Done.vue'),
      props: true
    },
    {
  path: '/shipping-details',
  name: 'shipping-details',
  component: () => import('@/components/checkout/shippingOption.vue'),
  props: (route) => ({
    items: route.query.items ? JSON.parse(route.query.items) : [],
    shippingOption: route.query.shippingOption ? JSON.parse(route.query.shippingOption) : null,
    city: route.query.city || ''
  })
},
    {
      path: '/see-more',
      name: 'see-more',
      component: SeeMoreProducts,
      props: (route) => ({ 
        moreProducts: JSON.parse(route.query.products as string),
        apiEndpoint: route.query.endpoint as string,
        initialFilters: JSON.parse(route.query.filters as string || '{}')
      })
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue')
    },
   {
  path: '/checkout',
  name: 'checkout',
  component: () => import('@/views/CheckoutView.vue'),
  meta: { requiresAuth: true }
},
    {
      path: '/authorized',
      name: 'payment-callback',
      component: () => import('../views/utils/PaymentCallbackView.vue')
    },
    {
  path: '/declined',
  name: 'payment-declined',
  component: () => import('@/views/utils/DeclinedPage.vue')
}
  ].concat([...AuthRoutes]),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.beforeEach(async (to, from) => {
  // Start loading
  store.dispatch('loading/startLoading')
  // redirect to registerBusiness if business profile is not complete
  if (User.getters.isBusiness && !User.getters.hasBusinessProfile) {
    if (to.name === 'registerBusiness') return true
    return { name: 'registerBusiness' }
  }

  // redirect to home if page requires non-authenticated user
  if (to.meta.noAuth && User.getters.isAuthenticated) {
    if (to.name === 'home') return true
    return { name: 'home' }
  }

  // redirect to login if page requires authentication
  if (to.meta.requiresAuth && !User.getters.isAuthenticated) {
    if (to.name === 'login') return true
    return { name: 'login' }
  }

  // redirect to home if user is not a business
  if (to.meta.requiresBusiness && !User.getters.hasBusinessProfile) {
    if (to.name === 'home') return true
    return { name: 'home' }
  }

  // redirect to home if user is not staff
  if (to.meta.requiresStaff && !User.getters.isStaff) {
    if (to.name === 'home') return true
    return { name: 'home' }
  }
  return true
})
router.afterEach(async () => {
  await store.dispatch('loading/stopLoading')
})
export default router
