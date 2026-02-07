---
layout: default
title: "Blog"
permalink: /blog/
author_profile: false
zhihu_style: true
---

<div class="zhihu-list">
  {% for post in site.posts %}
    <div class="zhihu-post-item">
      <h2 class="post-title">
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h2>
      <div class="post-meta">
        <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
      </div>
      <div class="post-excerpt">
        {{ post.excerpt | strip_html | truncate: 120 }}
        <a href="{{ post.url | relative_url }}" class="read-more">阅读全文 &rarr;</a>
      </div>
    </div>
  {% endfor %}
</div>