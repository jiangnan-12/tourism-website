<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentSlide = ref(0)
const isTransitioning = ref(false)
const slides = [
  { 
    image: 'https://picsum.photos/id/1036/1600/600', 
    title: '探索壮丽山水', 
    description: '立即探索祖国的大好河山，领略美不胜收的风景' 
  },
  { 
    image: 'https://picsum.photos/id/1038/1600/600', 
    title: '发现文化古迹', 
    description: '漫步历史长河，感受中华五千年文明的博大精深' 
  },
  { 
    image: 'https://picsum.photos/id/1043/1600/600', 
    title: '享受海滨风光', 
    description: '沐浴在阳光下，聆听海浪的声音，度过一个完美的假期' 
  }
]

const nextSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentSlide.value = (currentSlide.value + 1) % slides.length
  setTimeout(() => {
    isTransitioning.value = false
  }, 1000)
}

const prevSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
  setTimeout(() => {
    isTransitioning.value = false
  }, 1000)
}

// 立即探索按钮点击事件
const exploreNow = () => {
  router.push('/attractions')
}

// 视差效果处理
const handleParallax = (event) => {
  const carousel = document.querySelector('.carousel')
  if (!carousel) return
  
  const rect = carousel.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const xPercent = (x / rect.width - 0.5) * 20
  const yPercent = (y / rect.height - 0.5) * 20
  
  const slides = carousel.querySelectorAll('.carousel-slide')
  slides.forEach((slide, index) => {
    if (index === currentSlide.value) {
      const image = slide.querySelector('.slide-image')
      if (image) {
        image.style.transform = `translate(${xPercent * 0.1}px, ${yPercent * 0.1}px) scale(1.1)`
      }
      
      const content = slide.querySelector('.slide-content')
      if (content) {
        content.style.transform = `translate(-50%, -50%) translate(${xPercent * 0.05}px, ${yPercent * 0.05}px)`
      }
    }
  })
}

// 重置视差效果
const resetParallax = () => {
  const slides = document.querySelectorAll('.carousel-slide')
  slides.forEach((slide, index) => {
    if (index === currentSlide.value) {
      const image = slide.querySelector('.slide-image')
      if (image) {
        image.style.transform = 'translate(0, 0) scale(1.1)'
      }
      
      const content = slide.querySelector('.slide-content')
      if (content) {
        content.style.transform = 'translate(-50%, -50%)'
      }
    }
  })
}

// 滚动动画处理
const handleScrollAnimations = () => {
  const animateElements = document.querySelectorAll('.animate-on-scroll')
  
  animateElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
      // 添加延迟，使元素按顺序动画
      setTimeout(() => {
        element.classList.add('animated')
      }, index * 100)
    }
  })
}

let interval
let observer

