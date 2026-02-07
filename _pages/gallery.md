---
layout: default
title: "Gallery"
permalink: /gallery/
author_profile: true
# 在这里管理你的图片，添加新图片只需在下面增加一行
images:
  - image_path: /images/pku_red.jpg
    title: "Peking University - Campus"
  - image_path: /images/nus_logo.jpg
    title: "NUS Internship"
  # 复制上面的格式添加更多图片...
---

# 📷 Gallery

风景

<style>
/* 画廊容器 */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

/* 单个图片卡片 */
.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 1 / 1; /* 强制正方形，如果想保持原图比例可去掉这行 */
  background: #f0f0f0;
}

/* 鼠标悬停效果 */
.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}

/* 图片样式 */
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：裁剪图片以填满方框，保持整齐 */
  display: block;
  transition: transform 0.5s ease;
}

.gallery-item:hover img {
  transform: scale(1.05); /* 悬停时图片轻微放大 */
}

/* 标题遮罩层 */
.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
  padding: 10px;
  padding-top: 20px;
  font-size: 0.9rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-caption {
  opacity: 1;
}
</style>

<div class="gallery-grid">
  {% for img in page.images %}
    <div class="gallery-item">
      <a href="{{ img.image_path }}" title="{{ img.title }}">
        <img src="{{ img.image_path }}" alt="{{ img.title }}">
        {% if img.title %}
          <div class="gallery-caption">{{ img.title }}</div>
        {% endif %}
      </a>
    </div>
  {% endfor %}
</div>