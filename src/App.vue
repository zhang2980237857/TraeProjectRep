<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <h3 class="logo">项目管理工具</h3>
      </div>
      <ul class="sidebar-menu">
        <li class="menu-item" :class="{ active: currentRoute === '/' }">
          <a href="#" @click="navigateTo('/')" class="menu-link">
            <i class="fas fa-home mr-2"></i>
            <span>工作台</span>
          </a>
        </li>
        <li class="menu-item" :class="{ active: currentRoute === '/product-management' }">
          <a href="#" @click="navigateTo('/product-management')" class="menu-link">
            <i class="fas fa-box mr-2"></i>
            <span>产品管理</span>
          </a>
        </li>
        <li class="menu-item" :class="{ active: currentRoute === '/workspace' }">
          <a href="#" @click="navigateTo('/workspace')" class="menu-link">
            <i class="fas fa-project-diagram mr-2"></i>
            <span>项目管理</span>
          </a>
        </li>
        <li class="menu-item" :class="{ active: currentRoute === '/test-management' }">
          <a href="#" @click="navigateTo('/test-management')" class="menu-link">
            <i class="fas fa-vial mr-2"></i>
            <span>测试管理</span>
          </a>
        </li>
        <li class="menu-item" :class="{ active: currentRoute === '/knowledge-base' }">
          <a href="#" @click="navigateTo('/knowledge-base')" class="menu-link">
            <i class="fas fa-book mr-2"></i>
            <span>知识库管理</span>
          </a>
        </li>
        <li class="menu-item" :class="{ active: currentRoute === '/collaboration-space' }">
          <a href="#" @click="navigateTo('/collaboration-space')" class="menu-link">
            <i class="fas fa-comments mr-2"></i>
            <span>协作空间</span>
          </a>
        </li>
        <li class="menu-item" :class="{ active: currentRoute === '/settings' }">
          <a href="#" @click="navigateTo('/settings')" class="menu-link">
            <i class="fas fa-cog mr-2"></i>
            <span>设置</span>
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-nav">
        <div class="nav-left">
          <button type="button" class="btn btn-primary" @click="createProject">
            <i class="fas fa-plus mr-1"></i> 新建项目
          </button>
        </div>
        <div class="nav-right">
          <div class="user-menu" style="position: relative;">
            <a href="#" @click.stop="dropdownOpen = !dropdownOpen" class="user-link">
              <span class="user-name">{{ currentUser.name }}</span>
              <i class="fas fa-chevron-down ml-1"></i>
            </a>
            <div v-if="dropdownOpen" class="dropdown-menu">
              <a href="#" @click="handleProfileClick" class="dropdown-item">
                <i class="fas fa-user mr-2"></i>
                个人设置
              </a>
              <a href="#" @click="handleLogoutClick" class="dropdown-item">
                <i class="fas fa-sign-out-alt mr-2"></i>
                退出登录
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from './stores/workspace'

const router = useRouter()
const workspaceStore = useWorkspaceStore()

const currentRoute = computed(() => router.currentRoute.value.path)
const currentUser = ref({
  id: '1',
  name: '管理员',
  avatar: ''
})

const dropdownOpen = ref(false)

const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToProfile = () => {
  dropdownOpen.value = false
  router.push('/profile')
}

const logout = () => {
  dropdownOpen.value = false
  // 执行退出登录逻辑
  console.log('退出登录')
  // 这里可以添加清除用户信息、跳转到登录页等逻辑
}

const handleProfileClick = (event: Event) => {
  event.preventDefault()
  dropdownOpen.value = false
  router.push('/profile')
}

const handleLogoutClick = (event: Event) => {
  event.preventDefault()
  dropdownOpen.value = false
  // 执行退出登录逻辑
  console.log('退出登录')
  // 这里可以添加清除用户信息、跳转到登录页等逻辑
}

const createProject = () => {
  // 打开新建项目对话框
  workspaceStore.showCreateProjectDialog = true
}
</script>

<style scoped>
/* 全局布局 */
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fc;
}

/* 侧边栏 */
.sidebar {
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
  transition: all 0.3s ease;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e3e6f0;
}

.logo {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #007bff;
  text-align: center;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-link:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.menu-item.active .menu-link {
  background-color: #e3f2fd;
  color: #007bff;
  border-left-color: #007bff;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-link {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #495057;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.user-link:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.user-name {
  font-weight: 500;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 9999;
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .logo {
    font-size: 16px;
  }
  
  .menu-link {
    padding: 10px 16px;
  }
  
  .top-nav {
    padding: 10px 16px;
  }
}
</style>