onMounted(() => {
  interval = setInterval(nextSlide, 5000)
  
  // 添加鼠标移动事件监听
  const carousel = document.querySelector('.carousel')
  if (carousel) {
    carousel.addEventListener('mousemove', handleParallax)
    carousel.addEventListener('mouseleave', resetParallax)
  }
  
  // 初始化滚动动画
  handleScrollAnimations()
  window.addEventListener('scroll', handleScrollAnimations)
  
  // 使用Intersection Observer实现更精确的滚动动画
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated')
        }, index * 150)
        observer.unobserve(entry.target)
      }
    })
  }, options)
  
  // 观察所有需要动画的元素
  const animateElements = document.querySelectorAll('.animate-on-scroll')
  animateElements.forEach((element) => {
    observer.observe(element)
  })
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
  
  // 移除事件监听
  const carousel = document.querySelector('.carousel')
  if (carousel) {
    carousel.removeEventListener('mousemove', handleParallax)
    carousel.removeEventListener('mouseleave', resetParallax)
  }
  
  // 移除滚动事件监听
  window.removeEventListener('scroll', handleScrollAnimations)
  
  // 断开Intersection Observer
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="home-container">
    <!-- 轮播组件 - 全屏宽度 -->
    <div class="carousel" @mousemove="handleParallax" @mouseleave="resetParallax">
      <div class="carousel-wrapper">
        <div v-for="(slide, index) in slides" :key="index" 
             class="carousel-slide" 
             :class="{ active: index === currentSlide, transitioning: isTransitioning }">
          <img :src="slide.image" :alt="slide.title" class="slide-image" />
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-description">{{ slide.description }}</p>
            <button class="explore-btn" @click="exploreNow">立即探索</button>
          </div>
        </div>
      </div>
      <button class="carousel-btn prev-btn" @click="prevSlide">&lt;</button>
      <button class="carousel-btn next-btn" @click="nextSlide">&gt;</button>
      <div class="carousel-indicators">
        <span v-for="(slide, index) in slides" :key="index" 
              class="indicator" 
              :class="{ active: index === currentSlide }"
              @click="() => {
                if (!isTransitioning) {
                  isTransitioning = true
                  currentSlide = index
                  setTimeout(() => {
                    isTransitioning = false
                  }, 1000)
                }
              }"></span>
      </div>
    </div>

    <!-- 热门目的地 -->
    <div class="destinations animate-on-scroll">
      <h2 class="section-title">热门目的地</h2>
      <p class="section-subtitle">发现最受欢迎的旅游胜地</p>
      <div class="destinations-grid">
        <div class="destination-card animate-on-scroll" @click="router.push('/attractions')">
          <img src="/网站图片/丽江古城.jpg" alt="丽江古城" class="destination-image" />
          <div class="destination-info">
            <h3 class="destination-name">丽江古城</h3>
            <div class="destination-stats">
              <span>8个景点</span>
              <span>5家酒店</span>
            </div>
          </div>
        </div>
        <div class="destination-card animate-on-scroll" @click="router.push('/attractions')">
          <img src="/网站图片/张家界.jpg" alt="张家界" class="destination-image" />
          <div class="destination-info">
            <h3 class="destination-name">张家界</h3>
            <div class="destination-stats">
              <span>6个景点</span>
              <span>4家酒店</span>
            </div>
          </div>
        </div>
        <div class="destination-card animate-on-scroll" @click="router.push('/attractions')">
          <img src="/网站图片/九寨沟.jpg" alt="九寨沟" class="destination-image" />
          <div class="destination-info">
            <h3 class="destination-name">九寨沟</h3>
            <div class="destination-stats">
              <span>5个景点</span>
              <span>3家酒店</span>
            </div>
          </div>
        </div>
        <div class="destination-card animate-on-scroll" @click="router.push('/attractions')">
          <img src="/网站图片/三亚.jpg" alt="三亚" class="destination-image" />
          <div class="destination-info">
            <h3 class="destination-name">三亚</h3>
            <div class="destination-stats">
              <span>7个景点</span>
              <span>6家酒店</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能导航 -->
    <div class="feature-nav animate-on-scroll">
      <div class="feature-card animate-on-scroll">
        <div class="feature-icon">🔍</div>
        <h3 class="feature-title">景点搜索</h3>
        <p class="feature-description">快速找到心仪的旅游景点</p>
      </div>
      <div class="feature-card animate-on-scroll">
        <div class="feature-icon">🎫</div>
        <h3 class="feature-title">在线订票</h3>
        <p class="feature-description">便捷预订景点门票</p>
      </div>
      <div class="feature-card animate-on-scroll">
        <div class="feature-icon">📅</div>
        <h3 class="feature-title">行程规划</h3>
        <p class="feature-description">科学安排旅游行程</p>
      </div>
      <div class="feature-card animate-on-scroll">
        <div class="feature-icon">🛍️</div>
        <h3 class="feature-title">购物指南</h3>
        <p class="feature-description">当地特色商品推荐</p>
      </div>
    </div>

    <!-- 推荐路线 -->
    <div class="routes animate-on-scroll">
      <h2 class="section-title">推荐路线</h2>
      <p class="section-subtitle">精心策划的旅行方案</p>
      <div class="routes-grid">
        <div class="route-card animate-on-scroll" @click="router.push('/planning')">
          <img src="https://picsum.photos/id/1036/400/250" alt="云南大理丽江6日游" class="route-image" />
          <div class="route-info">
            <h3 class="route-name">云南大理丽江6日游</h3>
            <div class="route-rating">⭐4.5</div>
            <p class="route-description">精心策划的旅行路线，带您领略最美风景</p>
            <div class="route-footer">
              <span class="route-days">3天</span>
              <span class="route-price">¥3280起</span>
            </div>
          </div>
        </div>
        <div class="route-card animate-on-scroll" @click="router.push('/planning')">
          <img src="https://picsum.photos/id/1038/400/250" alt="四川成都九寨沟5日游" class="route-image" />
          <div class="route-info">
            <h3 class="route-name">四川成都九寨沟5日游</h3>
            <div class="route-rating">⭐4.5</div>
            <p class="route-description">精心策划的旅行路线，带您领略最美风景</p>
            <div class="route-footer">
              <span class="route-days">3天</span>
              <span class="route-price">¥2980起</span>
            </div>
          </div>
        </div>
        <div class="route-card animate-on-scroll" @click="router.push('/planning')">
          <img src="https://picsum.photos/id/1043/400/250" alt="海南三亚阳光沙滩4日游" class="route-image" />
          <div class="route-info">
            <h3 class="route-name">海南三亚阳光沙滩4日游</h3>
            <div class="route-rating">⭐4.5</div>
            <p class="route-description">精心策划的旅行路线，带您领略最美风景</p>
            <div class="route-footer">
              <span class="route-days">3天</span>
              <span class="route-price">¥2680起</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  overflow-x: hidden;
}

