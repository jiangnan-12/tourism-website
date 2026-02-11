<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 切换登录/注册表单
const activeTab = ref('login')

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  role: 'user' // 'user' 或 'admin'
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  role: 'user' // 'user' 或 'admin'
})

// 错误信息
const loginError = ref('')
const registerError = ref('')

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
  loginError.value = ''
  registerError.value = ''
}

// 检查用户是否已存在
const isUserExists = (username) => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  return users.some(user => user.username === username)
}

// 注册用户
const registerUser = () => {
  // 表单验证
  if (registerForm.password !== registerForm.confirmPassword) {
    registerError.value = '两次输入的密码不一致'
    return
  }

  if (registerForm.password.length < 6) {
    registerError.value = '密码长度不能少于6位'
    return
  }

  if (isUserExists(registerForm.username)) {
    registerError.value = '用户名已存在'
    return
  }

  // 创建新用户
  const newUser = {
    id: Date.now(),
    username: registerForm.username,
    password: registerForm.password,
    email: registerForm.email,
    role: registerForm.role,
    createdAt: new Date().toISOString()
  }

  // 保存到本地存储
  const users = JSON.parse(localStorage.getItem('users')) || []
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))

  // 注册成功后自动登录
  loginForm.username = registerForm.username
  loginForm.password = registerForm.password
  loginForm.role = registerForm.role
  loginUser()
}

// 登录用户
const loginUser = () => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const user = users.find(user => user.username === loginForm.username && user.password === loginForm.password)

  if (user) {
    // 保存登录状态
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }))

    // 登录成功后跳转到首页
    router.push('/')
  } else {
    loginError.value = '用户名或密码错误'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-background">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="auth-card">
      <!-- 标签切换 -->
      <div class="auth-tabs">
        <button class="tab-btn" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">
          <span>登录</span>
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">
          <span>注册</span>
        </button>
      </div>

      <!-- 登录表单 -->
      <div v-if="activeTab === 'login'" class="auth-form">
        <h2 class="form-title">欢迎登录</h2>
        <p class="form-subtitle">即刻出发·旅游网，探索世界的每一个角落</p>
        <div class="form-group">
          <input 
            type="text" 
            id="login-username" 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            required
          />
        </div>
        <div class="form-group">
          <input 
            type="password" 
            id="login-password" 
            v-model="loginForm.password" 
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="form-group remember-me">
          <input type="checkbox" id="remember-me" />
          <label for="remember-me">记住密码</label>
        </div>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
        <button class="submit-btn" @click="loginUser">登录</button>
      </div>

      <!-- 注册表单 -->
      <div v-if="activeTab === 'register'" class="auth-form">
        <h2 class="form-title">注册账号</h2>
        <p class="form-subtitle">立即注册，开启您的精彩旅程</p>
        <div class="form-group">
          <input 
            type="text" 
            id="register-username" 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
            required
          />
        </div>
        <div class="form-group">
          <input 
            type="email" 
            id="register-email" 
            v-model="registerForm.email" 
            placeholder="请输入邮箱"
            required
          />
        </div>
        <div class="form-group">
          <input 
            type="password" 
            id="register-password" 
            v-model="registerForm.password" 
            placeholder="请输入密码（不少于6位）"
            required
          />
        </div>
        <div class="form-group">
          <input 
            type="password" 
            id="register-confirm-password" 
            v-model="registerForm.confirmPassword" 
            placeholder="请再次输入密码"
            required
          />
        </div>
        <p v-if="registerError" class="error-message">{{ registerError }}</p>
        <button class="submit-btn" @click="registerUser">注册</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8f0 100%);
  z-index: 1;
  overflow: hidden;
}

/* 装饰性背景元素 */
.auth-background::before,
.auth-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(46, 139, 87, 0.1);
  animation: float 20s infinite ease-in-out;
}

.auth-background::before {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -200px;
  animation-delay: 0s;
}

.auth-background::after {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: -150px;
  animation-delay: -10s;
}

/* 额外的装饰元素 */
.auth-background span {
  position: absolute;
  border-radius: 50%;
  background: rgba(46, 139, 87, 0.05);
  animation: float 15s infinite ease-in-out;
}

.auth-background span:nth-child(1) {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.auth-background span:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.auth-background span:nth-child(3) {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-50px) rotate(180deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
              0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  z-index: 2;
  animation: slideUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  transition: all 0.3s ease;
}

.auth-card:hover {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2),
              0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-tabs {
  display: flex;
  background: rgba(46, 139, 87, 0.1);
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  color: #666;
  position: relative;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.tab-btn span {
  position: relative;
  z-index: 1;
}

.tab-btn:hover {
  color: #2e8b57;
  transform: translateY(-2px);
}

.tab-btn.active {
  color: white;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(46, 139, 87, 0.3);
}

.tab-btn.active::before {
  opacity: 1;
}

.auth-form {
  padding: 40px;
}

.form-title {
  text-align: center;
  background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  width: 100%;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 35px;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  color: #333;
  font-weight: 400;
}

.form-group input:focus {
  outline: none;
  border-color: #2e8b57;
  box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
  background-color: white;
}

.form-group input::placeholder {
  color: #aaa;
  font-weight: 300;
}

/* 输入框图标 */
.form-group::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;
  transition: all 0.3s ease;
}

/* 输入框获得焦点时图标变化 */
.form-group input:focus + label,
.form-group input:focus::placeholder {
  color: #2e8b57;
}

/* 标签平滑过渡 */
.auth-tabs button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}



.remember-me {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  position: relative;
}

.remember-me input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(46, 139, 87, 0.3);
  border-radius: 6px;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
}

.remember-me input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
  border-color: #2e8b57;
}

.remember-me input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.remember-me label {
  color: #555;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
}

.remember-me label:hover {
  color: #2e8b57;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 25px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
  animation: shake 0.5s ease-in-out;
}

.submit-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(46, 139, 87, 0.3);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(46, 139, 87, 0.4);
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(46, 139, 87, 0.5);
}

/* 加载动画 */
.submit-btn.loading {
  opacity: 0.7;
  pointer-events: none;
}

.submit-btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 表单切换动画 */
.auth-form {
  padding: 40px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 页面加载动画 */
.auth-container {
  animation: pageFadeIn 0.8s ease;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card {
    max-width: 100%;
    margin: 20px;
    border-radius: 15px;
  }

  .auth-form {
    padding: 25px;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .form-subtitle {
    font-size: 1rem;
  }

  /* 移动端背景简化 */
  .auth-background::before,
  .auth-background::after {
    width: 300px;
    height: 300px;
  }

  .auth-background span {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-form {
    padding: 20px;
  }

  .form-title {
    font-size: 1.6rem;
  }

  .submit-btn {
    font-size: 1.1rem;
    padding: 16px;
  }
}
</style>