import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Project {
  id: string
  name: string
  description: string
  members: string[]
  status: 'active' | 'archived'
  createdAt: Date
}

interface Workspace {
  id: string
  name: string
  projects: Project[]
  members: string[]
}

export const useWorkspaceStore = defineStore('workspace', () => {
  const workspaces = ref<Workspace[]>([
    {
      id: '1',
      name: '默认工作空间',
      projects: [
        {
          id: '1',
          name: '项目 A',
          description: '这是一个测试项目',
          members: ['1', '2', '3'],
          status: 'active',
          createdAt: new Date()
        },
        {
          id: '2',
          name: '项目 B',
          description: '这是另一个测试项目',
          members: ['1', '4'],
          status: 'active',
          createdAt: new Date()
        }
      ],
      members: ['1', '2', '3', '4']
    }
  ])

  const currentWorkspace = ref<Workspace>(workspaces.value[0])
  const showCreateProjectDialog = ref(false)

  const activeProjects = computed(() => {
    return currentWorkspace.value.projects.filter(project => project.status === 'active')
  })

  const createProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    currentWorkspace.value.projects.push(newProject)
    showCreateProjectDialog.value = false
  }

  const archiveProject = (projectId: string) => {
    const project = currentWorkspace.value.projects.find(p => p.id === projectId)
    if (project) {
      project.status = 'archived'
    }
  }

  return {
    workspaces,
    currentWorkspace,
    showCreateProjectDialog,
    activeProjects,
    createProject,
    archiveProject
  }
})