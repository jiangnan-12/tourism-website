<script setup>
import { ref } from 'vue'

// 模拟酒店数据
const hotels = [
  {
    id: 1,
    name: '丽江古城客栈',
    rating: 4.8,
    price: 280,
    image: '/网站图片/丽江古城客栈.jpg',
    location: '云南丽江古城区五一街',
    type: '客栈',
    amenities: ['免费WiFi', '24小时热水', '空调', '独立卫浴']
  },
  {
    id: 2,
    name: '张家界国家森林公园酒店',
    rating: 4.7,
    price: 320,
    image: '/网站图片/张家界国家森林公园酒店.jpg',
    location: '湖南张家界国家森林公园景区内',
    type: '酒店',
    amenities: ['免费WiFi', '健身房', '餐厅', '接送服务']
  },
  {
    id: 3,
    name: '九寨沟天堂洲际大饭店',
    rating: 4.9,
    price: 880,
    image: '/网站图片/九寨沟天堂洲际大饭店.jpg',
    location: '四川九寨沟风景区',
    type: '豪华酒店',
    amenities: ['免费WiFi', '游泳池', 'SPA', '餐厅', '接送服务']
  },
  {
    id: 4,
    name: '三亚湾海景酒店',
    rating: 4.6,
    price: 580,
    image: '/网站图片/三亚湾海景酒店.jpg',
    location: '海南三亚湾路',
    type: '海景酒店',
    amenities: ['免费WiFi', '海景房', '游泳池', '餐厅']
  }
]

// 预订功能相关变量
const selectedHotel = ref(null)
const showBookModal = ref(false)
const checkInDate = ref('')
const checkOutDate = ref('')
const guests = ref(1)

// 打开预订模态框
const openBookModal = (hotel) => {
  selectedHotel.value = hotel
  checkInDate.value = ''
  checkOutDate.value = ''
  guests.value = 1
  showBookModal.value = true
}

// 关闭预订模态框
const closeBookModal = () => {
  showBookModal.value = false
  selectedHotel.value = null
}

// 计算总金额
const calculateTotal = () => {
  if (!selectedHotel.value || !checkInDate.value || !checkOutDate.value) return 0
  
  const checkIn = new Date(checkInDate.value)
  const checkOut = new Date(checkOutDate.value)
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  
  return Math.max(0, days) * selectedHotel.value.price
}

