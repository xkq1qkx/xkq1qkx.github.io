---
layout: default
title: "Landscapes I Love"
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
  - image_path: /images/gallery_img/IMG_0681.jpeg
    title: "gallery_05"
  - image_path: /images/gallery_img/1162.JPG
    title: "gallery_06"
  - image_path: /images/gallery_img/IMG_4783.JPG
    title: "gallery_07"
  - image_path: /images/gallery_img/983efc7bfe2e4528bf0b660b7118e2aa.jpg
    title: "gallery_08"
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
