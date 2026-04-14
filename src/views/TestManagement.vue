<template>
  <div class="test-management-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary">测试管理</h1>
          <p class="text-muted">管理测试用例、测试计划和测试执行。</p>
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
                    <button type="button" class="btn btn-primary">
                      <i class="fas fa-plus"></i> 新建测试用例
                    </button>
                    <button type="button" class="btn btn-outline-secondary">
                      <i class="fas fa-upload"></i> 导入
                    </button>
                    <button type="button" class="btn btn-outline-secondary">
                      <i class="fas fa-ellipsis-v"></i> 更多
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="搜索测试用例...">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button">
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
      
      <!-- 测试统计 -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    测试用例数
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalTestCases }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-file-alt fa-2x text-gray-300"></i>
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
                    通过测试
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ passedTests }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-check-circle fa-2x text-gray-300"></i>
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
                    失败测试
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ failedTests }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-times-circle fa-2x text-gray-300"></i>
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
                    未执行测试
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ pendingTests }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 测试用例列表 -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">测试用例列表</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>用例名称</th>
                      <th>所属模块</th>
                      <th>优先级</th>
                      <th>状态</th>
                      <th>创建人</th>
                      <th>创建时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="testCase in testCases" :key="testCase.id">
                      <td>{{ testCase.name }}</td>
                      <td>{{ testCase.module }}</td>
                      <td>
                        <span class="badge" :class="getTestCasePriorityClass(testCase.priority)">
                          {{ testCase.priority }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" :class="getTestCaseStatusClass(testCase.status)">
                          {{ testCase.status }}
                        </span>
                      </td>
                      <td>{{ testCase.creator }}</td>
                      <td>{{ testCase.createdAt }}</td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary mr-2">
                          查看
                        </a>
                        <a href="#" class="btn btn-sm btn-outline-secondary mr-2">
                          编辑
                        </a>
                        <a href="#" class="btn btn-sm btn-outline-danger">
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
      
      <!-- 测试计划 -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">测试计划</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                  <thead>
                    <tr>
                      <th>计划名称</th>
                      <th>测试范围</th>
                      <th>开始时间</th>
                      <th>结束时间</th>
                      <th>状态</th>
                      <th>负责人</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="testPlan in testPlans" :key="testPlan.id">
                      <td>{{ testPlan.name }}</td>
                      <td>{{ testPlan.scope }}</td>
                      <td>{{ testPlan.startDate }}</td>
                      <td>{{ testPlan.endDate }}</td>
                      <td>
                        <span class="badge" :class="getTestPlanStatusClass(testPlan.status)">
                          {{ testPlan.status }}
                        </span>
                      </td>
                      <td>{{ testPlan.owner }}</td>
                      <td>
                        <a href="#" class="btn btn-sm btn-primary">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 统计数据
const totalTestCases = ref(120)
const passedTests = ref(85)
const failedTests = ref(15)
const pendingTests = ref(20)

// 测试用例数据
const testCases = ref([
  {
    id: '1',
    name: '任务看板拖拽功能测试',
    module: '项目管理系统',
    priority: '高',
    status: '通过',
    creator: '成员 2',
    createdAt: '2026-04-10'
  },
  {
    id: '2',
    name: '实时同步功能测试',
    module: '项目管理系统',
    priority: '高',
    status: '通过',
    creator: '成员 2',
    createdAt: '2026-04-09'
  },
  {
    id: '3',
    name: '用户登录测试',
    module: '认证系统',
    priority: '中',
    status: '失败',
    creator: '成员 2',
    createdAt: '2026-04-08'
  },
  {
    id: '4',
    name: '权限控制测试',
    module: '认证系统',
    priority: '高',
    status: '未执行',
    creator: '成员 2',
    createdAt: '2026-04-07'
  }
])

// 测试计划数据
const testPlans = ref([
  {
    id: '1',
    name: '项目管理系统 v1.0 测试',
    scope: '全部功能',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    status: '进行中',
    owner: '成员 2'
  },
  {
    id: '2',
    name: '产品设计工具 v1.0 测试',
    scope: '核心功能',
    startDate: '2026-04-15',
    endDate: '2026-04-25',
    status: '计划中',
    owner: '成员 2'
  },
  {
    id: '3',
    name: '认证系统 v1.0 测试',
    scope: '全部功能',
    startDate: '2026-04-05',
    endDate: '2026-04-15',
    status: '已完成',
    owner: '成员 2'
  }
])

// 获取测试用例优先级的样式类
const getTestCasePriorityClass = (priority: string) => {
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

// 获取测试用例状态的样式类
const getTestCaseStatusClass = (status: string) => {
  switch (status) {
    case '通过':
      return 'badge-success'
    case '失败':
      return 'badge-danger'
    case '未执行':
      return 'badge-secondary'
    default:
      return 'badge-secondary'
  }
}

// 获取测试计划状态的样式类
const getTestPlanStatusClass = (status: string) => {
  switch (status) {
    case '进行中':
      return 'badge-warning'
    case '计划中':
      return 'badge-info'
    case '已完成':
      return 'badge-success'
    default:
      return 'badge-secondary'
  }
}
</script>

<style scoped>
.test-management-container {
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