---
layout: default
title: "Gallery"
permalink: /gallery/
author_profile: false
zhihu_style: true
images:
  - image_path: /images/pku_red.jpg
    title: "PKU Red"
  - image_path: /images/nus_logo.jpg
    title: "Singapore"
---

<div class="zhihu-gallery">
  {% for img in page.images %}
    <div class="gallery-card">
      <a href="{{ img.image_path }}" title="{{ img.title }}">
        <img src="{{ img.image_path }}" alt="{{ img.title }}" loading="lazy">
        {% if img.title %}
          <div class="caption">{{ img.title }}</div>
        {% endif %}
      </a>
    </div>
  {% endfor %}
</div>