<script setup>
import { ref } from 'vue'

// 模拟推荐路线数据
const routes = [
  {
    id: 1,
    name: '北京经典3日游',
    days: 3,
    attractions: 5,
    price: 1280,
    image: '/网站图片/北京经典3日游.jpg',
    description: '游览北京最经典的景点，包括故宫、长城、颐和园等。',
    highlights: ['故宫博物院', '八达岭长城', '颐和园', '天坛', '天安门广场']
  },
  {
    id: 2,
    name: '杭州西湖2日游',
    days: 2,
    attractions: 4,
    price: 880,
    image: '/网站图片/杭州印西湖2日游.jpg',
    description: '漫步西湖，感受江南水乡的独特韵味。',
    highlights: ['西湖', '灵隐寺', '雷峰塔', '宋城']
  },
  {
    id: 3,
    name: '黄山自然风光2日游',
    days: 2,
    attractions: 3,
    price: 1580,
    image: '/网站图片/黄山自然风光2日游.jpg',
    description: '欣赏黄山的奇松、怪石、云海等自然景观。',
    highlights: ['黄山风景区', '光明顶', '西海大峡谷']
  },
  {
    id: 4,
    name: '三亚海景5日游',
    days: 5,
    attractions: 6,
    price: 1880,
    image: '/网站图片/三亚海景5日游.jpg',
    description: '享受阳光沙滩，体验海岛风情。',
    highlights: ['亚龙湾', '蜈支洲岛', '天涯海角', '南山文化旅游区', '呀诺达热带雨林', '槟榔谷']
  },
  {
    id: 5,
    name: '成都美食3日游',
    days: 3,
    attractions: 4,
    price: 980,
    image: '/网站图片/成都美食3日游.jpg',
    description: '品尝正宗川菜，感受蜀地文化。',
    highlights: ['宽窄巷子', '锦里古街', '大熊猫基地', '都江堰']
  },
  {
    id: 6,
    name: '西安古都4日游',
    days: 4,
    attractions: 5,
    price: 1180,
    image: '/网站图片/西安古都4日游.jpg',
    description: '探索中华文明的发祥地，感受千年古都的魅力。',
    highlights: ['兵马俑', '华清宫', '西安城墙', '大雁塔', '回民街']
  }
]

// 预订功能相关变量
const selectedRoute = ref(null)
const showBookModal = ref(false)
const participants = ref(1)

// 打开预订模态框
const openBookModal = (route) => {
  selectedRoute.value = route
  participants.value = 1
  showBookModal.value = true
}

// 关闭预订模态框
const closeBookModal = () => {
  showBookModal.value = false
  selectedRoute.value = null
}

// 预订路线
const bookRoute = () => {
  if (!selectedRoute.value) return
  
  // 创建订单
  const order = {
    id: Date.now(),
    routeId: selectedRoute.value.id,
    routeName: selectedRoute.value.name,
    image: selectedRoute.value.image,
    price: selectedRoute.value.price,
    participants: participants.value,
    totalAmount: selectedRoute.value.price * participants.value,
    date: new Date().toLocaleDateString(),
    status: '已支付'
  }
  
  // 保存订单到本地存储
  const orders = JSON.parse(localStorage.getItem('orders')) || []
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))
  
  // 关闭模态框并提示
  closeBookModal()
  alert('预订成功！订单已保存到个人中心。')
}
</script>

