<template>
  <div class="knowledge-base-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary">知识库管理</h1>
          <p class="text-muted">管理文档、知识库和团队知识资产。</p>
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
                    <button type="button" class="btn btn-primary" @click="createDocument">
                      <i class="fas fa-plus"></i> 新建文档
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="createFolder">
                      <i class="fas fa-folder-plus"></i> 新建文件夹
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="importDocuments">
                      <i class="fas fa-upload"></i> 导入
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="搜索文档..." v-model="searchQuery">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" @click="searchDocuments">
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
      
      <!-- 文件夹和文档 -->
      <div class="row">
        <div class="col-md-3">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">文件夹</h6>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item active" @click="selectFolder('所有文档')">
                  <i class="fas fa-folder mr-2"></i> 所有文档
                </li>
                <li class="list-group-item" @click="selectFolder('产品文档')">
                  <i class="fas fa-folder mr-2"></i> 产品文档
                </li>
                <li class="list-group-item" @click="selectFolder('技术文档')">
                  <i class="fas fa-folder mr-2"></i> 技术文档
                </li>
                <li class="list-group-item" @click="selectFolder('测试文档')">
                  <i class="fas fa-folder mr-2"></i> 测试文档
                </li>
                <li class="list-group-item" @click="selectFolder('项目文档')">
                  <i class="fas fa-folder mr-2"></i> 项目文档
                </li>
                <li class="list-group-item" @click="selectFolder('团队规范')">
                  <i class="fas fa-folder mr-2"></i> 团队规范
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">文档列表</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-4 col-md-6 mb-4" v-for="document in documents" :key="document.id">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title">{{ document.title }}</h5>
                        <span class="badge" :class="getDocumentTypeClass(document.type)">
                          {{ document.type }}
                        </span>
                      </div>
                      <p class="card-text text-muted">{{ document.description }}</p>
                      <div class="d-flex justify-content-between align-items-center mt-4">
                        <small class="text-muted">{{ document.updatedAt }}</small>
                        <div>
                          <a href="#" class="btn btn-sm btn-primary mr-2" @click="viewDocument(document.id)">
                            查看
                          </a>
                          <a href="#" class="btn btn-sm btn-outline-secondary" @click="editDocument(document.id)">
                            编辑
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 最近更新 -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">最近更新</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>文档名称</th>
                      <th>类型</th>
                      <th>更新人</th>
                      <th>更新时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="document in recentDocuments" :key="document.id">
                      <td>{{ document.title }}</td>
                      <td>
                        <span class="badge" :class="getDocumentTypeClass(document.type)">
                          {{ document.type }}
                        </span>
                      </td>
                      <td>{{ document.updatedBy }}</td>
                      <td>{{ document.updatedAt }}</td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary" @click="viewDocument(document.id)">
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
      
      <!-- 新建文档对话框 -->
      <div class="modal" :class="{ 'show': showCreateDialog }" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">新建文档</h5>
              <button type="button" class="close" @click="showCreateDialog = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="documentTitle">文档标题</label>
                  <input type="text" class="form-control" id="documentTitle" v-model="newDocument.title" placeholder="请输入文档标题">
                </div>
                <div class="form-group">
                  <label for="documentType">文档类型</label>
                  <select class="form-control" id="documentType" v-model="newDocument.type">
                    <option value="技术文档">技术文档</option>
                    <option value="产品文档">产品文档</option>
                    <option value="测试文档">测试文档</option>
                    <option value="用户文档">用户文档</option>
                    <option value="团队规范">团队规范</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="documentDescription">文档描述</label>
                  <textarea class="form-control" id="documentDescription" v-model="newDocument.description" placeholder="请输入文档描述" rows="3"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateDialog = false">取消</button>
              <button type="button" class="btn btn-primary" @click="saveDocument">保存</button>
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
const newDocument = ref({
  title: '',
  type: '技术文档',
  description: ''
})

// 文档数据
const documents = ref([
  {
    id: '1',
    title: '项目管理系统架构设计',
    type: '技术文档',
    description: '详细描述项目管理系统的架构设计和技术选型',
    updatedAt: '2026-04-13'
  },
  {
    id: '2',
    title: '产品需求文档',
    type: '产品文档',
    description: '项目管理系统的产品需求规格说明',
    updatedAt: '2026-04-12'
  },
  {
    id: '3',
    title: '测试用例集',
    type: '测试文档',
    description: '项目管理系统的测试用例集合',
    updatedAt: '2026-04-11'
  },
  {
    id: '4',
    title: '用户使用手册',
    type: '用户文档',
    description: '项目管理系统的用户使用指南',
    updatedAt: '2026-04-10'
  },
  {
    id: '5',
    title: '开发规范',
    type: '团队规范',
    description: '前端开发的代码规范和最佳实践',
    updatedAt: '2026-04-09'
  },
  {
    id: '6',
    title: 'API 文档',
    type: '技术文档',
    description: '项目管理系统的 API 接口文档',
    updatedAt: '2026-04-08'
  }
])

// 最近更新的文档
const recentDocuments = ref([
  {
    id: '1',
    title: '项目管理系统架构设计',
    type: '技术文档',
    updatedBy: '管理员',
    updatedAt: '2026-04-13 10:30'
  },
  {
    id: '2',
    title: '产品需求文档',
    type: '产品文档',
    updatedBy: '成员 1',
    updatedAt: '2026-04-12 14:20'
  },
  {
    id: '3',
    title: '测试用例集',
    type: '测试文档',
    updatedBy: '成员 2',
    updatedAt: '2026-04-11 09:15'
  },
  {
    id: '4',
    title: '用户使用手册',
    type: '用户文档',
    updatedBy: '管理员',
    updatedAt: '2026-04-10 16:45'
  }
])

// 新建文档
const createDocument = () => {
  showCreateDialog.value = true
}

// 新建文件夹
const createFolder = () => {
  console.log('新建文件夹')
  // 实现新建文件夹功能
}

// 导入文档
const importDocuments = () => {
  console.log('导入文档')
  // 实现导入文档功能
}

// 搜索文档
const searchDocuments = () => {
  console.log('搜索文档:', searchQuery.value)
  // 实现搜索文档功能
}

// 选择文件夹
const selectFolder = (folderName: string) => {
  console.log('选择文件夹:', folderName)
  // 实现选择文件夹功能
}

// 查看文档
const viewDocument = (documentId: string) => {
  console.log('查看文档:', documentId)
  // 实现查看文档功能
}

// 编辑文档
const editDocument = (documentId: string) => {
  console.log('编辑文档:', documentId)
  // 实现编辑文档功能
}

// 保存文档
const saveDocument = () => {
  if (newDocument.value.title) {
    console.log('保存文档:', newDocument.value)
    // 实现保存文档功能
    showCreateDialog.value = false
    // 重置表单
    newDocument.value = {
      title: '',
      type: '技术文档',
      description: ''
    }
  } else {
    alert('请输入文档标题')
  }
}

// 获取文档类型的样式类
const getDocumentTypeClass = (type: string) => {
  switch (type) {
    case '技术文档':
      return 'badge-primary'
    case '产品文档':
      return 'badge-success'
    case '测试文档':
      return 'badge-warning'
    case '用户文档':
      return 'badge-info'
    case '团队规范':
      return 'badge-secondary'
    default:
      return 'badge-secondary'
  }
}
</script>

<style scoped>
.knowledge-base-container {
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
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.card-text {
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>