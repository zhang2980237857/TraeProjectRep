<template>
  <div class="settings-container">
    <h1>设置</h1>
    <a-tabs default-active-key="members">
      <a-tab-pane key="members" tab="成员管理">
        <a-card>
          <a-card-head>
            <a-card-title>团队成员</a-card-title>
            <a-card-extra>
              <a-button type="primary" @click="showAddMemberDialog = true">
                <template #icon>
                  <PlusOutlined />
                </template>
                添加成员
              </a-button>
            </a-card-extra>
          </a-card-head>
          <a-card-body>
            <a-table :columns="memberColumns" :data-source="members" row-key="id">
              <template #column:actions="{ record }">
                <a-button type="link" @click="editMember(record)">编辑</a-button>
                <a-button type="link" danger @click="removeMember(record.id)">移除</a-button>
              </template>
            </a-table>
          </a-card-body>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="permissions" tab="权限管理">
        <a-card>
          <a-card-head>
            <a-card-title>角色权限</a-card-title>
          </a-card-head>
          <a-card-body>
            <a-table :columns="permissionColumns" :data-source="roles" row-key="id">
              <template #column:permissions="{ record }">
                <div class="permission-list">
                  <span class="permission-item" v-for="permission in record.permissions" :key="permission">
                    {{ permission }}
                  </span>
                </div>
              </template>
              <template #column:actions="{ record }">
                <a-button type="link" @click="editRole(record)">编辑</a-button>
              </template>
            </a-table>
          </a-card-body>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="general" tab="通用设置">
        <a-card>
          <a-card-head>
            <a-card-title>工作空间设置</a-card-title>
          </a-card-head>
          <a-card-body>
            <a-form :model="workspaceSettings" layout="vertical">
              <a-form-item label="工作空间名称">
                <a-input v-model:value="workspaceSettings.name" />
              </a-form-item>
              <a-form-item label="工作空间描述">
                <a-textarea v-model:value="workspaceSettings.description" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="saveWorkspaceSettings">保存设置</a-button>
              </a-form-item>
            </a-form>
          </a-card-body>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <!-- 添加成员对话框 -->
    <a-modal
      v-model:open="showAddMemberDialog"
      title="添加成员"
      @ok="handleAddMember"
    >
      <a-form :model="newMember" layout="vertical">
        <a-form-item label="姓名" required>
          <a-input v-model:value="newMember.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input v-model:value="newMember.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="newMember.role" placeholder="请选择角色">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="member">成员</a-select-option>
            <a-select-option value="guest">访客</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

// 成员数据
const members = ref([
  {
    id: '1',
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin',
    joinedAt: new Date()
  },
  {
    id: '2',
    name: '成员 1',
    email: 'member1@example.com',
    role: 'member',
    joinedAt: new Date()
  },
  {
    id: '3',
    name: '成员 2',
    email: 'member2@example.com',
    role: 'member',
    joinedAt: new Date()
  },
  {
    id: '4',
    name: '成员 3',
    email: 'member3@example.com',
    role: 'guest',
    joinedAt: new Date()
  }
])

// 角色权限数据
const roles = ref([
  {
    id: '1',
    name: '管理员',
    permissions: ['管理成员', '管理项目', '管理权限', '查看所有任务', '编辑所有任务']
  },
  {
    id: '2',
    name: '成员',
    permissions: ['查看所有任务', '编辑分配给我的任务', '创建任务']
  },
  {
    id: '3',
    name: '访客',
    permissions: ['查看所有任务']
  }
])

// 工作空间设置
const workspaceSettings = ref({
  name: '默认工作空间',
  description: '这是默认工作空间'
})

// 对话框状态
const showAddMemberDialog = ref(false)

// 新成员表单
const newMember = ref({
  name: '',
  email: '',
  role: 'member'
})

// 成员表格列
const memberColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    customRender: (text: string) => {
      switch (text) {
        case 'admin': return '管理员'
        case 'member': return '成员'
        case 'guest': return '访客'
        default: return text
      }
    }
  },
  {
    title: '加入时间',
    dataIndex: 'joinedAt',
    key: 'joinedAt',
    customRender: (text: Date) => new Date(text).toLocaleString('zh-CN')
  },
  {
    title: '操作',
    key: 'actions',
    slots: { customRender: 'actions' }
  }
]

// 权限表格列
const permissionColumns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '权限',
    dataIndex: 'permissions',
    key: 'permissions',
    slots: { customRender: 'permissions' }
  },
  {
    title: '操作',
    key: 'actions',
    slots: { customRender: 'actions' }
  }
]

// 处理添加成员
const handleAddMember = () => {
  members.value.push({
    id: Date.now().toString(),
    ...newMember.value,
    joinedAt: new Date()
  })
  // 重置表单
  newMember.value = {
    name: '',
    email: '',
    role: 'member'
  }
  showAddMemberDialog.value = false
}

// 编辑成员
const editMember = (member: any) => {
  // 实现编辑成员逻辑
  console.log('编辑成员:', member)
}

// 移除成员
const removeMember = (memberId: string) => {
  members.value = members.value.filter(member => member.id !== memberId)
}

// 编辑角色
const editRole = (role: any) => {
  // 实现编辑角色逻辑
  console.log('编辑角色:', role)
}

// 保存工作空间设置
const saveWorkspaceSettings = () => {
  // 实现保存设置逻辑
  console.log('保存工作空间设置:', workspaceSettings.value)
}
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
}

.ant-tabs {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.ant-tabs-tab {
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 500;
}

.ant-tabs-content {
  padding: 24px;
}

.ant-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.ant-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.ant-card-head {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.ant-card-body {
  padding: 24px;
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-item {
  background: #f0f0f0;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 12px;
  color: #666;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.permission-item:hover {
  background: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.ant-btn-primary {
  border-radius: 6px;
}

.ant-btn {
  border-radius: 6px;
}

.ant-table {
  border-radius: 8px;
  overflow: hidden;
}

.ant-table-thead > tr > th {
  background: #fafafa;
  font-weight: 600;
}

.ant-form-item {
  margin-bottom: 20px;
}

.ant-input,
.ant-select,
.ant-textarea {
  border-radius: 6px;
}
</style>