<template>
  <div class="routes-container">
    <h1 class="page-title">旅游路线</h1>
    <p class="page-subtitle">探索精心设计的精彩旅程</p>
    
    <!-- 筛选搜索区域 -->
    <div class="filter-section">
      <div class="filter-container">
        <input type="text" placeholder="搜索路线名称、目的地" class="search-input" />
        <select class="filter-select">
          <option value="">选择目的地</option>
          <option value="北京">北京</option>
          <option value="杭州">杭州</option>
          <option value="黄山">黄山</option>
          <option value="三亚">三亚</option>
          <option value="成都">成都</option>
          <option value="西安">西安</option>
        </select>
        <select class="filter-select">
          <option value="">选择天数</option>
          <option value="2">2天</option>
          <option value="3">3天</option>
          <option value="4">4天</option>
          <option value="5">5天及以上</option>
        </select>
        <select class="filter-select">
          <option value="">选择价格区间</option>
          <option value="0-1000">0-1000元</option>
          <option value="1000-1500">1000-1500元</option>
          <option value="1500-2000">1500-2000元</option>
          <option value="2000+">2000元以上</option>
        </select>
        <select class="filter-select">
          <option value="">排序方式</option>
          <option value="推荐">推荐</option>
          <option value="价格低到高">价格低到高</option>
          <option value="价格高到低">价格高到低</option>
          <option value="天数少到多">天数少到多</option>
        </select>
        <button class="search-btn">搜索</button>
        <button class="reset-btn">重置筛选</button>
      </div>
    </div>
    
    <!-- 路线列表 -->
    <div class="routes-grid">
      <div v-for="route in routes" :key="route.id" class="route-card">
        <img :src="route.image" :alt="route.name" class="route-image" />
        <div class="route-info">
          <div class="route-header">
            <h3 class="route-name">{{ route.name }}</h3>
          </div>
          <div class="route-meta">
            <span class="route-days">📅 {{ route.days }}天</span>
            <span class="route-attractions">🏞️ {{ route.attractions }}个景点</span>
          </div>
          <p class="route-description">{{ route.description }}</p>
          <div class="route-highlights">
            <span v-for="(highlight, index) in route.highlights.slice(0, 4)" :key="index" class="highlight-tag">
              {{ highlight }}
            </span>
            <span v-if="route.highlights.length > 4" class="more-highlights">+{{ route.highlights.length - 4 }}</span>
          </div>
          <div class="route-footer">
            <div class="route-price">¥{{ route.price }}/人</div>
            <button class="book-btn" @click="openBookModal(route)">立即预订</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 预订模态框 -->
  <div v-if="showBookModal" class="modal-overlay" @click="closeBookModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>预订 - {{ selectedRoute?.name }}</h3>
        <button class="close-btn" @click="closeBookModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="route-info-summary">
          <p>路线：{{ selectedRoute?.name }}</p>
          <p>价格：¥{{ selectedRoute?.price }}/人</p>
        </div>
        
        <div class="booking-form">
          <div class="form-group">
            <label for="participants">参与人数：</label>
            <div class="participant-controls">
              <button class="control-btn" @click="participants = Math.max(1, participants - 1)">-</button>
              <input type="number" id="participants" v-model="participants" min="1">
              <button class="control-btn" @click="participants++">+</button>
            </div>
          </div>
          
          <div class="total-amount">
            <strong>总计：¥{{ (selectedRoute?.price || 0) * participants }}</strong>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeBookModal">取消</button>
        <button class="confirm-btn" @click="bookRoute">确认预订</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.routes-container {
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.page-subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #666;
}

/* 筛选搜索区域 */
.filter-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 40px;
}

.filter-container {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
  flex: 1;
  max-width: 300px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 10px 20px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background-color: #277048;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 139, 87, 0.3);
}

.reset-btn {
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #e0e0e0;
}

/* 路线列表 */
.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .routes-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 40px;
  }
  
  /* 容器内边距优化 */
  .routes-container {
    padding: 60px 40px;
  }
  
  /* 筛选区域优化 */
  .filter-section {
    padding: 30px;
    margin-bottom: 30px;
  }
  
  .search-input,
  .filter-select {
    padding: 12px 18px;
    font-size: 1.1rem;
  }
  
  .search-input {
    max-width: 400px;
  }
  
  .search-btn,
  .reset-btn {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
  
  /* 卡片优化 */
  .route-card {
    border-radius: 15px;
  }
  
  .route-image {
    height: 250px;
  }
  
  .route-info {
    padding: 30px;
  }
  
  .route-name {
    font-size: 1.5rem;
  }
  
  .route-description {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}

.route-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.route-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.route-info {
  padding: 25px;
}

.route-header {
  margin-bottom: 10px;
}

.route-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.route-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
}

.route-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.route-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.highlight-tag {
  background-color: #e8f4e8;
  color: #2e8b57;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.more-highlights {
  background-color: #f0f0f0;
  color: #666;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.route-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e8b57;
}

.book-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-btn:hover {
  background-color: #277048;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 139, 87, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .routes-container {
    padding: 25px 15px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .filter-select {
    flex: 1;
  }

  .routes-grid {
    grid-template-columns: 1fr;
  }
}

/* 预订模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background-color: #2e8b57;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  opacity: 0.8;
}

.modal-body {
  padding: 25px;
}

.route-info-summary {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.route-info-summary p {
  margin: 8px 0;
  color: #666;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.participant-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background-color: #277048;
  transform: scale(1.1);
}

.participant-controls input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.participant-controls input:focus {
  outline: none;
  border-color: #2e8b57;
  box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
}

.total-amount {
  text-align: right;
  padding: 15px;
  background-color: #e8f4e8;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #2e8b57;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 25px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background-color: #277048;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 139, 87, 0.3);
}
</style>