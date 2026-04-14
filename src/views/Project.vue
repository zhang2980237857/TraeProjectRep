<template>
  <div class="project-container">
    <h1>项目详情</h1>
    <div class="kanban-board">
      <div class="kanban-column">
        <h3>待处理</h3>
        <draggable
          v-model="todoTasks"
          group="tasks"
          item-key="id"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div class="task-card" @click="showTaskDetail(element)">
              <div class="task-title">{{ element.title }}</div>
              <div class="task-meta">
                <span class="task-priority" :class="element.priority">{{ getPriorityText(element.priority) }}</span>
                <span class="task-assignee">负责人: {{ element.assignee }}</span>
                <span class="task-due-date" v-if="element.dueDate">截止: {{ formatDate(element.dueDate) }}</span>
              </div>
              <div class="task-tags">
                <span class="task-tag" v-for="tag in element.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="kanban-column">
        <h3>进行中</h3>
        <draggable
          v-model="inProgressTasks"
          group="tasks"
          item-key="id"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div class="task-card" @click="showTaskDetail(element)">
              <div class="task-title">{{ element.title }}</div>
              <div class="task-meta">
                <span class="task-priority" :class="element.priority">{{ getPriorityText(element.priority) }}</span>
                <span class="task-assignee">负责人: {{ element.assignee }}</span>
                <span class="task-due-date" v-if="element.dueDate">截止: {{ formatDate(element.dueDate) }}</span>
              </div>
              <div class="task-tags">
                <span class="task-tag" v-for="tag in element.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="kanban-column">
        <h3>已完成</h3>
        <draggable
          v-model="doneTasks"
          group="tasks"
          item-key="id"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div class="task-card" @click="showTaskDetail(element)">
              <div class="task-title">{{ element.title }}</div>
              <div class="task-meta">
                <span class="task-priority" :class="element.priority">{{ getPriorityText(element.priority) }}</span>
                <span class="task-assignee">负责人: {{ element.assignee }}</span>
                <span class="task-due-date" v-if="element.dueDate">截止: {{ formatDate(element.dueDate) }}</span>
              </div>
              <div class="task-tags">
                <span class="task-tag" v-for="tag in element.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 新建任务按钮 -->
    <a-button type="primary" @click="showCreateTaskDialog = true" style="position: fixed; bottom: 24px; right: 24px;">
      <template #icon>
        <PlusOutlined />
      </template>
      新建任务
    </a-button>

    <!-- 任务详情对话框 -->
    <a-modal
      v-model:open="showTaskDetailDialog"
      :title="selectedTask?.title || '任务详情'"
      width="600"
    >
      <div v-if="selectedTask" class="task-detail">
        <p>{{ selectedTask.description }}</p>
        <div class="task-detail-meta">
          <div class="meta-item">
            <span class="meta-label">负责人:</span>
            <span class="meta-value">{{ selectedTask.assignee }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">优先级:</span>
            <span class="meta-value priority" :class="selectedTask.priority">{{ getPriorityText(selectedTask.priority) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">截止日期:</span>
            <span class="meta-value">{{ selectedTask.dueDate ? formatDate(selectedTask.dueDate) : '无' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">状态:</span>
            <span class="meta-value">{{ getStatusText(selectedTask.status) }}</span>
          </div>
        </div>
        <div class="task-tags">
          <span class="task-tag" v-for="tag in selectedTask.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="subtasks">
          <h4>子任务</h4>
          <div v-for="subtask in selectedTask.subtasks" :key="subtask.id" class="subtask-item">
            <a-checkbox v-model:checked="subtask.completed">{{ subtask.title }}</a-checkbox>
          </div>
        </div>
        <div class="comments">
          <h4>评论</h4>
          <div v-for="comment in selectedTask.comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="comment-user">{{ comment.user }}</span>
              <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
          <div class="comment-input">
            <a-input
              v-model:value="newComment"
              placeholder="添加评论..."
              @keyup.enter="addComment"
            />
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 新建任务对话框 -->
    <a-modal
      v-model:open="showCreateTaskDialog"
      title="新建任务"
      @ok="handleCreateTask"
    >
      <a-form :model="newTask" layout="vertical">
        <a-form-item label="任务标题" required>
          <a-input v-model:value="newTask.title" placeholder="请输入任务标题" />
        </a-form-item>
        <a-form-item label="任务描述">
          <a-textarea v-model:value="newTask.description" placeholder="请输入任务描述" />
        </a-form-item>
        <a-form-item label="负责人">
          <a-select v-model:value="newTask.assignee" placeholder="请选择负责人">
            <a-select-option value="1">管理员</a-select-option>
            <a-select-option value="2">成员 1</a-select-option>
            <a-select-option value="3">成员 2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="截止日期">
          <a-date-picker v-model:value="newTask.dueDate" style="width: 100%" />
        </a-form-item>
        <a-form-item label="优先级">
          <a-radio-group v-model:value="newTask.priority">
            <a-radio-button value="high">高</a-radio-button>
            <a-radio-button value="medium">中</a-radio-button>
            <a-radio-button value="low">低</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            v-model:value="newTask.tags"
            mode="multiple"
            placeholder="请选择标签"
          >
            <a-select-option value="前端">前端</a-select-option>
            <a-select-option value="后端">后端</a-select-option>
            <a-select-option value="设计">设计</a-select-option>
            <a-select-option value="架构">架构</a-select-option>
            <a-select-option value="功能">功能</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useProjectStore } from '../stores/project'

const projectStore = useProjectStore()

// 计算属性，按状态分组任务
const todoTasks = computed({
  get: () => projectStore.todoTasks,
  set: (value) => {
    // 这里可以添加逻辑来更新状态
  }
})

const inProgressTasks = computed({
  get: () => projectStore.inProgressTasks,
  set: (value) => {
    // 这里可以添加逻辑来更新状态
  }
})

const doneTasks = computed({
  get: () => projectStore.doneTasks,
  set: (value) => {
    // 这里可以添加逻辑来更新状态
  }
})

// 对话框状态
const showTaskDetailDialog = ref(false)
const showCreateTaskDialog = ref(false)
const selectedTask = ref<any>(null)
const newComment = ref('')

// 新建任务表单
const newTask = ref({
  title: '',
  description: '',
  assignee: '1',
  dueDate: null as Date | null,
  priority: 'medium' as 'high' | 'medium' | 'low',
  status: 'todo' as 'todo' | 'in_progress' | 'done',
  tags: [] as string[],
  attachments: [] as string[],
  subtasks: [] as { id: string; title: string; completed: boolean }[]
})

// 拖拽结束处理
const handleDragEnd = (evt: any) => {
  if (evt.to && evt.from) {
    const taskId = evt.item.id
    let newStatus: 'todo' | 'in_progress' | 'done'
    
    if (evt.to.parentElement.classList.contains('kanban-column')) {
      const columnTitle = evt.to.parentElement.querySelector('h3')?.textContent
      switch (columnTitle) {
        case '待处理':
          newStatus = 'todo'
          break
        case '进行中':
          newStatus = 'in_progress'
          break
        case '已完成':
          newStatus = 'done'
          break
        default:
          return
      }
      projectStore.updateTaskStatus(taskId, newStatus)
    }
  }
}

// 显示任务详情
const showTaskDetail = (task: any) => {
  selectedTask.value = task
  showTaskDetailDialog.value = true
}

// 添加评论
const addComment = () => {
  if (newComment.value && selectedTask.value) {
    projectStore.addComment(selectedTask.value.id, {
      user: '管理员',
      content: newComment.value
    })
    newComment.value = ''
  }
}

// 新建任务
const handleCreateTask = () => {
  projectStore.createTask(newTask.value)
  // 重置表单
  newTask.value = {
    title: '',
    description: '',
    assignee: '1',
    dueDate: null,
    priority: 'medium',
    status: 'todo',
    tags: [],
    attachments: [],
    subtasks: []
  }
  showCreateTaskDialog.value = false
}

// 辅助函数
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '高'
    case 'medium': return '中'
    case 'low': return '低'
    default: return priority
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'todo': return '待处理'
    case 'in_progress': return '进行中'
    case 'done': return '已完成'
    default: return status
  }
}
</script>

<style scoped>
.project-container {
  max-width: 1400px;
  margin: 0 auto;
}

.kanban-board {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  min-height: 700px;
}

.kanban-column {
  flex: 1;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  min-height: 700px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.kanban-column h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.kanban-column h3::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.kanban-column:nth-child(1) h3::before {
  background-color: #1890ff;
}

.kanban-column:nth-child(2) h3::before {
  background-color: #faad14;
}

.kanban-column:nth-child(3) h3::before {
  background-color: #52c41a;
}

.task-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.task-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
  border-color: #e6f7ff;
}

.task-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  font-size: 15px;
  line-height: 1.4;
}

.task-meta {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-priority {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 8px;
}

.task-priority.high {
  background: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffccc7;
}

.task-priority.medium {
  background: #fffbe6;
  color: #d48806;
  border: 1px solid #ffe58f;
}

.task-priority.low {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.task-tag {
  background: #f0f0f0;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 11px;
  color: #666;
  border: 1px solid #e8e8e8;
}

.task-detail {
  line-height: 1.6;
}

.task-detail-meta {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.meta-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-label {
  width: 90px;
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.meta-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.meta-value.priority {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
}

.subtasks {
  margin: 20px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.subtasks h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.subtask-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comments {
  margin-top: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.comments h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.comment-item {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  color: #666;
}

.comment-user {
  font-weight: 500;
  color: #333;
}

.comment-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.comment-input {
  margin-top: 16px;
}

.ant-btn-primary {
  border-radius: 6px;
}

.ant-btn {
  border-radius: 6px;
}

.ant-modal {
  border-radius: 12px;
}

.ant-modal-header {
  border-radius: 12px 12px 0 0;
}
</style>