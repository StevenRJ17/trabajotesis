import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PatientsView from '../views/psychologist/PatientsView.vue'
import StudentDetailsView from '../views/psychologist/StudentDetailsView.vue'
import EditStudentView from '../views/psychologist/EditStudentView.vue'
import EditProfilePsicologist from '../views/psychologist/EditProfilePsicologist.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
    {
    path: '/reset-password/:token',
    name: 'reset-password-with-token',
    component: () => import('../views/ResetPasswordView.vue') 
  },
  {
    // Usamos el mismo path de base, pero sin el parámetro
    path: '/reset-password-form', 
    name: 'reset-password-form',
    component: () => import('../views/ResetPasswordView.vue') 
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('x-token')
      if (token) {
        const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
        next(userData.user.role === 'ADMIN' ? '/home' : '/psychologist/dashboard')
      } else {
        next()
      }
    }
  },
  // Rutas del Admin
  {
    path: '/home',
    redirect: '/dashboard/home',
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/dashboard',
    name: 'admin-dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'home',
        name: 'admin-home',
        component: () => import('../views/AdminHomeView.vue')
      },
       {
        path: 'static-admin',
        name: 'static-admin',
        component: () => import('../views/staticsadmin.vue')
      },
      {
        path: 'profile-admin',
        name: 'profile-admin',
        component: () => import('../views/ProfileAdmin.vue')
      },
      {
        path: '',
        redirect: { name: 'admin-home' }
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('../views/ProfileView.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/UsersView.vue')
      }
    ]
  },
  // Rutas del Psicólogo
  {
    path: '/psychologist/dashboard',
    component: () => import('../views/psychologist/DashboardView.vue'),
    meta: { requiresAuth: true, requiresPsychologist: true },
    children: [
      {
        path: '',
        name: 'psychologist-home',
        component: () => import('../views/psychologist/PsychologistHomeView.vue')
      },
      {
        path: 'profile',
        name: 'psychologist-profile',
        component: () => import('../views/psychologist/ProfileView.vue')
      },
      {
        path: 'Evaluaciones',
        name: 'report-pdf',
        component: () => import('../views/psychologist/ReportPDF.vue')
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('../views/psychologist/HistoryStudent.vue')
      },
      {
        path: 'configuration',
        name: 'configuration',
        component: () => import('../views/psychologist/EditProfilePsicologist.vue')
      },
      {
        path: 'patients',
        name: 'psychologist-patients',
        component: PatientsView
      },
      {
        path: 'patients/:id',
        name: 'student-details',
        component: StudentDetailsView
      },
      {
        path: 'studenteva/:id',
        name: 'student-evaluation',
        component: () => import('../views/psychologist/EvaluationsStudent.vue')
      },
      {
        path: 'patients/:id/edit',
        name: 'edit-student',
        component: EditStudentView
      },
      {
        path: 'statistics',
        name: 'psychologist-statistics',
        component: () => import('../views/psychologist/StatisticsView.vue')
      }
    ]
  },
  // Redirección para la ruta /psychologist
  {
    path: '/psychologist',
    redirect: '/psychologist/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresPsychologist = to.matched.some(record => record.meta.requiresPsychologist)
  const token = localStorage.getItem('x-token')

  if (requiresAuth && !token) {
    next('/login')
    return
  }

  if (requiresAuth && token) {
    const userData = JSON.parse(localStorage.getItem('user-data') || '{}')
    
    if (!userData || !userData.user) {
      next('/login')
      return
    }

    // Verificar roles
    if (requiresAdmin && userData.user.role !== 'ADMIN') {
      next('/psychologist/dashboard')
      return
    }

    if (requiresPsychologist && userData.user.role !== 'PSYCHOLOGIST') {
      next('/home')
      return
    }
  }

  next()
})

export default router
