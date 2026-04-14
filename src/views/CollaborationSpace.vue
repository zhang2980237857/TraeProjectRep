<template>
  <div class="collaboration-space-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary">协作空间</h1>
          <p class="text-muted">团队沟通、讨论和协作的中心。</p>
        </div>
      </div>
      
      <!-- 操作栏 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary" @click="createDiscussion">
                      <i class="fas fa-plus"></i> 新建讨论
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="createGroup">
                      <i class="fas fa-users"></i> 新建群组
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="showMoreOptions">
                      <i class="fas fa-ellipsis-v"></i> 更多
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="搜索讨论..." v-model="searchQuery">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" @click="searchDiscussions">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 讨论列表 -->
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">讨论列表</h6>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item" :class="{ active: selectedDiscussion?.id === discussion.id }" v-for="discussion in discussions" :key="discussion.id" @click="selectDiscussion(discussion)">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ discussion.title }}</h6>
                      <small class="text-muted">{{ discussion.lastMessage }}</small>
                    </div>
                    <span class="badge badge-primary">{{ discussion.unreadCount }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">{{ selectedDiscussion?.title || '选择讨论' }}</h6>
            </div>
            <div class="card-body">
              <div v-if="selectedDiscussion" class="discussion-content">
                <div class="message-list" style="max-height: 400px; overflow-y: auto;">
                  <div class="message" v-for="message in selectedDiscussion.messages" :key="message.id">
                    <div class="message-header">
                      <span class="message-author">{{ message.author }}</span>
                      <span class="message-time">{{ message.time }}</span>
                    </div>
                    <div class="message-body">
                      {{ message.content }}
                    </div>
                  </div>
                </div>
                <div class="message-input mt-4">
                  <textarea class="form-control" placeholder="输入消息..." rows="3" v-model="messageContent"></textarea>
                  <div class="d-flex justify-content-end mt-2">
                    <button type="button" class="btn btn-outline-secondary mr-2" @click="attachFile">
                      <i class="fas fa-paperclip"></i>
                    </button>
                    <button type="button" class="btn btn-primary" @click="sendMessage">
                      发送
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-5">
                <p class="text-muted">请从左侧选择一个讨论</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 团队成员 -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">团队成员</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-2 col-md-3 col-sm-4 mb-4" v-for="member in teamMembers" :key="member.id">
                  <div class="card h-100 text-center">
                    <div class="card-body">
                      <div class="avatar mb-3">
                        <img :src="member.avatar" alt="Avatar" class="rounded-circle" style="width: 60px; height: 60px;">
                      </div>
                      <h5 class="card-title">{{ member.name }}</h5>
                      <p class="card-text text-muted">{{ member.role }}</p>
                      <div class="mt-2">
                        <button type="button" class="btn btn-sm btn-primary mr-2" @click="sendMessageToMember(member.id)">
                          <i class="fas fa-comment"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="addMember(member.id)">
                          <i class="fas fa-user-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 新建讨论对话框 -->
      <div class="modal" :class="{ 'show': showCreateDialog }" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">新建讨论</h5>
              <button type="button" class="close" @click="showCreateDialog = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="discussionTitle">讨论标题</label>
                  <input type="text" class="form-control" id="discussionTitle" v-model="newDiscussion.title" placeholder="请输入讨论标题">
                </div>
                <div class="form-group">
                  <label for="discussionDescription">讨论描述</label>
                  <textarea class="form-control" id="discussionDescription" v-model="newDiscussion.description" placeholder="请输入讨论描述" rows="3"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateDialog = false">取消</button>
              <button type="button" class="btn btn-primary" @click="saveDiscussion">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 状态变量
const showCreateDialog = ref(false)
const searchQuery = ref('')
const messageContent = ref('')
const newDiscussion = ref({
  title: '',
  description: ''
})

// 讨论数据
const discussions = ref([
  {
    id: '1',
    title: '项目管理系统开发讨论',
    lastMessage: '管理员: 请大家在周五前完成各自的任务',
    unreadCount: 2
  },
  {
    id: '2',
    title: '产品设计讨论',
    lastMessage: '成员 1: 我已经更新了产品原型',
    unreadCount: 0
  },
  {
    id: '3',
    title: '测试计划讨论',
    lastMessage: '成员 2: 测试用例已经准备好了',
    unreadCount: 1
  },
  {
    id: '4',
    title: '团队周会',
    lastMessage: '管理员: 本周工作总结',
    unreadCount: 0
  }
])

// 选中的讨论
const selectedDiscussion = ref({
  id: '1',
  title: '项目管理系统开发讨论',
  messages: [
    {
      id: '1',
      author: '管理员',
      time: '10:00',
      content: '大家好，今天我们来讨论项目管理系统的开发进度。'
    },
    {
      id: '2',
      author: '成员 1',
      time: '10:05',
      content: '我已经完成了任务看板的拖拽功能。'
    },
    {
      id: '3',
      author: '成员 2',
      time: '10:10',
      content: '测试用例已经编写完成。'
    },
    {
      id: '4',
      author: '管理员',
      time: '10:15',
      content: '请大家在周五前完成各自的任务。'
    }
  ]
})

// 团队成员数据
const teamMembers = ref([
  {
    id: '1',
    name: '管理员',
    role: '项目管理员',
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: '2',
    name: '成员 1',
    role: '前端开发',
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: '3',
    name: '成员 2',
    role: '测试工程师',
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: '4',
    name: '成员 3',
    role: '后端开发',
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: '5',
    name: '成员 4',
    role: '产品经理',
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: '6',
    name: '成员 5',
    role: 'UI 设计师',
    avatar: 'https://via.placeholder.com/60'
  }
])

// 新建讨论
const createDiscussion = () => {
  showCreateDialog.value = true
}

// 新建群组
const createGroup = () => {
  console.log('新建群组')
  // 实现新建群组功能
}

// 显示更多选项
const showMoreOptions = () => {
  console.log('显示更多选项')
  // 实现更多选项功能
}

// 搜索讨论
const searchDiscussions = () => {
  console.log('搜索讨论:', searchQuery.value)
  // 实现搜索讨论功能
}

// 选择讨论
const selectDiscussion = (discussion: any) => {
  selectedDiscussion.value = discussion
  console.log('选择讨论:', discussion.title)
  // 实现选择讨论功能
}

// 发送消息
const sendMessage = () => {
  if (messageContent.value && selectedDiscussion.value) {
    console.log('发送消息:', messageContent.value)
    // 实现发送消息功能
    messageContent.value = ''
  }
}

// 附加文件
const attachFile = () => {
  console.log('附加文件')
  // 实现附加文件功能
}

// 发送消息给成员
const sendMessageToMember = (memberId: string) => {
  console.log('发送消息给成员:', memberId)
  // 实现发送消息给成员功能
}

// 添加成员
const addMember = (memberId: string) => {
  console.log('添加成员:', memberId)
  // 实现添加成员功能
}

// 保存讨论
const saveDiscussion = () => {
  if (newDiscussion.value.title) {
    console.log('保存讨论:', newDiscussion.value)
    // 实现保存讨论功能
    showCreateDialog.value = false
    // 重置表单
    newDiscussion.value = {
      title: '',
      description: ''
    }
  } else {
    alert('请输入讨论标题')
  }
}
</script>

<style scoped>
.collaboration-space-container {
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

.btn-group {
  gap: 8px;
}

.btn {
  border-radius: 0.35rem;
}

.input-group {
  max-width: 300px;
  margin-left: auto;
}

.list-group-item {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px 16px;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.list-group-item.active {
  background-color: #007bff;
  border-color: #007bff;
}

.message {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.message-author {
  font-weight: 600;
  color: #495057;
}

.message-time {
  color: #6c757d;
}

.message-body {
  color: #495057;
  line-height: 1.5;
}

.message-input textarea {
  border-radius: 8px;
}

.avatar img {
  object-fit: cover;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.card-text {
  font-size: 0.875rem;
}
</style>