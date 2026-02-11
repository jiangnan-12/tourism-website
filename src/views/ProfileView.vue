<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户信息
const userInfo = ref(null)

// 用户订单
const orders = ref([])

// 加载用户信息
const loadUserInfo = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser) {
    userInfo.value = currentUser
  } else {
    // 如果用户未登录，跳转到登录页面
    router.push('/auth')
  }
}

// 加载订单
const loadOrders = () => {
  orders.value = JSON.parse(localStorage.getItem('orders')) || []
  
  // 按时间倒序排列订单
  orders.value.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  // 调试：打印订单数据结构
  console.log('Orders:', orders.value)
}

// 退出登录
const logout = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}

// 页面加载时执行
onMounted(() => {
  loadUserInfo()
  loadOrders()
})
</script>

<template>
  <div v-if="userInfo" class="profile-container">
    <div class="profile-header">
      <h1 class="page-title">个人中心</h1>
      <button class="logout-btn" @click="logout">退出登录</button>
    </div>

    <!-- 用户基本信息 -->
    <section class="user-info-section">
      <h2 class="section-title">基本信息</h2>
      <div class="user-info-card">
        <div class="user-avatar">👤</div>
        <div class="user-details">
          <div class="info-item">
            <span class="info-label">用户名:</span>
            <span class="info-value">{{ userInfo.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱:</span>
            <span class="info-value">{{ userInfo.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">角色:</span>
            <span class="info-value role-tag" :class="userInfo.role">
              {{ userInfo.role === 'admin' ? '管理员' : '游客' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 我的订单 -->
    <section class="orders-section">
      <h2 class="section-title">我的订单</h2>
      <div v-if="orders.length === 0" class="no-orders">
        <p>您还没有订单记录</p>
      </div>
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-id">订单号: {{ order.id }}</div>
            <div class="order-date">日期: {{ order.date }}</div>
          </div>
          <div class="order-content">
            <div class="order-image">
              <!-- 根据订单类型显示不同的默认图片 -->
              <img 
                v-if="order.image" 
                :src="order.image" 
                :alt="order.attractionName || order.routeName || order.hotelName || '订单图片'" 
              />
              <img 
                v-else-if="order.hotelId" 
                src="/网站图片/丽江古城客栈.jpg" 
                alt="默认酒店图片"
              />
              <img 
                v-else-if="order.attractionId" 
                src="/网站图片/故宫博物院.jpg" 
                alt="默认景点图片"
              />
              <img 
                v-else-if="order.routeId" 
                src="/网站图片/北京经典3日游.jpg" 
                alt="默认路线图片"
              />
              <div v-else class="no-image">
                <span class="no-image-text">订单图片</span>
              </div>
            </div>
            <div class="order-info">
              <div class="order-attraction">
                <div class="order-type">
                  <span v-if="order.attractionId" class="type-label">景点门票</span>
                  <span v-else-if="order.routeId" class="type-label">旅游路线</span>
                  <span v-else-if="order.hotelId" class="type-label">酒店预订</span>
                </div>
                <span class="attraction-name">
                  {{ order.attractionName || order.routeName || order.hotelName || '未知订单' }}
                </span>
                <span class="order-status" :class="order.status">
                  {{ order.status }}
                </span>
              </div>
              <div class="order-details">
                <div class="detail-item">
                  <span class="detail-label">单价:</span>
                  <span class="detail-value">¥{{ order.price }}</span>
                </div>
                
                <!-- 数量显示，根据订单类型使用不同字段和单位 -->
                <div class="detail-item">
                  <span class="detail-label">数量:</span>
                  <span class="detail-value">
                    {{ order.quantity || order.participants || order.guests || 0 }}
                    <span v-if="order.attractionId">张</span>
                    <span v-else-if="order.routeId || order.hotelId">人</span>
                  </span>
                </div>
                
                <!-- 酒店订单的额外信息 -->
                <div v-if="order.hotelId" class="hotel-extras">
                  <div class="detail-item">
                    <span class="detail-label">入住日期:</span>
                    <span class="detail-value">{{ order.checkInDate || '未指定' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">退房日期:</span>
                    <span class="detail-value">{{ order.checkOutDate || '未指定' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">入住天数:</span>
                    <span class="detail-value">{{ order.days || 0 }}晚</span>
                  </div>
                </div>
                
                <!-- 旅游路线的额外信息 -->
                <div v-if="order.routeId" class="route-extras">
                  <div class="detail-item">
                    <span class="detail-label">路线天数:</span>
                    <span class="detail-value">{{ order.days || 0 }}天</span>
                  </div>
                </div>
                
                <div class="detail-item total">
                  <span class="detail-label">总计:</span>
                  <span class="detail-value">¥{{ order.totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: #2e8b57;
  margin: 0;
}

.logout-btn {
  background-color: #4682b4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #2e8b57;
}

.section-title {
  color: #4682b4;
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0f2f7;
  padding-bottom: 10px;
}

/* 用户信息样式 */
.user-info-section {
  margin-bottom: 50px;
}

.user-info-card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 30px;
}

.user-avatar {
  font-size: 5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 20px;
  align-items: center;
}

.info-label {
  font-weight: bold;
  color: #666;
  width: 80px;
}

.info-value {
  color: #333;
  font-size: 1.1rem;
}

.role-tag {
  padding: 5px 15px;
  border-radius: 15px;
  font-weight: bold;
}

.role-tag.user {
  background-color: #e8f4f8;
  color: #4682b4;
}

.role-tag.admin {
  background-color: #f0f8f0;
  color: #2e8b57;
}

/* 订单样式 */
.orders-section {
  margin-bottom: 50px;
}

.no-orders {
  text-align: center;
  padding: 50px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #666;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.order-header {
  background-color: #f0f8f0;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0f2f7;
}

.order-id {
  font-weight: bold;
  color: #2e8b57;
}

.order-date {
  color: #666;
  font-size: 0.9rem;
}

.order-content {
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.order-image {
  width: 150px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0f8f0;
}

.order-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.order-image:hover img {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(46, 139, 87, 0.1);
  color: #2e8b57;
  font-weight: 500;
}

.order-info {
  flex: 1;
}

.order-attraction {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.order-type {
  margin-bottom: 5px;
}

.type-label {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
}

.attraction-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4682b4;
  margin-bottom: 5px;
}

.order-attraction > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-status {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
}

.order-status.已支付 {
  background-color: #e8f5e8;
  color: #2e8b57;
}

.order-status.待支付 {
  background-color: #fff3e0;
  color: #ff9800;
}

.order-status.已取消 {
  background-color: #ffebee;
  color: #f44336;
}

.order-details {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: bold;
  color: #333;
}

.detail-item.total {
  margin-left: auto;
}

.detail-item.total .detail-value {
  color: #2e8b57;
  font-size: 1.1rem;
}

/* 酒店和路线订单的额外信息样式 */
.hotel-extras, .route-extras {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #e0e0e0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* 确保酒店额外信息在屏幕宽度较小时也能良好显示 */
@media (max-width: 768px) {
  .order-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .order-image {
    width: 100%;
    height: 180px;
  }
  
  .order-details {
    flex-direction: column;
    gap: 15px;
  }
  
  .hotel-extras, .route-extras {
    flex-direction: column;
    gap: 10px;
  }
  
  .detail-item.total {
    margin-left: 0;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #e0e0e0;
  }
}
</style>