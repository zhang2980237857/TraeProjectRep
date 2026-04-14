import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: Date | null
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'done'
  tags: string[]
  attachments: string[]
  subtasks: {
    id: string
    title: string
    completed: boolean
  }[]
  comments: {
    id: string
    user: string
    content: string
    createdAt: Date
  }[]
  createdAt: Date
}

export const useProjectStore = defineStore('project', () => {
  const tasks = ref<Task[]>([
    {
      id: '1',
      title: '设计项目架构',
      description: '设计项目的整体架构和技术栈',
      assignee: '1',
      dueDate: new Date('2026-04-20'),
      priority: 'high',
      status: 'todo',
      tags: ['架构', '设计'],
      attachments: [],
      subtasks: [
        { id: '1-1', title: '技术选型', completed: false },
        { id: '1-2', title: '架构设计', completed: false }
      ],
      comments: [],
      createdAt: new Date()
    },
    {
      id: '2',
      title: '实现任务看板',
      description: '实现拖拽式任务看板功能',
      assignee: '2',
      dueDate: new Date('2026-04-25'),
      priority: 'medium',
      status: 'in_progress',
      tags: ['前端', '功能'],
      attachments: [],
      subtasks: [
        { id: '2-1', title: '看板组件', completed: true },
        { id: '2-2', title: '拖拽功能', completed: false }
      ],
      comments: [],
      createdAt: new Date()
    },
    {
      id: '3',
      title: '实现实时同步',
      description: '使用 WebSocket 实现实时同步功能',
      assignee: '3',
      dueDate: new Date('2026-04-30'),
      priority: 'high',
      status: 'todo',
      tags: ['后端', '实时'],
      attachments: [],
      subtasks: [],
      comments: [],
      createdAt: new Date()
    }
  ])

  const todoTasks = computed(() => tasks.value.filter(task => task.status === 'todo'))
  const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in_progress'))
  const doneTasks = computed(() => tasks.value.filter(task => task.status === 'done'))

  const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      comments: [],
      createdAt: new Date()
    }
    tasks.value.push(newTask)
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
    }
  }

  const addComment = (taskId: string, comment: Omit<Task['comments'][0], 'id' | 'createdAt'>) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.comments.push({
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date()
      })
    }
  }

  return {
    tasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    createTask,
    updateTaskStatus,
    addComment
  }
})