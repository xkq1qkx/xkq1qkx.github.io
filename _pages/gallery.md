---
layout: default
title: "Gallery"
permalink: /gallery/
author_profile: false  # 关键：移除个人信息侧边栏
zhihu_style: true
# 在这里管理图片
images:
  - image_path: /images/pku_red.jpg
    title: "PKU Red"
    description: "Autumn at Peking University"
  - image_path: /images/nus_logo.jpg
    title: "Singapore"
    description: "Memories from NUS internship"
  - image_path: /images/xkq_homepage.jpg
    title: "Portrait"
    description: "Self portrait"
---

<style>
/* 隐藏默认标题 */
.page__title { display: none; }
/* 让内容区域更宽，移除默认限制 */
.page__content { width: 100% !important; max-width: 1200px !important; margin: 0 auto; }

.gallery-container {
  padding: 40px 20px;
}

.gallery-intro {
  text-align: center;
  margin-bottom: 50px;
}
.gallery-intro h1 {
  font-size: 2.5rem;
  font-weight: 300; /* 细字体更有艺术感 */
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.gallery-intro p {
  color: #888;
  font-style: italic;
}

/* 网格布局 */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 自适应列宽 */
  gap: 20px;
}

/* 图片容器 */
.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #eee;
  aspect-ratio: 4/3; /* 统一图片比例，如果想要瀑布流需要用JS，CSS Grid这样最整齐 */
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: block;
}

/* 悬停遮罩 */
.item-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  text-align: center;
  padding: 20px;
}

.item-overlay h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.item-overlay p {
  margin: 0;
  font-size: 0.9rem;
  color: #ddd;
  transform: translateY(20px);
  transition: transform 0.3s ease 0.1s; /* 延迟一点点 */
}

/* 悬停交互 */
.gallery-item:hover img {
  transform: scale(1.1);
}
.gallery-item:hover .item-overlay {
  opacity: 1;
}
.gallery-item:hover h3, 
.gallery-item:hover p {
  transform: translateY(0);
}

</style>

<div class="gallery-container">
  <div class="gallery-intro">
    <h1>Visuals</h1>
    <p>Captured moments and scenery.</p>
  </div>

  <div class="gallery-grid">
    {% for img in page.images %}
      <div class="gallery-item">
        <a href="{{ img.image_path }}">
          <img src="{{ img.image_path }}" loading="lazy" alt="{{ img.title }}">
          <div class="item-overlay">
            <h3>{{ img.title }}</h3>
            {% if img.description %}<p>{{ img.description }}</p>{% endif %}
          </div>
        </a>
      </div>
    {% endfor %}
  </div>
</div>