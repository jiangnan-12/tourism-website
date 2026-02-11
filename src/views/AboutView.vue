<script setup>
// 团队成员数据
const teamMembers = [
  {
    id: 1,
    name: '张三',
    position: 'CEO',
    image: 'https://picsum.photos/id/1005/200/200'
  },
  {
    id: 2,
    name: '李四',
    position: 'CTO',
    image: 'https://picsum.photos/id/1006/200/200'
  },
  {
    id: 3,
    name: '赵六',
    position: '设计师',
    image: 'https://picsum.photos/id/1008/200/200'
  }
]
</script>

<template>
  <div class="about-container">
    <!-- 关于我们头部 -->
    <div class="about-header">
      <h1 class="page-title">关于我们</h1>
      <p class="page-subtitle">即刻出发·旅游网，您的专业旅游服务平台</p>
    </div>
    
    <!-- 公司介绍 -->
    <section class="company-section">
      <div class="company-container">
        <div class="company-content">
          <h2 class="section-title">公司简介</h2>
          <p class="company-description">
            即刻出发·旅游网是一家专业的旅游服务平台，致力于为用户提供优质的旅游信息和服务。我们拥有丰富的旅游资源和专业的服务团队，为您的旅行保驾护航。
          </p>
          <p class="company-description">
            我们的使命是让旅游变得更加便捷、舒适和有趣。无论您是想探索壮丽的自然风光，还是感受深厚的历史文化，我们都能为您提供最合适的旅游方案。
          </p>
        </div>
        <div class="company-image">
          <img src="https://picsum.photos/id/1036/600/400" alt="公司团队" />
        </div>
      </div>
    </section>
    
    <!-- 我们的优势 -->
    <section class="advantages-section">
      <h2 class="section-title">我们的优势</h2>
      <div class="advantages-grid">
        <div class="advantage-card">
          <div class="advantage-icon">🏞️</div>
          <h3 class="advantage-title">丰富的旅游资源</h3>
          <p class="advantage-description">我们拥有全国范围内的旅游资源，涵盖各大热门景点和旅游线路。</p>
        </div>
        <div class="advantage-card">
          <div class="advantage-icon">👨‍💼</div>
          <h3 class="advantage-title">专业的服务团队</h3>
          <p class="advantage-description">我们的团队由一群热爱旅游的专业人士组成，为您提供贴心的服务。</p>
        </div>
        <div class="advantage-card">
          <div class="advantage-icon">💰</div>
          <h3 class="advantage-title">优惠的价格</h3>
          <p class="advantage-description">我们与各大景区和酒店合作，为您提供最优惠的价格和最优质的服务。</p>
        </div>
        <div class="advantage-card">
          <div class="advantage-icon">🛡️</div>
          <h3 class="advantage-title">安全保障</h3>
          <p class="advantage-description">我们为您的旅行提供全方位的安全保障，让您的旅行更加安心。</p>
        </div>
      </div>
    </section>
    
    <!-- 团队介绍 -->
    <section class="team-section">
      <h2 class="section-title">我们的团队</h2>
      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.id" class="team-card">
          <img :src="member.image" :alt="member.name" class="member-image" />
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-position">{{ member.position }}</p>
        </div>
      </div>
    </section>
    
    <!-- 联系我们 -->
    <section class="contact-section">
      <h2 class="section-title">联系我们</h2>
      <div class="contact-container">
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h3>公司地址</h3>
              <p>北京市朝阳区建国路88号一起去旅游大厦</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div class="contact-details">
              <h3>联系电话</h3>
              <p>400-123-4567</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div class="contact-details">
              <h3>电子邮箱</h3>
              <p>info@yiqiqu.com</p>
            </div>
          </div>
        </div>
        <div class="contact-form">
          <h3>在线留言</h3>
          <form>
            <div class="form-group">
              <input type="text" placeholder="您的姓名" class="form-input" />
            </div>
            <div class="form-group">
              <input type="email" placeholder="您的邮箱" class="form-input" />
            </div>
            <div class="form-group">
              <input type="tel" placeholder="您的电话" class="form-input" />
            </div>
            <div class="form-group">
              <textarea placeholder="您的留言" class="form-textarea"></textarea>
            </div>
            <button type="submit" class="submit-btn">提交留言</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
}

/* 公司介绍 */
.company-section {
  margin-bottom: 80px;
}

.company-container {
  display: flex;
  gap: 60px;
  align-items: center;
}

.company-content {
  flex: 1;
}

.company-image {
  flex: 1;
}

.company-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.company-description {
  color: #666;
  line-height: 1.8;
  margin-bottom: 20px;
}

/* 我们的优势 */
.advantages-section {
  margin-bottom: 80px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

/* 针对2880x1620高分辨率屏幕的优化 */
@media (min-width: 2560px) and (min-height: 1440px) {
  .about-container {
    padding: 60px 40px;
  }
  
  /* 优势网格优化 */
  .advantages-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    margin-top: 60px;
  }
  
  /* 团队网格优化 */
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-top: 60px;
  }
  
  /* 容器布局优化 */
  .company-container,
  .contact-container {
    gap: 100px;
  }
  
  /* 字体和间距优化 */
  .page-title {
    font-size: 3rem;
  }
  
  .page-subtitle {
    font-size: 1.4rem;
  }
  
  .section-title {
    font-size: 2.2rem;
    margin-bottom: 25px;
  }
  
  .company-description {
    font-size: 1.1rem;
    line-height: 1.9;
  }
  
  .advantage-card {
    padding: 40px;
  }
  
  .advantage-icon {
    font-size: 3.5rem;
  }
  
  .advantage-title {
    font-size: 1.5rem;
  }
  
  .advantage-description {
    font-size: 1.1rem;
    line-height: 1.8;
  }
  
  /* 团队成员优化 */
  .member-image {
    width: 180px;
    height: 180px;
  }
  
  .member-name {
    font-size: 1.3rem;
  }
  
  .member-position {
    font-size: 1rem;
  }
}

.advantage-card {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.advantage-card:hover {
  transform: translateY(-5px);
}

.advantage-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.advantage-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.advantage-description {
  color: #666;
  line-height: 1.6;
}

/* 团队介绍 */
.team-section {
  margin-bottom: 80px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.team-card {
  text-align: center;
}

.member-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-name {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #333;
}

.member-position {
  color: #666;
  font-size: 0.9rem;
}

/* 联系我们 */
.contact-section {
  margin-bottom: 80px;
}

.contact-container {
  display: flex;
  gap: 60px;
  margin-top: 50px;
}

.contact-info {
  flex: 1;
}

.contact-form {
  flex: 1;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.contact-icon {
  font-size: 2rem;
  color: #2e8b57;
  margin-top: 5px;
}

.contact-details h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #333;
}

.contact-details p {
  color: #666;
  line-height: 1.6;
}

.contact-form h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #2e8b57;
  box-shadow: 0 0 0 2px rgba(46, 139, 87, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #4682b4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-container,
  .contact-container {
    flex-direction: column;
  }

  .advantages-grid,
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .advantages-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>