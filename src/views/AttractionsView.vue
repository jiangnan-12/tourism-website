<script setup>
import { ref, computed } from 'vue'
import PanoramaViewer from '../components/PanoramaViewer.vue'

// 模拟景点数据
const attractions = [
  {
    id: 1,
    name: '故宫博物院',
    image: '/网站图片/故宫博物院.jpg',
    panoramaUrl: 'https://www.720yun.com/t/1c4jrzhwky1?scene_id=27278815', // 3D全景图片 (720yun全景图)
    description: '故宫博物院是中国明清两代的皇家宫殿，旧称为紫禁城，位于北京中轴线的中心。',
    price: 60,
    location: '北京',
    rating: 4.8,
    category: '历史文化'
  },
  {
    id: 2,
    name: '长城',
    image: '/网站图片/长城.jpg',
    panoramaUrl: 'https://www.720yun.com/t/d3vkshphzi7?scene_id=49698187', // 3D全景图片 (720yun长城全景图)
    description: '长城是中国古代的军事防御工程，是世界文化遗产之一。',
    price: 40,
    location: '北京',
    rating: 4.9,
    category: '自然风光'
  },
  {
    id: 3,
    name: '西湖',
    image: '/网站图片/西湖.jpg',
    panoramaUrl: 'https://www.720yun.com/t/d5ajOguf5v7?scene_id=3219488', // 3D全景图片 (720yun西湖全景图)
    description: '西湖是中国大陆首批国家重点风景名胜区和中国十大风景名胜之一。',
    price: 0,
    location: '杭州',
    rating: 4.7,
    category: '自然风光'
  },
  {
    id: 4,
    name: '黄山',
    image: '/网站图片/黄山.jpg',
    panoramaUrl: 'https://www.720yun.com/t/f272ejruqcv?scene_id=290644', // 3D全景图片 (720yun黄山全景图 - 玉屏峰,天都峰,莲花峰)
    description: '黄山位于安徽省南部黄山市境内，是中国十大名山之一，有“天下第一奇山”之美称。',
    price: 190,
    location: '安徽',
    rating: 4.9,
    category: '自然风光'
  },
  {
    id: 5,
    name: '兵马俑',
    image: '/网站图片/兵马俑.jpg',
    panoramaUrl: 'https://www.720yun.com/t/e3vki91h0py?scene_id=34105442', // 3D全景图片 (720yun兵马俑全景图)
    description: '秦始皇兵马俑被誉为世界第八大奇迹，是中国古代辉煌文明的一张金字名片。',
    price: 120,
    location: '西安',
    rating: 4.8,
    category: '历史文化'
  },
  {
    id: 6,
    name: '张家界国家森林公园',
    image: '/网站图片/张家界国家森林公园.jpg',
    panoramaUrl: 'https://www.720yun.com/t/518j5sknru7?scene_id=11439292', // 3D全景图片 (720yun张家界全景图)
    description: '张家界国家森林公园以峰称奇、以谷显幽、以林见秀，是世界自然遗产。',
    price: 228,
    location: '张家界',
    rating: 4.7,
    category: '自然风光'
  },
  {
    id: 7,
    name: '丽江古城',
    image: '/网站图片/丽江古城.jpg',
    panoramaUrl: 'https://www.720yun.com/t/aa02dqp8aes?scene_id=1010521', // 3D全景图片 (720yun丽江古城全景图)
    description: '丽江古城是中国历史文化名城之一，具有800多年历史，世界文化遗产。',
    price: 80,
    location: '丽江',
    rating: 4.6,
    category: '历史文化'
  },
  {
    id: 8,
    name: '九寨沟',
    image: '/网站图片/九寨沟.jpg',
    panoramaUrl: 'https://www.720yun.com/t/d8vkzmfl0pl?scene_id=83534120', // 3D全景图片 (720yun九寨沟全景图)
    description: '九寨沟以翠海、叠瀑、彩林、雪峰、藏情、蓝冰“六绝”著称于世，世界自然遗产。',
    price: 190,
    location: '阿坝',
    rating: 4.9,
    category: '自然风光'
  }
]

// 筛选条件
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedCategory = ref('')
const priceRange = ref('')
const minRating = ref('')

// 获取所有可选目的地
const locations = Array.from(new Set(attractions.map(a => a.location)))

// 获取所有可选分类
const categories = Array.from(new Set(attractions.map(a => a.category)))

