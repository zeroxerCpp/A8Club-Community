<template>
  <div class="guide-page">
    <el-card class="guide-card">
      <template #header>
        <h1 class="guide-title">👋 欢迎来到管理后台</h1>
      </template>

      <!-- 自定义 Tab 导航 -->
      <div class="custom-tabs">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="custom-tab-item"
          :class="{ 'is-active': activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab }}
        </div>
      </div>

      <!-- Tab 内容区域 -->
      <div class="tab-content">
        <!-- 功能概览 -->
        <div v-show="activeTab === 0" class="guide-content">
          <p>社区展示网站管理系统提供以下核心功能模块：</p>
          
          <el-alert
            title="💡 提示"
            type="info"
            description="点击左侧菜单可快速导航到各个管理模块"
            :closable="false"
            style="margin-bottom: 20px"
          />

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="module in modules" :key="module.id">
              <div class="module-card">
                <div class="module-icon">{{ module.icon }}</div>
                <h3>{{ module.name }}</h3>
                <p>{{ module.description }}</p>
                <router-link :to="module.path" class="module-link">
                  进入模块 →
                </router-link>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 首页统计 -->
        <div v-show="activeTab === 1" class="guide-content">
            <h3>数据统计管理</h3>
            <p>管理社区的核心数据指标：</p>
            <ul>
              <li><strong>社区名称：</strong>设置或更新社区的名称</li>
              <li><strong>成员总数：</strong>记录社区当前的成员数量</li>
              <li><strong>活跃用户：</strong>显示最近活跃的用户数</li>
              <li><strong>项目数量：</strong>统计已发布的项目数</li>
              <li><strong>联系邮箱：</strong>显示在首页的联系邮箱地址</li>
            </ul>
            <el-alert
              title="📝 说明"
              type="success"
              description="这些数据会实时显示在首页的统计区域，用户可通过首页快速了解社区规模"
              :closable="false"
              style="margin-top: 15px"
            />
        </div>

        <!-- 创始团队管理 -->
        <div v-show="activeTab === 2" class="guide-content">
            <h3>团队成员管理</h3>
            <p>管理社区的创始人和核心成员信息：</p>
            
            <el-divider></el-divider>
            
            <div class="feature-box">
              <h4>🎯 排序规则（orderIndex）</h4>
              <ul>
                <li><strong>orderIndex = 0：</strong>该成员为创始人，展示在"创始人"专区</li>
                <li><strong>orderIndex > 0：</strong>社区成员，展示在"社区成员"区域，按 orderIndex 从小到大排序</li>
              </ul>
            </div>

            <el-divider></el-divider>

            <h4>📋 可管理字段</h4>
            <ul>
              <li><strong>姓名：</strong>成员的真实姓名</li>
              <li><strong>职位：</strong>在社区中的角色或职务</li>
              <li><strong>介绍：</strong>成员的简短个人介绍</li>
              <li><strong>头像：</strong>上传成员的头像图片</li>
              <li><strong>LinkedIn/Twitter：</strong>社交媒体链接</li>
              <li><strong>排序 ID：</strong>控制显示顺序（详见"排序规则"）</li>
            </ul>
        </div>

        <!-- 项目经历管理 -->
        <div v-show="activeTab === 3" class="guide-content">
            <h3>项目信息管理</h3>
            <p>展示社区完成或正在进行的项目：</p>

            <el-divider></el-divider>

            <div class="feature-box">
              <h4>📌 置顶功能</h4>
              <p>将 <code>排序 ID = 0</code> 的项目设置为置顶项目，会优先显示在列表顶部</p>
            </div>

            <el-divider></el-divider>

            <h4>📋 可管理字段</h4>
            <ul>
              <li><strong>项目名称：</strong>项目的标题</li>
              <li><strong>描述：</strong>详细的项目说明</li>
              <li><strong>项目图片：</strong>展示在卡片上的封面图片</li>
              <li><strong>开始日期：</strong>项目启动时间</li>
              <li><strong>结束日期：</strong>项目完成时间（进行中的可不填）</li>
              <li><strong>技术栈：</strong>使用的技术和工具（JSON 数组或逗号分隔）</li>
              <li><strong>项目链接：</strong>项目的外链（首页点击会打开此链接）</li>
              <li><strong>排序 ID：</strong>排序 ID = 0 为置顶</li>
            </ul>
        </div>

        <!-- 社区动态管理 -->
        <div v-show="activeTab === 4" class="guide-content">
            <h3>新闻和动态发布</h3>
            <p>发布社区的最新新闻、活动和动态信息：</p>

            <el-divider></el-divider>

            <div class="feature-box">
              <h4>📌 置顶功能</h4>
              <p>将 <code>排序 ID = 0</code> 的动态设置为置顶，会优先显示在列表顶部</p>
            </div>

            <el-divider></el-divider>

            <h4>📋 可管理字段</h4>
            <ul>
              <li><strong>标题：</strong>新闻的标题</li>
              <li><strong>内容：</strong>新闻的完整内容（支持 HTML）</li>
              <li><strong>封面图片：</strong>新闻的缩略图</li>
              <li><strong>发布时间：</strong>新闻的发布日期</li>
              <li><strong>状态：</strong>选择是否发布（未发布的不会显示）</li>
              <li><strong>排序 ID：</strong>排序 ID = 0 为置顶</li>
            </ul>

            <el-alert
              title="💡 提示"
              type="info"
              description="首页会展示最新的 3 条已发布动态，用户点击可查看完整内容"
              :closable="false"
              style="margin-top: 15px"
            />
        </div>

        <!-- 友情链接管理 -->
        <div v-show="activeTab === 5" class="guide-content">
            <h3>友情链接设置</h3>
            <p>管理显示在首页底部的友情链接：</p>

            <el-divider></el-divider>

            <div class="feature-box">
              <h4>📌 置顶功能</h4>
              <p>将 <code>排序 ID = 0</code> 的链接设置为置顶，会优先显示</p>
            </div>

            <el-divider></el-divider>

            <h4>📋 可管理字段</h4>
            <ul>
              <li><strong>链接名称：</strong>在页面上显示的文字</li>
              <li><strong>链接地址：</strong>完整的 URL（包含 http:// 或 https://）</li>
              <li><strong>网站 Logo：</strong>链接的 Logo 图片</li>
              <li><strong>描述：</strong>链接的说明信息</li>
              <li><strong>状态：</strong>选择是否激活该链接</li>
              <li><strong>排序 ID：</strong>排序 ID = 0 为置顶</li>
            </ul>

            <el-alert
              title="💡 提示"
              type="info"
              description="友情链接显示在首页底部的 Footer 区域，可用于推荐合作伙伴或相关网站"
              :closable="false"
              style="margin-top: 15px"
            />
        </div>

        <!-- 常见问题 -->
        <div v-show="activeTab === 6" class="guide-content">
          <div class="custom-collapse">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="custom-collapse-item"
            >
              <div 
                class="custom-collapse-header"
                @click="toggleFaq(index)"
              >
                <span class="collapse-title">{{ faq.question }}</span>
                <span class="collapse-arrow" :class="{ 'is-active': openFaqs.includes(index) }">▼</span>
              </div>
              <div 
                v-show="openFaqs.includes(index)"
                class="custom-collapse-content"
              >
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 设计指南 -->
        <div v-show="activeTab === 7" class="guide-content">
            <h3>建议和最佳实践</h3>

            <el-divider></el-divider>

            <h4>📸 图片建议</h4>
            <ul>
              <li><strong>项目封面：</strong>建议 16:9 比例，尺寸 800x450px 或以上</li>
              <li><strong>新闻封面：</strong>建议 16:9 比例，尺寸 600x400px 或以上</li>
              <li><strong>头像：</strong>建议正方形 1:1 比例，尺寸 200x200px 或以上</li>
              <li><strong>Logo：</strong>建议 1:1 或 2:1 比例，尺寸 200x200px 或以上</li>
            </ul>

            <el-divider></el-divider>

            <h4>📝 文本建议</h4>
            <ul>
              <li><strong>项目描述：</strong>建议 50-150 字，简洁明了</li>
              <li><strong>成员介绍：</strong>建议 50-200 字，突出个人成就和专长</li>
              <li><strong>新闻标题：</strong>建议不超过 50 字</li>
              <li><strong>新闻内容：</strong>建议不超过 5000 字，可分段落提高可读性</li>
            </ul>

            <el-divider></el-divider>

            <h4>🏷️ 标签建议</h4>
            <ul>
              <li>项目技术栈：使用常见的技术名称，如 React, Vue, Python, Java 等</li>
              <li>标签之间建议用逗号分隔或以 JSON 数组格式上传</li>
            </ul>

            <el-divider></el-divider>

            <h4>🔗 链接建议</h4>
            <ul>
              <li>所有 URL 必须包含协议：<code>http://</code> 或 <code>https://</code></li>
              <li>定期检查外部链接是否仍然可用</li>
              <li>建议使用短链接或易记的 URL</li>
            </ul>
        </div>
      </div>

      <el-divider></el-divider>

      <div class="guide-footer">
        <p>📧 如有任何问题或建议，欢迎反馈！</p>
        <p>⌚ 最后更新时间：2026年1月31日</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeTab = ref(0)