/* 轮播样式 */
.carousel {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
  cursor: crosshair;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.carousel-slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 3;
}

.carousel-slide.transitioning {
  z-index: 2;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  transform: scale(1.1);
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
  transition: opacity 0.5s ease;
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 5;
  max-width: 800px;
  padding: 0 20px;
  transition: all 0.5s ease;
}

.slide-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transform: translateY(30px);
  opacity: 0;
  animation: slideUp 1.5s ease forwards 0.3s;
}

.slide-description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transform: translateY(30px);
  opacity: 0;
  animation: slideUp 1.5s ease forwards 0.6s;
}

.explore-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(30px);
  opacity: 0;
  animation: slideUp 1.5s ease forwards 0.9s;
  box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
}

.explore-btn:hover {
  background-color: #4682b4;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.4);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.carousel-btn:hover {
  background-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
}

.carousel-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.prev-btn {
  left: 30px;
  opacity: 0;
  animation: fadeInLeft 1s ease forwards 1.2s;
}

.next-btn {
  right: 30px;
  opacity: 0;
  animation: fadeInRight 1s ease forwards 1.2s;
}

.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 10;
  opacity: 0;
  animation: fadeInUp 1s ease forwards 1.5s;
}

.indicator {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background-color: white;
  width: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);
}

.indicator.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 2s infinite;
}

/* 动画定义 */
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 响应式动画调整 */
@media (max-width: 768px) {
  .slide-title {
    font-size: 2.5rem;
  }
  
  .slide-description {
    font-size: 1.2rem;
  }
  
  .explore-btn {
    padding: 12px 25px;
    font-size: 1rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

/* 通用部分样式 */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 50px;
  color: #666;
}

/* 热门目的地样式 */
.destinations {
  padding: 80px 20px;
  background-color: white;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .destinations-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
  }
}

.destination-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
}

.destination-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}

.destination-card:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2e8b57, #4682b4, #2e8b57);
  border-radius: 15px 15px 0 0;
  animation: gradient-shift 3s ease infinite;
}

.destination-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
}

.destination-card:hover .destination-image {
  transform: scale(1.1);
}

.destination-info {
  padding: 20px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.destination-card:hover .destination-info {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95));
}

.destination-name {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.destination-card:hover .destination-name {
  color: #2e8b57;
  transform: translateY(-2px);
}

.destination-card:hover .destination-name::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2e8b57;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  animation: underline-expand 0.5s ease forwards;
}

.destination-stats {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.destination-card:hover .destination-stats {
  color: #4682b4;
  opacity: 1;
  transform: translateY(2px);
}

.destination-card:hover .destination-stats span {
  animation: pulse 1s ease infinite;
}

.destination-card:hover .destination-stats span:nth-child(1) {
  animation-delay: 0.1s;
}

.destination-card:hover .destination-stats span:nth-child(2) {
  animation-delay: 0.2s;
}

/* 功能导航样式 */
.feature-nav {
  padding: 80px 20px;
  background-color: #f8f9fa;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .feature-nav {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 50px;
    padding: 100px 40px;
  }
}

