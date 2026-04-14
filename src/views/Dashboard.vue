<template>
  <div class="dashboard-container">
    <h1>仪表盘</h1>
    <div class="dashboard-cards">
      <a-card class="dashboard-card">
        <a-card-head>
          <a-card-title>任务统计</a-card-title>
        </a-card-head>
        <a-card-body>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ totalTasks }}</div>
              <div class="stat-label">总任务数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ todoTasksCount }}</div>
              <div class="stat-label">待处理</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ inProgressTasksCount }}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ doneTasksCount }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </a-card-body>
      </a-card>
      <a-card class="dashboard-card">
        <a-card-head>
          <a-card-title>项目进度</a-card-title>
        </a-card-head>
        <a-card-body>
          <div id="progressChart" style="width: 100%; height: 300px;"></div>
        </a-card-body>
      </a-card>
    </div>
    <div class="dashboard-cards">
      <a-card class="dashboard-card">
        <a-card-head>
          <a-card-title>任务优先级分布</a-card-title>
        </a-card-head>
        <a-card-body>
          <div id="priorityChart" style="width: 100%; height: 300px;"></div>
        </a-card-body>
      </a-card>
      <a-card class="dashboard-card">
        <a-card-head>
          <a-card-title>成员工作量</a-card-title>
        </a-card-head>
        <a-card-body>
          <div id="workloadChart" style="width: 100%; height: 300px;"></div>
        </a-card-body>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '../stores/project'
import * as echarts from 'echarts'

const projectStore = useProjectStore()

// 计算任务统计数据
const totalTasks = computed(() => projectStore.tasks.length)
const todoTasksCount = computed(() => projectStore.todoTasks.length)
const inProgressTasksCount = computed(() => projectStore.inProgressTasks.length)
const doneTasksCount = computed(() => projectStore.doneTasks.length)

// 初始化图表
onMounted(() => {
  // 进度图表
  const progressChart = echarts.init(document.getElementById('progressChart'))
  const progressOption = {
    title: {
      text: '任务完成进度',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: todoTasksCount.value, name: '待处理' },
          { value: inProgressTasksCount.value, name: '进行中' },
          { value: doneTasksCount.value, name: '已完成' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  progressChart.setOption(progressOption)

  // 优先级图表
  const priorityChart = echarts.init(document.getElementById('priorityChart'))
  const priorityData = {
    high: projectStore.tasks.filter(task => task.priority === 'high').length,
    medium: projectStore.tasks.filter(task => task.priority === 'medium').length,
    low: projectStore.tasks.filter(task => task.priority === 'low').length
  }
  const priorityOption = {
    title: {
      text: '任务优先级分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['高', '中', '低']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [priorityData.high, priorityData.medium, priorityData.low],
        type: 'bar',
        itemStyle: {
          color: function(params: any) {
            const colors = ['#f5222d', '#faad14', '#52c41a']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }
  priorityChart.setOption(priorityOption)

  // 工作量图表
  const workloadChart = echarts.init(document.getElementById('workloadChart'))
  const workloadData = {
    '1': projectStore.tasks.filter(task => task.assignee === '1').length,
    '2': projectStore.tasks.filter(task => task.assignee === '2').length,
    '3': projectStore.tasks.filter(task => task.assignee === '3').length
  }
  const workloadOption = {
    title: {
      text: '成员工作量',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['管理员', '成员 1', '成员 2']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [workloadData['1'], workloadData['2'], workloadData['3']],
        type: 'bar',
        itemStyle: {
          color: '#1890ff'
        }
      }
    ]
  }
  workloadChart.setOption(workloadOption)

  // 响应式调整
  window.addEventListener('resize', () => {
    progressChart.resize()
    priorityChart.resize()
    workloadChart.resize()
  })
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.dashboard-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
  font-family: 'Arial', sans-serif;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

#progressChart,
#priorityChart,
#workloadChart {
  border-radius: 8px;
  overflow: hidden;
}
</style>