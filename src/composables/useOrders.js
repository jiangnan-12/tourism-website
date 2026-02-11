import { ref, computed } from 'vue'

// 订单管理
export function useOrders() {
  const orders = ref([])

  // 加载订单
  const loadOrders = () => {
    orders.value = JSON.parse(localStorage.getItem('orders')) || []
  }

  // 添加订单
  const addOrder = (order) => {
    orders.value.push(order)
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  // 获取订单总数
  const totalOrders = computed(() => {
    return orders.value.length
  })

  // 获取用户的订单（按时间倒序）
  const userOrders = computed(() => {
    return [...orders.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  // 获取订单详情
  const getOrderById = (orderId) => {
    return orders.value.find(order => order.id === orderId)
  }

  // 删除订单
  const deleteOrder = (orderId) => {
    orders.value = orders.value.filter(order => order.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  // 初始化加载订单
  loadOrders()

  return {
    orders,
    totalOrders,
    userOrders,
    loadOrders,
    addOrder,
    getOrderById,
    deleteOrder
  }
}
