import { createRouter, createWebHistory } from 'vue-router'
import Workspace from '../views/Workspace.vue'
import Project from '../views/Project.vue'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import Profile from '../views/Profile.vue'
import Home from '../views/Home.vue'
import ProductManagement from '../views/ProductManagement.vue'
import TestManagement from '../views/TestManagement.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import CollaborationSpace from '../views/CollaborationSpace.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: Workspace
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: Project
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/product-management',
    name: 'ProductManagement',
    component: ProductManagement
  },
  {
    path: '/test-management',
    name: 'TestManagement',
    component: TestManagement
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: KnowledgeBase
  },
  {
    path: '/collaboration-space',
    name: 'CollaborationSpace',
    component: CollaborationSpace
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router