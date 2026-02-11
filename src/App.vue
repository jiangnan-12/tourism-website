<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

// 用户登录状态
const isLoggedIn = ref(false)
const userInfo = ref(null)
const isScrolled = ref(false)
const isLoading = ref(true)

// 检查用户登录状态
const checkLoginStatus = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser) {
    isLoggedIn.value = true
    userInfo.value = currentUser
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('currentUser')
  isLoggedIn.value = false
  userInfo.value = null
}

// 处理滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 模拟页面加载完成
const simulatePageLoad = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

// 页面加载时执行
onMounted(() => {
  checkLoginStatus()
  window.addEventListener('scroll', handleScroll)
  simulatePageLoad()
})

// 页面卸载时执行
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app-container">
    <!-- 页面加载动画 -->
    <div class="page-loader" v-if="isLoading">
      <div class="loader-content">
        <div class="loader-icon">🚀</div>
        <div class="loader-text">即刻出发·旅游网</div>
        <div class="loader-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>

    <!-- 导航栏 -->
    <header class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="navbar-container">
        <div class="navbar-brand">
          <RouterLink to="/" class="brand-link">
            <span class="brand-icon">🚀</span>
            <span class="brand-name">即刻出发·旅游网</span>
          </RouterLink>
        </div>
        <nav class="navbar-nav">
          <RouterLink to="/" class="nav-link" active-class="active">首页</RouterLink>
          <RouterLink to="/attractions" class="nav-link" active-class="active">旅游景点</RouterLink>
          <RouterLink to="/planning" class="nav-link" active-class="active">旅游路线</RouterLink>
          <RouterLink to="/hotels" class="nav-link" active-class="active">酒店信息</RouterLink>
          <RouterLink to="/about" class="nav-link" active-class="active">关于我们</RouterLink>
        </nav>
        <div class="navbar-actions">
          <RouterLink v-if="!isLoggedIn" to="/auth" class="auth-link">登录</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/auth" class="register-link">注册</RouterLink>
          <div v-else class="user-dropdown">
            <span class="user-avatar">👤</span>
            <span class="user-name">{{ userInfo?.username }}</span>
            <div class="dropdown-menu">
              <RouterLink to="/profile" class="dropdown-item">个人中心</RouterLink>
              <button class="dropdown-item logout-btn" @click="logout">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 - 添加路由过渡效果 -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-info">
          <p>旅游网站 © 2024 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 应用容器 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}

/* 导航栏样式 */
.navbar {
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 60px;
}

.navbar.scrolled .navbar-container {
  height: 60px;
}

.navbar.scrolled .brand-icon {
  font-size: 1.5rem;
}

.navbar.scrolled .brand-name {
  font-size: 1.3rem;
}

.navbar.scrolled .nav-link {
  padding: 8px 12px;
  font-size: 1rem;
}

.navbar.scrolled .auth-link,
.navbar.scrolled .register-link {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.navbar-container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  box-sizing: border-box;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2e8b57;
}

.brand-icon {
  font-size: 1.8rem;
  margin-right: 10px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  font-size: 1.05rem;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.nav-link:hover {
  color: #2e8b57;
  background-color: rgba(46, 139, 87, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 139, 87, 0.15);
}

/* 添加下划线动画 */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #2e8b57;
  border-radius: 3px;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 80%;
}

.nav-link.active {
  color: #2e8b57;
  font-weight: bold;
  background-color: rgba(46, 139, 87, 0.15);
  box-shadow: 0 4px 12px rgba(46, 139, 87, 0.2);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 80%;
  height: 3px;
  background-color: #2e8b57;
  border-radius: 3px;
  transform: translateX(-50%);
}

.navbar-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.auth-link {
  color: #333;
  text-decoration: none;
  padding: 8px 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.auth-link:hover {
  color: #2e8b57;
  background-color: rgba(46, 139, 87, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 139, 87, 0.15);
}

.register-link {
  color: white;
  text-decoration: none;
  padding: 8px 20px;
  font-weight: 500;
  border-radius: 8px;
  background-color: #2e8b57;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(46, 139, 87, 0.2);
}

.register-link:hover {
  background-color: #4682b4;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(70, 130, 180, 0.3);
}

/* 用户下拉菜单 */
.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.user-dropdown:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  font-size: 1.5rem;
}

.user-name {
  font-weight: 500;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 10px 0;
  min-width: 150px;
  z-index: 101;
  margin-top: 8px;
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  visibility: hidden;
  transition: all 0.3s ease;
}

/* 当用户下拉菜单被悬停时显示 */
.user-dropdown:hover .dropdown-menu {
  opacity: 1;
  transform: translateY(0) scale(1);
  visibility: visible;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(46, 139, 87, 0.1);
  color: #2e8b57;
}

.logout-btn {
  color: #f44336;
}

.logout-btn:hover {
  background-color: #ffebee;
}

/* 主要内容样式 */
.main-content {
  flex: 1;
  padding: 20px;
}

/* 页面加载动画样式 */
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.loader-content {
  text-align: center;
  animation: fadeIn 1s ease;
}

.loader-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s ease infinite;
  filter: drop-shadow(0 4px 8px rgba(46, 139, 87, 0.3));
}

.loader-text {
  font-size: 2rem;
  font-weight: bold;
  color: #2e8b57;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: slideUp 1.5s ease;
}

.loader-progress {
  width: 200px;
  height: 8px;
  background-color: rgba(46, 139, 87, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #2e8b57, #4682b4, #2e8b57);
  border-radius: 4px;
  animation: progress 1.5s ease forwards;
  background-size: 200% 100%;
  animation: progress 1.5s ease forwards, gradient-shift 3s ease infinite;
}

/* 路由过渡效果 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.page-transition-enter-active .animate-on-scroll,
.page-transition-leave-active .animate-on-scroll {
  transition: none;
}

/* 页脚样式 */
.footer {
  background-color: #4682b4;
  color: white;
  padding: 20px 0;
  margin-top: auto;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer:hover {
  background-color: #5a9bd5;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.footer-container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  box-sizing: border-box;
}

.footer-info p {
  margin: 5px 0;
  transition: all 0.3s ease;
}

.footer-info p:hover {
  transform: scale(1.05);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 加载动画关键帧 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes progress {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }

  .navbar-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .brand-icon {
    font-size: 1.5rem;
  }

  .brand-name {
    font-size: 1.2rem;
  }
}
</style>
