<template>
  <div class="panorama-container">
    <!-- 根据URL类型选择不同的显示方式 -->
    <template v-if="is720yunUrl">
      <!-- 720yun全景使用iframe嵌入 -->
      <iframe 
        :src="imageUrl" 
        class="panorama-iframe" 
        frameborder="0" 
        allowfullscreen
      ></iframe>
    </template>
    <template v-else>
      <!-- 普通全景图片使用Pannellum -->
      <div ref="panoramaRef" class="panorama"></div>
      
      <!-- 控制按钮 -->
      <div class="panorama-controls" v-if="showControls">
        <button @click="toggleFullscreen" class="control-btn">
          全屏
        </button>
        <button @click="resetView" class="control-btn">
          重置
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'

// 组件属性
const props = defineProps({
  // 全景图片URL
  imageUrl: {
    type: String,
    default: 'https://picsum.photos/id/1036/1600/800'
  },
  // 是否显示控制按钮
  showControls: {
    type: Boolean,
    default: true
  },
  // 热点配置
  hotSpots: {
    type: Array,
    default: () => []
  }
})

// 计算属性：判断是否为720yun URL
const is720yunUrl = computed(() => {
  return props.imageUrl && props.imageUrl.includes('720yun.com')
})

const panoramaRef = ref(null)
let viewer = null

// 初始化全景查看器
const initPanorama = () => {
  if (!panoramaRef.value) return
  
  // 销毁已有查看器
  if (viewer) {
    viewer.destroy()
  }
  
  // 确保Pannellum已加载
  if (window.pannellum) {
    viewer = window.pannellum.viewer(panoramaRef.value, {
      type: 'equirectangular',  // 全景类型：球形全景
      panorama: props.imageUrl,  // 全景图片URL
      autoLoad: true,            // 自动加载
      showControls: true,        // 显示内置控制按钮
      mouseZoom: true,           // 允许鼠标缩放
      compass: true,             // 显示指南针
      hotSpots: props.hotSpots   // 热点配置
    })
  } else {
    console.error('Pannellum library not loaded')
  }
}

// 切换全屏
const toggleFullscreen = () => {
  if (viewer) {
    viewer.toggleFullscreen()
  }
}

// 重置视角
const resetView = () => {
  if (viewer) {
    viewer.lookAt(0, 0)  // 重置到初始视角
  }
}

// 监听图片URL变化
watch(() => props.imageUrl, () => {
  initPanorama()
})

// 组件挂载时初始化
onMounted(() => {
  // 动态加载Pannellum库
  const script = document.createElement('script')
  script.src = 'https://cdn.pannellum.org/2.5/pannellum.js'
  script.onload = () => {
    // 加载CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.pannellum.org/2.5/pannellum.css'
    document.head.appendChild(link)
    
    // 初始化全景查看器
    setTimeout(initPanorama, 100)
  }
  document.head.appendChild(script)
})

// 组件卸载时清理
onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<style scoped>
.panorama-container {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.panorama {
  width: 100%;
  height: 100%;
}

/* 720yun全景iframe */
.panorama-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.panorama-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.control-btn {
  background-color: rgba(46, 139, 87, 0.8);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.control-btn:hover {
  background-color: rgba(46, 139, 87, 1);
}
</style>