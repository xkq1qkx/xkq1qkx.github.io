---
layout: default
title: "Gallery"
permalink: /gallery/
author_profile: false
zhihu_style: true
images:
  - image_path: /images/gallery_img/gallery_001.jpg
    title: "sea_01"
  - image_path: /images/gallery_img/gallery_002.jpg
    title: "sea_02"
  - image_path: /images/gallery_img/gallery_003.jpg
    title: "snow_01"
  - image_path: /images/gallery_img/gallery_004.jpg
    title: "mountain_01"
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