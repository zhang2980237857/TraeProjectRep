<template>
  <div class="home-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary">工作台</h1>
          <p class="text-muted">欢迎回来，管理员！这里是您的工作中心，查看所有项目和任务的概览。</p>
        </div>
      </div>
      
      <!-- 统计卡片 -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    总项目数
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalProjects }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-project-diagram fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    已完成任务
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ completedTasks }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-check-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    进行中任务
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ inProgressTasks }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-spinner fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-left-danger shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    待处理任务
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ pendingTasks }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 最近项目 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">最近项目</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>项目名称</th>
                      <th>状态</th>
                      <th>进度</th>
                      <th>成员数</th>
                      <th>最后更新</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="project in recentProjects" :key="project.id">
                      <td>{{ project.name }}</td>
                      <td>
                        <span class="badge" :class="getProjectStatusClass(project.status)">
                          {{ project.status }}
                        </span>
                      </td>
                      <td>
                        <div class="progress" style="height: 10px;">
                          <div 
                            class="progress-bar" 
                            :class="getProgressBarClass(project.progress)"
                            :style="{ width: project.progress + '%' }"
                            role="progressbar"
                            :aria-valuenow="project.progress"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <small class="text-muted">{{ project.progress }}%</small>
                      </td>
                      <td>{{ project.members }}</td>
                      <td>{{ project.lastUpdated }}</td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary" @click="navigateToProject(project.id)">
                          查看
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 我的任务 -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">我的任务</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>任务名称</th>
                      <th>项目</th>
                      <th>优先级</th>
                      <th>截止日期</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in myTasks" :key="task.id">
                      <td>{{ task.name }}</td>
                      <td>{{ task.project }}</td>
                      <td>
                        <span class="badge" :class="getTaskPriorityClass(task.priority)">
                          {{ task.priority }}
                        </span>
                      </td>
                      <td>{{ task.dueDate }}</td>
                      <td>
                        <span class="badge" :class="getTaskStatusClass(task.status)">
                          {{ task.status }}
                        </span>
                      </td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary">
                          详情
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const totalProjects = ref(12)
const completedTasks = ref(45)
const inProgressTasks = ref(12)
const pendingTasks = ref(8)

// 最近项目数据
const recentProjects = ref([
  {
    id: '1',
    name: '项目管理系统',
    status: '进行中',
    progress: 65,
    members: 5,
    lastUpdated: '2026-04-13'
  },
  {
    id: '2',
    name: '产品设计',
    status: '进行中',
    progress: 40,
    members: 3,
    lastUpdated: '2026-04-12'
  },
  {
    id: '3',
    name: '测试自动化',
    status: '已完成',
    progress: 100,
    members: 2,
    lastUpdated: '2026-04-11'
  },
  {
    id: '4',
    name: '知识库建设',
    status: '计划中',
    progress: 10,
    members: 4,
    lastUpdated: '2026-04-10'
  }
])

// 我的任务数据
const myTasks = ref([
  {
    id: '1',
    name: '设计项目架构',
    project: '项目管理系统',
    priority: '高',
    dueDate: '2026-04-15',
    status: '进行中'
  },
  {
    id: '2',
    name: '实现任务看板',
    project: '项目管理系统',
    priority: '中',
    dueDate: '2026-04-20',
    status: '待处理'
  },
  {
    id: '3',
    name: '编写测试用例',
    project: '测试自动化',
    priority: '中',
    dueDate: '2026-04-18',
    status: '已完成'
  },
  {
    id: '4',
    name: '整理产品文档',
    project: '产品设计',
    priority: '低',
    dueDate: '2026-04-22',
    status: '待处理'
  }
])

// 导航到项目详情
const navigateToProject = (projectId: string) => {
  router.push(`/project/${projectId}`)
}

// 获取项目状态的样式类
const getProjectStatusClass = (status: string) => {
  switch (status) {
    case '进行中':
      return 'badge-warning'
    case '已完成':
      return 'badge-success'
    case '计划中':
      return 'badge-info'
    default:
      return 'badge-secondary'
  }
}

// 获取进度条的样式类
const getProgressBarClass = (progress: number) => {
  if (progress >= 80) {
    return 'bg-success'
  } else if (progress >= 50) {
    return 'bg-warning'
  } else {
    return 'bg-info'
  }
}

// 获取任务优先级的样式类
const getTaskPriorityClass = (priority: string) => {
  switch (priority) {
    case '高':
      return 'badge-danger'
    case '中':
      return 'badge-warning'
    case '低':
      return 'badge-info'
    default:
      return 'badge-secondary'
  }
}

// 获取任务状态的样式类
const getTaskStatusClass = (status: string) => {
  switch (status) {
    case '待处理':
      return 'badge-secondary'
    case '进行中':
      return 'badge-warning'
    case '已完成':
      return 'badge-success'
    default:
      return 'badge-secondary'
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.card {
  border-radius: 0.35rem;
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #e3e6f0;
}

.table {
  font-size: 0.875rem;
}

.progress {
  margin-bottom: 5px;
}
</style>