.feature-card {
  text-align: center;
  padding: 30px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  background: linear-gradient(135deg, white, #f8f9fa);
}

.feature-card:hover::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(46, 139, 87, 0.1), transparent);
  animation: rotate 3s linear infinite;
  z-index: 1;
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  transition: all 0.5s ease;
  position: relative;
  z-index: 2;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(5deg);
  filter: drop-shadow(0 4px 8px rgba(46, 139, 87, 0.3));
}

.feature-title {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.feature-card:hover .feature-title {
  color: #2e8b57;
  transform: translateY(-2px);
}

.feature-description {
  color: #666;
  line-height: 1.6;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  opacity: 0.8;
}

.feature-card:hover .feature-description {
  color: #4682b4;
  opacity: 1;
  transform: translateY(2px);
}

/* 推荐路线样式 */
.routes {
  padding: 80px 20px;
  background-color: white;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .routes-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
  }
  
  /* 全局内容区域优化 */
  .destinations,
  .routes {
    padding: 100px 40px;
  }
  
  /* 卡片内容优化 */
  .destination-card,
  .route-card {
    border-radius: 15px;
  }
  
  .destination-image {
    height: 300px;
  }
  
  /* 字体大小优化 */
  .destination-name,
  .route-name {
    font-size: 1.8rem;
  }
}

.route-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
}

.route-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}

.route-card:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4682b4, #2e8b57, #4682b4);
  border-radius: 15px 15px 0 0;
  animation: gradient-shift 3s ease infinite;
}

.route-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
}

.route-card:hover .route-image {
  transform: scale(1.1);
}

.route-info {
  padding: 20px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.route-card:hover .route-info {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95));
}

.route-name {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.route-card:hover .route-name {
  color: #4682b4;
  transform: translateY(-2px);
}

.route-rating {
  font-size: 0.9rem;
  color: #ff9800;
  transition: all 0.3s ease;
}

.route-card:hover .route-rating {
  transform: scale(1.1);
  text-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
  animation: pulse 1s ease infinite;
}

.route-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.route-card:hover .route-description {
  color: #333;
  opacity: 1;
  transform: translateY(2px);
}

.route-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.route-days {
  color: #666;
  transition: all 0.3s ease;
}

.route-card:hover .route-days {
  color: #666;
  transform: scale(1.05);
}

.route-price {
  font-weight: bold;
  color: #2e8b57;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
}

.route-card:hover .route-price {
  color: #4682b4;
  transform: scale(1.1);
  text-shadow: 0 2px 4px rgba(70, 130, 180, 0.3);
}

.route-card:hover .route-price::after {
  content: '起';
  font-size: 0.8rem;
  margin-left: 2px;
  animation: fadeIn 0.5s ease;
}

/* 新增动画关键帧 */
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

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes underline-expand {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 滚动动画样式 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  visibility: hidden;
}

.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}

/* 交错动画延迟 */
.destination-card.animate-on-scroll {
  transition-delay: 0.1s;
}

.feature-card.animate-on-scroll {
  transition-delay: 0.1s;
}

.route-card.animate-on-scroll {
  transition-delay: 0.1s;
}

/* 特殊元素的滚动动画 */
.section-title {
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.6s ease;
}

.animate-on-scroll.animated .section-title {
  opacity: 1;
  transform: translateY(0);
}

.section-subtitle {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.animate-on-scroll.animated .section-subtitle {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel {
    height: 400px;
  }

  .slide-title {
    font-size: 2.5rem;
  }

  .slide-description {
    font-size: 1.2rem;
  }

  .explore-btn {
    padding: 12px 25px;
    font-size: 1rem;
  }

  .destinations-grid,
  .routes-grid {
    grid-template-columns: 1fr;
  }

  .feature-nav {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 响应式滚动动画调整 */
  .animate-on-scroll {
    transform: translateY(20px);
  }
  
  .section-title {
    transform: translateY(-15px);
  }
  
  .section-subtitle {
    transform: translateY(15px);
  }
}
</style>
