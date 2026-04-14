<template>
  <div class="product-management-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary">产品管理</h1>
          <p class="text-muted">管理产品需求、迭代计划和发布版本。</p>
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
                    <button type="button" class="btn btn-primary" @click="createProduct">
                      <i class="fas fa-plus"></i> 新建产品
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="importProducts">
                      <i class="fas fa-upload"></i> 导入
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="showMoreOptions">
                      <i class="fas fa-ellipsis-v"></i> 更多
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="搜索产品..." v-model="searchQuery">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" @click="searchProducts">
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
      
      <!-- 产品列表 -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">产品列表</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>产品名称</th>
                      <th>负责人</th>
                      <th>状态</th>
                      <th>创建时间</th>
                      <th>最近更新</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in products" :key="product.id">
                      <td>{{ product.name }}</td>
                      <td>{{ product.owner }}</td>
                      <td>
                        <span class="badge" :class="getProductStatusClass(product.status)">
                          {{ product.status }}
                        </span>
                      </td>
                      <td>{{ product.createdAt }}</td>
                      <td>{{ product.updatedAt }}</td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary mr-2" @click="viewProduct(product.id)">
                          查看
                        </a>
                        <a href="#" class="btn btn-sm btn-outline-secondary mr-2" @click="editProduct(product.id)">
                          编辑
                        </a>
                        <a href="#" class="btn btn-sm btn-outline-danger" @click="deleteProduct(product.id)">
                          删除
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
      
      <!-- 产品需求 -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">产品需求</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>需求标题</th>
                      <th>产品</th>
                      <th>优先级</th>
                      <th>状态</th>
                      <th>创建人</th>
                      <th>创建时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="requirement in requirements" :key="requirement.id">
                      <td>{{ requirement.title }}</td>
                      <td>{{ requirement.product }}</td>
                      <td>
                        <span class="badge" :class="getRequirementPriorityClass(requirement.priority)">
                          {{ requirement.priority }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" :class="getRequirementStatusClass(requirement.status)">
                          {{ requirement.status }}
                        </span>
                      </td>
                      <td>{{ requirement.creator }}</td>
                      <td>{{ requirement.createdAt }}</td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary" @click="viewRequirement(requirement.id)">
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
      
      <!-- 新建产品对话框 -->
      <div class="modal" :class="{ 'show': showCreateDialog }" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">新建产品</h5>
              <button type="button" class="close" @click="showCreateDialog = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="productName">产品名称</label>
                  <input type="text" class="form-control" id="productName" v-model="newProduct.name" placeholder="请输入产品名称">
                </div>
                <div class="form-group">
                  <label for="productOwner">负责人</label>
                  <input type="text" class="form-control" id="productOwner" v-model="newProduct.owner" placeholder="请输入负责人">
                </div>
                <div class="form-group">
                  <label for="productStatus">状态</label>
                  <select class="form-control" id="productStatus" v-model="newProduct.status">
                    <option value="活跃">活跃</option>
                    <option value="规划中">规划中</option>
                    <option value="已归档">已归档</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateDialog = false">取消</button>
              <button type="button" class="btn btn-primary" @click="saveProduct">保存</button>
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
const newProduct = ref({
  name: '',
  owner: '',
  status: '活跃'
})

// 产品数据
const products = ref([
  {
    id: '1',
    name: '项目管理系统',
    owner: '管理员',
    status: '活跃',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-13'
  },
  {
    id: '2',
    name: '产品设计工具',
    owner: '成员 1',
    status: '活跃',
    createdAt: '2026-03-20',
    updatedAt: '2026-04-12'
  },
  {
    id: '3',
    name: '测试管理平台',
    owner: '成员 2',
    status: '规划中',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10'
  },
  {
    id: '4',
    name: '知识库系统',
    owner: '管理员',
    status: '活跃',
    createdAt: '2026-03-15',
    updatedAt: '2026-04-11'
  }
])

// 需求数据
const requirements = ref([
  {
    id: '1',
    title: '任务看板拖拽功能',
    product: '项目管理系统',
    priority: '高',
    status: '已批准',
    creator: '管理员',
    createdAt: '2026-04-10'
  },
  {
    id: '2',
    title: '实时同步功能',
    product: '项目管理系统',
    priority: '高',
    status: '已批准',
    creator: '成员 1',
    createdAt: '2026-04-09'
  },
  {
    id: '3',
    title: '产品需求模板',
    product: '产品设计工具',
    priority: '中',
    status: '待审核',
    creator: '成员 1',
    createdAt: '2026-04-08'
  },
  {
    id: '4',
    title: '测试用例管理',
    product: '测试管理平台',
    priority: '高',
    status: '待审核',
    creator: '成员 2',
    createdAt: '2026-04-07'
  }
])

// 新建产品
const createProduct = () => {
  showCreateDialog.value = true
}

// 导入产品
const importProducts = () => {
  console.log('导入产品')
  // 实现导入功能
}

// 显示更多选项
const showMoreOptions = () => {
  console.log('显示更多选项')
  // 实现更多选项功能
}

// 搜索产品
const searchProducts = () => {
  console.log('搜索产品:', searchQuery.value)
  // 实现搜索功能
}

// 查看产品
const viewProduct = (productId: string) => {
  console.log('查看产品:', productId)
  // 实现查看产品功能
}

// 编辑产品
const editProduct = (productId: string) => {
  console.log('编辑产品:', productId)
  // 实现编辑产品功能
}

// 删除产品
const deleteProduct = (productId: string) => {
  if (confirm('确定要删除该产品吗？')) {
    console.log('删除产品:', productId)
    // 实现删除产品功能
  }
}

// 查看需求
const viewRequirement = (requirementId: string) => {
  console.log('查看需求:', requirementId)
  // 实现查看需求功能
}

// 保存产品
const saveProduct = () => {
  if (newProduct.value.name) {
    console.log('保存产品:', newProduct.value)
    // 实现保存产品功能
    showCreateDialog.value = false
    // 重置表单
    newProduct.value = {
      name: '',
      owner: '',
      status: '活跃'
    }
  } else {
    alert('请输入产品名称')
  }
}

// 获取产品状态的样式类
const getProductStatusClass = (status: string) => {
  switch (status) {
    case '活跃':
      return 'badge-success'
    case '规划中':
      return 'badge-info'
    case '已归档':
      return 'badge-secondary'
    default:
      return 'badge-secondary'
  }
}

// 获取需求优先级的样式类
const getRequirementPriorityClass = (priority: string) => {
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

// 获取需求状态的样式类
const getRequirementStatusClass = (status: string) => {
  switch (status) {
    case '已批准':
      return 'badge-success'
    case '待审核':
      return 'badge-warning'
    case '已拒绝':
      return 'badge-danger'
    default:
      return 'badge-secondary'
  }
}
</script>

<style scoped>
.product-management-container {
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
</style>