// 计算过滤后的景点
const filteredAttractions = computed(() => {
  return attractions.filter(attraction => {
    // 搜索关键词过滤
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          attraction.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 目的地过滤
    const matchesLocation = !selectedLocation.value || attraction.location === selectedLocation.value
    
    // 分类过滤
    const matchesCategory = !selectedCategory.value || attraction.category === selectedCategory.value
    
    // 价格范围过滤
    let matchesPrice = true
    if (priceRange.value) {
      const [min, max] = priceRange.value.split('-').map(Number)
      matchesPrice = attraction.price >= min && (max === 0 || attraction.price <= max)
    }
    
    // 评分过滤
    const matchesRating = !minRating.value || attraction.rating >= parseFloat(minRating.value)
    
    return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesRating
  })
})

// 购票状态
const selectedAttraction = ref(null)
const ticketQuantity = ref(1)
const showModal = ref(false)

// 3D观景功能相关变量
const selectedPanoramaAttraction = ref(null)
const showPanoramaModal = ref(false)

// 打开购票模态框
const openBuyModal = (attraction) => {
  selectedAttraction.value = attraction
  ticketQuantity.value = 1
  showModal.value = true
}

// 关闭购票模态框

// 打开3D观景模态框
const openPanoramaModal = (attraction) => {
  selectedPanoramaAttraction.value = attraction
  showPanoramaModal.value = true
}

// 关闭3D观景模态框
const closePanoramaModal = () => {
  showPanoramaModal.value = false
  selectedPanoramaAttraction.value = null
}
const closeBuyModal = () => {
  showModal.value = false
  selectedAttraction.value = null
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  selectedLocation.value = ''
  selectedCategory.value = ''
  priceRange.value = ''
  minRating.value = ''
}

// 购票函数
const buyTicket = () => {
  if (!selectedAttraction.value) return

  // 创建订单
  const order = {
    id: Date.now(),
    attractionId: selectedAttraction.value.id,
    attractionName: selectedAttraction.value.name,
    image: selectedAttraction.value.image,
    price: selectedAttraction.value.price,
    quantity: ticketQuantity.value,
    totalAmount: selectedAttraction.value.price * ticketQuantity.value,
    date: new Date().toLocaleDateString(),
    status: '已支付'
  }

  // 保存订单到本地存储
  const orders = JSON.parse(localStorage.getItem('orders')) || []
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))

  // 关闭模态框并提示
  closeBuyModal()
  alert('购票成功！订单已保存到个人中心。')
}
</script>

