---
layout: default
title: "Blog"
permalink: /blog/
author_profile: false
zhihu_style: true   <-- 添加这行
---

<style>
/* 隐藏默认的页面标题，我们自己写 */
.page__title { display: none; }

/* 页面容器样式 */
.blog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 顶部 Header */
.blog-header {
  text-align: center;
  margin-bottom: 60px;
}
.blog-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
}
.blog-header p {
  color: #666;
  font-size: 1.1rem;
}

/* 文章卡片 */
.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  border-color: #e0e0e0;
}

/* 文章标题 */
.post-title {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  font-weight: 600;
}
.post-title a {
  color: #222;
  text-decoration: none;
}
.post-title a:hover {
  color: #007bff; /* 你可以改成你喜欢的颜色 */
}

/* 元数据 (日期) */
.post-meta {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 摘要 */
.post-excerpt {
  color: #555;
  line-height: 1.6;
  font-size: 1rem;
}

/* 阅读更多按钮 */
.read-more {
  display: inline-block;
  margin-top: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #007bff;
  text-decoration: none;
}
.read-more:hover {
  text-decoration: underline;
}

</style>

<div class="blog-container">
  
  <div class="blog-header">
    <h1>Thinking & Writing</h1>
    <p>Thoughts, tutorials, and notes.</p>
  </div>

  {% for post in site.posts %}
    <div class="post-card">
      <div class="post-meta">
        {{ post.date | date: "%B %d, %Y" }}
      </div>
      <h2 class="post-title">
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h2>
      <div class="post-excerpt">
        {{ post.excerpt | strip_html | truncate: 150 }}
      </div>
      <a href="{{ post.url | relative_url }}" class="read-more">Read Article →</a>
    </div>
  {% endfor %}

</div>