const openFaqs = ref<number[]>([])

const toggleFaq = (index: number) => {
  const idx = openFaqs.value.indexOf(index)
  if (idx > -1) {
    openFaqs.value.splice(idx, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const tabs = [
  '📋 功能概览',
  '🏠 首页统计',
  '👥 创始团队管理',
  '💼 项目经历管理',
  '📰 社区动态管理',
  '🔗 友情链接管理',
  '⚙️ 常见问题',
  '🎨 设计指南'
]

const faqs = [
  {
    question: '如何上传图片？',
    answer: '在各管理页面的图片字段，点击上传按钮选择本地图片文件即可。支持的格式：JPG, PNG, GIF 等常见图片格式。建议图片大小不超过 5MB。'
  },
  {
    question: '排序 ID = 0 表示什么？',
    answer: '在项目、新闻和友情链接中，排序 ID = 0 表示该项为"置顶"项目，会优先显示在列表的最上方。其他项目按照排序 ID 从小到大排列。'
  },
  {
    question: '已发布和未发布有什么区别？',
    answer: '已发布的新闻会显示在首页和新闻列表页面供用户查看。未发布的新闻只有管理员可见，不会在前端展示。这样可以提前编写和保存新闻，待准备好后再发布。'
  },
  {
    question: '删除内容后是否可以恢复？',
    answer: '删除是永久操作，目前系统没有恢复功能。删除前请确认内容确实不需要。建议先备份重要数据。'
  },
  {
    question: '如何区分创始人和社区成员？',
    answer: '系统根据 orderIndex 来区分角色：orderIndex = 0 为创始人，orderIndex > 0 为社区成员。只需修改 orderIndex 即可改变成员的角色。'
  },
  {
    question: '首页显示的数据多久更新一次？',
    answer: '首页数据是实时的。修改任何内容后，首页会立即显示最新内容（可能需要刷新页面）。'
  }
]

const modules = ref([
  {
    id: 1,
    name: '首页统计',
    description: '管理社区的数据统计和基本信息',
    icon: '📊',
    path: '/admin/stats'
  },
  {
    id: 2,
    name: '创始团队',
    description: '管理创始人和团队成员信息',
    icon: '👥',
    path: '/admin/founders'
  },
  {
    id: 3,
    name: '项目经历',
    description: '发布和管理社区项目',
    icon: '💼',
    path: '/admin/projects'
  },
  {
    id: 4,
    name: '社区动态',
    description: '发布社区新闻和动态',
    icon: '📰',
    path: '/admin/news'
  },
  {
    id: 5,
    name: '友情链接',
    description: '管理首页底部的链接',
    icon: '🔗',
    path: '/admin/friend-links'
  },
  {
    id: 6,
    name: '仪表板',
    description: '查看整体数据统计',
    icon: '📈',
    path: '/admin/dashboard'
  }
])

onMounted(() => {
  // 检测主题
  const checkTheme = () => {
    // 主题检测逻辑（如果需要）
  }
  
  checkTheme()
})
</script>

<style scoped>
.guide-page {
  padding: 0;
  background: #ffffff;
  color: #333;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.guide-card {
  max-width: 100%;
  margin: 0;
  box-shadow: none;
  background: #ffffff;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 0;
  border: none;
}

.guide-title {
  margin: 0;
  font-size: 28px;
  color: #333;
  transition: color 0.3s ease;
}

.guide-content {
  padding: 10px 20px;
}

.guide-content h3 {
  color: #333;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.guide-content h4 {
  color: #666;
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.guide-content p,
.guide-content ul {
  color: #666;
  line-height: 1.8;
  margin: 10px 0;
  transition: color 0.3s ease;
}

.guide-content li {
  margin: 8px 0;
  color: #666;
  transition: color 0.3s ease;
}

.module-card {
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.module-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.module-card h3 {
  color: #333;
  transition: color 0.3s ease;
}

.module-card p {
  color: #909399;
  transition: color 0.3s ease;
}

.module-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.module-link {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.module-link:hover {
  color: #66b1ff;
}

.feature-box {
  background: #f0f9ff;
  border-left: 4px solid #409eff;
  padding: 15px 20px;
  border-radius: 2px;
  margin: 15px 0;
  transition: all 0.3s ease;
}

.feature-box h4 {
  color: #409eff;
  margin-top: 0;
  transition: color 0.3s ease;
}

.guide-footer {
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 20px 0;
  transition: color 0.3s ease;
}

.guide-footer p {
  margin: 5px 0;
}

/* 自定义 Tab 样式 */
.custom-tabs {
  display: flex;
  border-bottom: 2px solid #e4e7ed;
  margin-bottom: 20px;
  overflow-x: auto;
}

.custom-tab-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.custom-tab-item:hover {
  color: #409eff;
}

.custom-tab-item.is-active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
}

.tab-content {
  min-height: 400px;
}

/* 自定义折叠面板样式 */
.custom-collapse {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.custom-collapse-item {
  border-bottom: 1px solid #e4e7ed;
}

.custom-collapse-item:last-child {
  border-bottom: none;
}

.custom-collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-collapse-header:hover {
  background: #f5f7fa;
}

.collapse-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.collapse-arrow {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s;
}

.collapse-arrow.is-active {
  transform: rotate(180deg);
}

.custom-collapse-content {
  padding: 16px 20px;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  color: #606266;
  line-height: 1.8;
}

.custom-collapse-content p {
  margin: 0;
}

/* Dark mode - 使用 body.dark-mode 选择器 */
body.dark-mode .guide-page {
  background: #0f1629 !important;
  color: #e5e7eb !important;
}

body.dark-mode .guide-card {
  background: #0f1629 !important;
  color: #e5e7eb !important;
  border-color: transparent !important;
}

body.dark-mode .guide-title {
  color: #ffffff !important;
}

body.dark-mode .guide-content {
  color: #d1d5db !important;
}

body.dark-mode .guide-content h3 {
  color: #f3f4f6 !important;
}

body.dark-mode .guide-content h4 {
  color: #e5e7eb !important;
}

body.dark-mode .guide-content p {
  color: #d1d5db !important;
}

body.dark-mode .guide-content ul {
  color: #d1d5db !important;
}

body.dark-mode .guide-content li {
  color: #d1d5db !important;
}

body.dark-mode .guide-content strong {
  color: #f3f4f6 !important;
}

body.dark-mode .guide-content code {
  background: #1f2937 !important;
  color: #60a5fa !important;
  padding: 2px 6px;
  border-radius: 3px;
}

body.dark-mode .module-card {
  background: #1f2937 !important;
  border-color: #374151 !important;
  color: #e5e7eb !important;
}

body.dark-mode .module-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45) !important;
}

body.dark-mode .module-card h3 {
  color: #ffffff !important;
}

body.dark-mode .module-card p {
  color: #d1d5db !important;
}

body.dark-mode .module-link {
  color: #60a5fa !important;
}

body.dark-mode .feature-box {
  background: #1e3a5f !important;
  border-left-color: #60a5fa !important;
  color: #e5e7eb !important;
}

body.dark-mode .feature-box h4 {
  color: #60a5fa !important;
}

body.dark-mode .feature-box p,
body.dark-mode .feature-box li {
  color: #e5e7eb !important;
}

body.dark-mode .guide-footer {
  color: #d1d5db !important;
}

/* 自定义 Tab 暗夜模式 */
body.dark-mode .custom-tabs {
  border-bottom-color: #374151;
}

body.dark-mode .custom-tab-item {
  color: #f3f4f6;
}

body.dark-mode .custom-tab-item:hover {
  color: #60a5fa;
}

body.dark-mode .custom-tab-item.is-active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
}

/* 自定义折叠面板暗夜模式 */
body.dark-mode .custom-collapse {
  border-color: #374151;
}

body.dark-mode .custom-collapse-item {
  border-bottom-color: #374151;
}

body.dark-mode .custom-collapse-header {
  background: #1f2937;
}

body.dark-mode .custom-collapse-header:hover {
  background: #2d3748;
}

body.dark-mode .collapse-title {
  color: #f3f4f6;
}

body.dark-mode .collapse-arrow {
  color: #f3f4f6;
}

body.dark-mode .custom-collapse-content {
  background: #1f2937;
  border-top-color: #374151;
  color: #e5e7eb;
}

/* Element Plus 组件暗夜模式 */
body.dark-mode :deep(.el-card) {
  background-color: #0f1629 !important;
  border-color: transparent !important;
}

body.dark-mode :deep(.el-divider) {
  border-color: #374151 !important;
  background-color: #374151 !important;
}

body.dark-mode :deep(.el-alert) {
  background-color: rgba(96, 165, 250, 0.15) !important;
  border-color: #3b82f6 !important;
}

body.dark-mode :deep(.el-alert__title) {
  color: #60a5fa !important;
}

body.dark-mode :deep(.el-alert__description) {
  color: #d1d5db !important;
}

body.dark-mode :deep(.el-alert.el-alert--info) {
  background-color: rgba(96, 165, 250, 0.15) !important;
}

body.dark-mode :deep(.el-alert.el-alert--success) {
  background-color: rgba(34, 197, 94, 0.15) !important;
  border-color: #22c55e !important;
}

body.dark-mode :deep(.el-alert.el-alert--success .el-alert__title) {
  color: #4ade80 !important;
}
</style>
