<template>
  <div class="profile-container">
    <h1>个人设置</h1>
    <a-card class="profile-card">
      <a-card-head>
        <a-card-title>个人信息</a-card-title>
      </a-card-head>
      <a-card-body>
        <div class="profile-avatar">
          <a-avatar :size="100" :src="userInfo.avatar">
            {{ userInfo.name.charAt(0) }}
          </a-avatar>
          <a-button type="primary" @click="uploadAvatar" style="margin-top: 16px;">
            <template #icon>
              <UploadOutlined />
            </template>
            上传头像
          </a-button>
        </div>
        <a-form :model="userInfo" layout="vertical" style="margin-top: 24px;">
          <a-form-item label="姓名" required>
            <a-input v-model:value="userInfo.name" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item label="邮箱" required>
            <a-input v-model:value="userInfo.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input v-model:value="userInfo.phone" placeholder="请输入手机号码" />
          </a-form-item>
          <a-form-item label="职位">
            <a-input v-model:value="userInfo.position" placeholder="请输入职位" />
          </a-form-item>
          <a-form-item label="部门">
            <a-input v-model:value="userInfo.department" placeholder="请输入部门" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="saveProfile">保存修改</a-button>
          </a-form-item>
        </a-form>
      </a-card-body>
    </a-card>
    <a-card class="profile-card" style="margin-top: 24px;">
      <a-card-head>
        <a-card-title>账户安全</a-card-title>
      </a-card-head>
      <a-card-body>
        <a-list item-layout="horizontal">
          <a-list-item>
            <a-list-item-meta>
              <div slot="title">修改密码</div>
              <div slot="description">定期修改密码可以提高账户安全性</div>
            </a-list-item-meta>
            <a-button type="link" @click="showChangePasswordDialog = true">修改</a-button>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <div slot="title">绑定手机</div>
              <div slot="description">{{ userInfo.phone ? '已绑定' : '未绑定' }}</div>
            </a-list-item-meta>
            <a-button type="link" @click="showBindPhoneDialog = true">{{ userInfo.phone ? '更换' : '绑定' }}</a-button>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <div slot="title">绑定邮箱</div>
              <div slot="description">{{ userInfo.email ? '已绑定' : '未绑定' }}</div>
            </a-list-item-meta>
            <a-button type="link" @click="showBindEmailDialog = true">{{ userInfo.email ? '更换' : '绑定' }}</a-button>
          </a-list-item>
        </a-list>
      </a-card-body>
    </a-card>

    <!-- 修改密码对话框 -->
    <a-modal
      v-model:open="showChangePasswordDialog"
      title="修改密码"
      @ok="handleChangePassword"
    >
      <a-form :model="passwordForm" layout="vertical">
        <a-form-item label="当前密码" required>
          <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </a-form-item>
        <a-form-item label="新密码" required>
          <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认新密码" required>
          <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请确认新密码" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 绑定手机对话框 -->
    <a-modal
      v-model:open="showBindPhoneDialog"
      title="{{ userInfo.phone ? '更换手机' : '绑定手机' }}"
      @ok="handleBindPhone"
    >
      <a-form :model="phoneForm" layout="vertical">
        <a-form-item label="手机号码" required>
          <a-input v-model:value="phoneForm.phone" placeholder="请输入手机号码" />
        </a-form-item>
        <a-form-item label="验证码" required>
          <a-row gutter={16}>
            <a-col span={16}>
              <a-input v-model:value="phoneForm.code" placeholder="请输入验证码" />
            </a-col>
            <a-col span={8}>
              <a-button type="primary" @click="sendSmsCode">发送验证码</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 绑定邮箱对话框 -->
    <a-modal
      v-model:open="showBindEmailDialog"
      title="{{ userInfo.email ? '更换邮箱' : '绑定邮箱' }}"
      @ok="handleBindEmail"
    >
      <a-form :model="emailForm" layout="vertical">
        <a-form-item label="邮箱地址" required>
          <a-input v-model:value="emailForm.email" placeholder="请输入邮箱地址" />
        </a-form-item>
        <a-form-item label="验证码" required>
          <a-row gutter={16}>
            <a-col span={16}>
              <a-input v-model:value="emailForm.code" placeholder="请输入验证码" />
            </a-col>
            <a-col span={8}>
              <a-button type="primary" @click="sendEmailCode">发送验证码</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'

// 用户信息
const userInfo = ref({
  name: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  position: '项目管理员',
  department: '技术部',
  avatar: ''
})

// 对话框状态
const showChangePasswordDialog = ref(false)
const showBindPhoneDialog = ref(false)
const showBindEmailDialog = ref(false)

// 表单数据
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const phoneForm = ref({
  phone: '',
  code: ''
})

const emailForm = ref({
  email: '',
  code: ''
})

// 上传头像
const uploadAvatar = () => {
  // 实现头像上传逻辑
  console.log('上传头像')
}

// 保存个人信息
const saveProfile = () => {
  // 实现保存个人信息逻辑
  console.log('保存个人信息', userInfo.value)
}

// 修改密码
const handleChangePassword = () => {
  // 实现修改密码逻辑
  console.log('修改密码', passwordForm.value)
  showChangePasswordDialog.value = false
}

// 绑定手机
const handleBindPhone = () => {
  // 实现绑定手机逻辑
  console.log('绑定手机', phoneForm.value)
  userInfo.value.phone = phoneForm.value.phone
  showBindPhoneDialog.value = false
}

// 绑定邮箱
const handleBindEmail = () => {
  // 实现绑定邮箱逻辑
  console.log('绑定邮箱', emailForm.value)
  userInfo.value.email = emailForm.value.email
  showBindEmailDialog.value = false
}

// 发送短信验证码
const sendSmsCode = () => {
  // 实现发送短信验证码逻辑
  console.log('发送短信验证码')
}

// 发送邮箱验证码
const sendEmailCode = () => {
  // 实现发送邮箱验证码逻辑
  console.log('发送邮箱验证码')
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
</style>