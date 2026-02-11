import { ref, onMounted } from 'vue'

// 用户认证状态管理
export function useAuth() {
  const currentUser = ref(null)
  const isAuthenticated = ref(false)

  // 登录用户
  const login = (userData) => {
    currentUser.value = userData
    isAuthenticated.value = true
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  // 退出登录
  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
  }

  // 检查登录状态
  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (user) {
      currentUser.value = user
      isAuthenticated.value = true
    }
  }

  // 页面加载时检查登录状态
  onMounted(() => {
    checkAuth()
  })

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
