---
layout: default
title: "Blog"
permalink: /blog/
author_profile: true
---

# 📝 Blog Posts

在这里我会分享一些论文解读、技术笔记或是随笔。

{% for post in site.posts %}
  <div class="list__item">
    <article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">
      
      <h2 class="archive__item-title" itemprop="headline">
        <a href="{{ post.url | relative_url }}" rel="permalink">{{ post.title }}</a>
      </h2>
      
      <p class="page__meta">
        <i class="fa fa-clock-o" aria-hidden="true"></i> 
        {{ post.date | date: "%Y-%m-%d" }}
      </p>
      
      <div class="archive__item-excerpt" itemprop="description">
        <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
      </div>
      
    </article>
  </div>
{% endfor %}