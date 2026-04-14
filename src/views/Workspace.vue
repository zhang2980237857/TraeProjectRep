<template>
  <div class="workspace-container">
    <h1>{{ workspaceStore.currentWorkspace.name }}</h1>
    <a-card v-for="project in workspaceStore.activeProjects" :key="project.id" class="project-card">
      <a-card-head>
        <a-card-title>{{ project.name }}</a-card-title>
        <a-card-extra>
          <a-button type="link" @click="navigateToProject(project.id)">查看</a-button>
          <a-button type="link" danger @click="archiveProject(project.id)">归档</a-button>
        </a-card-extra>
      </a-card-head>
      <a-card-body>
        <p>{{ project.description }}</p>
        <div class="project-meta">
          <span class="member-count">成员: {{ project.members.length }}</span>
          <span class="created-at">创建时间: {{ formatDate(project.createdAt) }}</span>
        </div>
      </a-card-body>
    </a-card>

    <!-- 新建项目对话框 -->
    <a-modal
      v-model:open="workspaceStore.showCreateProjectDialog"
      title="新建项目"
      @ok="handleCreateProject"
    >
      <a-form :model="newProject" layout="vertical">
        <a-form-item label="项目名称" required>
          <a-input v-model:value="newProject.name" placeholder="请输入项目名称" />
        </a-form-item>
        <a-form-item label="项目描述">
          <a-textarea v-model:value="newProject.description" placeholder="请输入项目描述" />
        </a-form-item>
        <a-form-item label="项目成员">
          <a-select
            v-model:value="newProject.members"
            mode="multiple"
            placeholder="请选择项目成员"
          >
            <a-select-option value="1">管理员</a-select-option>
            <a-select-option value="2">成员 1</a-select-option>
            <a-select-option value="3">成员 2</a-select-option>
            <a-select-option value="4">成员 3</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'

const router = useRouter()
const workspaceStore = useWorkspaceStore()

const newProject = ref({
  name: '',
  description: '',
  members: ['1'],
  status: 'active' as const
})

const navigateToProject = (projectId: string) => {
  router.push(`/project/${projectId}`)
}

const archiveProject = (projectId: string) => {
  workspaceStore.archiveProject(projectId)
}

const handleCreateProject = () => {
  workspaceStore.createProject(newProject.value)
  // 重置表单
  newProject.value = {
    name: '',
    description: '',
    members: ['1'],
    status: 'active'
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.workspace-container {
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.member-count,
.created-at {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ant-card-head {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.ant-card-body {
  padding: 24px;
}

.ant-card-extra {
  display: flex;
  gap: 8px;
}
</style>