<template>
  <div class="attractions-container">
    <h1 class="page-title">旅游景点</h1>
    <p class="page-subtitle">发现中国最美的旅游景点</p>
    
    <!-- 筛选搜索区域 -->
    <div class="filter-section">
      <div class="filter-container">
        <input 
          type="text" 
          placeholder="搜索景点名称或描述" 
          class="search-input"
          v-model="searchQuery"
        />
        <select 
          class="filter-select"
          v-model="selectedLocation"
        >
          <option value="">选择目的地</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
        <select 
          class="filter-select"
          v-model="selectedCategory"
        >
          <option value="">选择分类</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select 
          class="filter-select"
          v-model="priceRange"
        >
          <option value="">选择价格区间</option>
          <option value="0-50">0-50元</option>
          <option value="50-100">50-100元</option>
          <option value="100-200">100-200元</option>
          <option value="200-0">200元以上</option>
        </select>
        <select 
          class="filter-select"
          v-model="minRating"
        >
          <option value="">最低评分</option>
          <option value="4.5">4.5分以上</option>
          <option value="4.7">4.7分以上</option>
          <option value="4.8">4.8分以上</option>
          <option value="4.9">4.9分以上</option>
        </select>
        <button 
          class="reset-btn"
          @click="resetFilters"
        >
          重置筛选
        </button>
      </div>
    </div>
    
    <!-- 筛选结果统计 -->
    <div class="results-stats">
      <span>找到 {{ filteredAttractions.length }} 个景点</span>
    </div>
    
    <!-- 景点列表 -->
    <div class="attractions-grid">
      <div v-for="attraction in filteredAttractions" :key="attraction.id" class="attraction-card">
        <img :src="attraction.image" :alt="attraction.name" class="attraction-image" />
        <div class="attraction-info">
          <div class="attraction-header">
            <h2 class="attraction-name">{{ attraction.name }}</h2>
            <div class="attraction-meta">
              <span class="rating">⭐{{ attraction.rating }}</span>
              <span class="location">{{ attraction.location }}</span>
              <span class="category">{{ attraction.category }}</span>
            </div>
          </div>
          <p class="attraction-description">{{ attraction.description }}</p>
          <div class="attraction-footer">
            <div class="attraction-price">
              <span v-if="attraction.price === 0">免费</span>
              <span v-else>¥{{ attraction.price }}</span>
            </div>
            <div class="attraction-actions">
              <button class="panorama-btn" @click="openPanoramaModal(attraction)">
                3D观景
              </button>
              <button class="buy-btn" @click="openBuyModal(attraction)">
                立即购票
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 无结果提示 -->
    <div v-if="filteredAttractions.length === 0" class="no-results">
      <p>没有找到符合条件的景点，请尝试调整筛选条件</p>
    </div>

    <!-- 购票模态框 -->
    <div v-if="showModal && selectedAttraction" class="modal-overlay" @click.self="closeBuyModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>购买 {{ selectedAttraction.name }} 门票</h3>
          <button class="close-btn" @click="closeBuyModal">×</button>
        </div>
        <div class="modal-body">
          <div class="ticket-info">
            <img :src="selectedAttraction.image" :alt="selectedAttraction.name" class="ticket-image" />
            <div class="ticket-details">
              <p><strong>景点:</strong> {{ selectedAttraction.name }}</p>
              <p><strong>价格:</strong> ¥{{ selectedAttraction.price }}/张</p>
              <p><strong>地点:</strong> {{ selectedAttraction.location }}</p>
            </div>
          </div>
          <div class="ticket-quantity">
            <label for="quantity">数量:</label>
            <div class="quantity-control">
              <button @click="ticketQuantity = Math.max(1, ticketQuantity - 1)">-</button>
              <input type="number" id="quantity" v-model.number="ticketQuantity" min="1" />
              <button @click="ticketQuantity++">+</button>
            </div>
          </div>
          <div class="total-amount">
            <strong>总计:</strong> ¥{{ selectedAttraction.price * ticketQuantity }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeBuyModal">取消</button>
          <button class="confirm-btn" @click="buyTicket">确认购票</button>
        </div>
      </div>
    </div>

    <!-- 3D观景模态框 -->
    <div v-if="showPanoramaModal" class="modal-overlay" @click="closePanoramaModal">
      <div class="modal-content panorama-modal" @click.stop>
        <div class="modal-header">
          <h3>3D观景 - {{ selectedPanoramaAttraction?.name }}</h3>
          <button class="close-btn" @click="closePanoramaModal">&times;</button>
        </div>
        
        <div class="modal-body panorama-body">
          <PanoramaViewer 
            v-if="selectedPanoramaAttraction" 
            :image-url="selectedPanoramaAttraction.panoramaUrl" 
          />
          <div class="panorama-tips">
            <p>💡 提示：按住鼠标拖动可旋转视角，滚轮可缩放</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attractions-container {
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
  margin-bottom: 20px;
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
  border-color: #2e8b57;
  box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #2e8b57;
  box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
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

/* 筛选结果统计 */
.results-stats {
  margin-bottom: 30px;
  color: #666;
  font-size: 0.95rem;
}

/* 景点列表 */
.attractions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .attractions-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
  }
  
  /* 容器内边距优化 */
  .attractions-container {
    padding: 60px 40px;
  }
  
  /* 筛选区域优化 */
  .filter-section {
    padding: 30px;
  }
  
  .search-input {
    max-width: 400px;
    padding: 12px 20px;
    font-size: 1.1rem;
  }
  
  .filter-btn,
  .reset-btn {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
  
  /* 卡片优化 */
  .attraction-card {
    border-radius: 15px;
  }
  
  .attraction-image {
    height: 280px;
  }
  
  .attraction-name {
    font-size: 1.5rem;
  }
}

.attraction-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.attraction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.attraction-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.attraction-info {
  padding: 25px;
}

.attraction-header {
  margin-bottom: 15px;
}

.attraction-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
}

.attraction-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.9rem;
}

.rating {
  font-weight: bold;
  color: #ffd700;
}

.location {
  color: #666;
}

.category {
  background-color: #e6f2ff;
  color: #4682b4;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.attraction-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.attraction-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attraction-actions {
  display: flex;
  gap: 10px;
}

.attraction-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e8b57;
}

.panorama-btn {
  padding: 8px 16px;
  background-color: #4682b4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.panorama-btn:hover {
  background-color: #5a9bd4;
}

.buy-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buy-btn:hover {
  background-color: #4682b4;
}

/* 模态框样式 */
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
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

/* 3D观景模态框样式 */
.panorama-modal {
  max-width: 900px;
  width: 95%;
}

.panorama-body {
  padding: 0;
}

.panorama-tips {
  padding: 15px 20px;
  background-color: #f8f9fa;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.panorama-tips p {
  margin: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2e8b57;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.ticket-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.ticket-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.ticket-details p {
  margin: 5px 0;
}

.ticket-quantity {
  margin-bottom: 20px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.quantity-control button {
  background-color: #f0f0f0;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.quantity-control input {
  width: 50px;
  text-align: center;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.total-amount {
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: right;
  color: #2e8b57;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.cancel-btn {
  background-color: #f0f0f0;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #4682b4;
}
</style>