// 预订酒店
const bookHotel = () => {
  if (!selectedHotel.value || !checkInDate.value || !checkOutDate.value) return
  
  // 计算入住天数
  const checkIn = new Date(checkInDate.value)
  const checkOut = new Date(checkOutDate.value)
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  
  if (days <= 0) {
    alert('退房日期必须晚于入住日期')
    return
  }
  
  // 创建订单
  const order = {
    id: Date.now(),
    hotelId: selectedHotel.value.id,
    hotelName: selectedHotel.value.name,
    image: selectedHotel.value.image,
    checkInDate: checkInDate.value,
    checkOutDate: checkOutDate.value,
    days: days,
    guests: guests.value,
    pricePerNight: selectedHotel.value.price,
    totalAmount: selectedHotel.value.price * days,
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
  <div class="hotels-container">
    <h1 class="page-title">酒店信息</h1>
    <p class="page-subtitle">探索舒适便捷的住宿选择</p>
    
    <!-- 筛选搜索区域 -->
    <div class="filter-section">
      <div class="filter-container">
        <input type="text" placeholder="搜索酒店名称、位置" class="search-input" />
        <select class="filter-select">
          <option value="">选择目的地</option>
          <option value="丽江">丽江</option>
          <option value="张家界">张家界</option>
          <option value="九寨沟">九寨沟</option>
          <option value="三亚">三亚</option>
        </select>
        <select class="filter-select">
          <option value="">选择类型</option>
          <option value="酒店">酒店</option>
          <option value="客栈">客栈</option>
          <option value="度假村">度假村</option>
          <option value="民宿">民宿</option>
        </select>
        <select class="filter-select">
          <option value="">选择价格区间</option>
          <option value="0-300">0-300元</option>
          <option value="300-500">300-500元</option>
          <option value="500-1000">500-1000元</option>
          <option value="1000+">1000元以上</option>
        </select>
        <select class="filter-select">
          <option value="">排序方式</option>
          <option value="推荐">推荐</option>
          <option value="价格低到高">价格低到高</option>
          <option value="价格高到低">价格高到低</option>
          <option value="评分高到低">评分高到低</option>
        </select>
        <button class="search-btn">搜索</button>
        <button class="reset-btn">重置筛选</button>
      </div>
    </div>
    
    <!-- 酒店列表 -->
    <div class="hotels-grid">
      <div v-for="hotel in hotels" :key="hotel.id" class="hotel-card">
        <img :src="hotel.image" :alt="hotel.name" class="hotel-image" />
        <div class="hotel-info">
          <div class="hotel-header">
            <h3 class="hotel-name">{{ hotel.name }}</h3>
            <div class="hotel-rating">⭐{{ hotel.rating }}</div>
          </div>
          <div class="hotel-location">{{ hotel.location }}</div>
          <div class="hotel-type">{{ hotel.type }}</div>
          <div class="hotel-amenities">
            <span v-for="(amenity, index) in hotel.amenities.slice(0, 3)" :key="index" class="amenity-tag">
              {{ amenity }}
            </span>
            <span v-if="hotel.amenities.length > 3" class="more-amenities">+{{ hotel.amenities.length - 3 }}</span>
          </div>
          <div class="hotel-footer">
            <div class="hotel-price">¥{{ hotel.price }}/晚</div>
            <button class="book-btn" @click="openBookModal(hotel)">立即预订</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 预订模态框 -->
  <div v-if="showBookModal" class="modal-overlay" @click="closeBookModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>预订 - {{ selectedHotel?.name }}</h3>
        <button class="close-btn" @click="closeBookModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="hotel-info-summary">
          <p>酒店：{{ selectedHotel?.name }}</p>
          <p>价格：¥{{ selectedHotel?.price }}/晚</p>
          <p>位置：{{ selectedHotel?.location }}</p>
        </div>
        
        <div class="booking-form">
          <div class="form-group">
            <label for="checkInDate">入住日期：</label>
            <input type="date" id="checkInDate" v-model="checkInDate" required>
          </div>
          
          <div class="form-group">
            <label for="checkOutDate">退房日期：</label>
            <input type="date" id="checkOutDate" v-model="checkOutDate" required>
          </div>
          
          <div class="form-group">
            <label for="guests">入住人数：</label>
            <div class="guest-controls">
              <button class="control-btn" @click="guests = Math.max(1, guests - 1)">-</button>
              <input type="number" id="guests" v-model="guests" min="1">
              <button class="control-btn" @click="guests++">+</button>
            </div>
          </div>
          
          <div v-if="checkInDate && checkOutDate" class="total-amount">
            <strong>总计：¥{{ calculateTotal() }}</strong>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeBookModal">取消</button>
        <button class="confirm-btn" @click="bookHotel">确认预订</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hotels-container {
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

.search-input, .filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  min-width: 150px;
}

.search-btn {
  padding: 10px 20px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #277048;
}

.reset-btn {
  padding: 10px 20px;
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #f5f5f5;
}

/* 酒店列表 */
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .hotels-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
  }
  
  /* 容器内边距优化 */
  .hotels-container {
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
  
  .search-btn,
  .reset-btn {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
  
  /* 卡片优化 */
  .hotel-card {
    border-radius: 15px;
  }
  
  .hotel-image {
    height: 250px;
  }
  
  .hotel-info {
    padding: 25px;
  }
  
  .hotel-name {
    font-size: 1.5rem;
  }
  
  .hotel-type,
  .hotel-location {
    font-size: 1rem;
  }
}

.hotel-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hotel-info {
  padding: 20px;
}

.hotel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hotel-name {
  font-size: 1.3rem;
  color: #333;
  margin: 0;
}

.hotel-rating {
  color: #ff9800;
  font-weight: bold;
}

.hotel-location {
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.hotel-type {
  color: #2e8b57;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.hotel-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.amenity-tag {
  background-color: #f0f8f0;
  color: #2e8b57;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.more-amenities {
  color: #666;
  font-size: 0.8rem;
}

.hotel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hotel-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e8b57;
}

.book-btn {
  padding: 8px 16px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.book-btn:hover {
  background-color: #277048;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input, .filter-select {
    width: 100%;
    min-width: auto;
  }

  .hotels-grid {
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

.hotel-info-summary {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.hotel-info-summary p {
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

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #2e8b57;
  box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
}

.guest-controls {
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

.guest-controls input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.guest-controls input:focus {
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