---
layout: default
title: "Gallery"
permalink: /gallery/
author_profile: true
---

# 📷 Gallery

这里是一些风景摄影和生活瞬间。

<style>
.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.image-grid img {
  width: 32%; /* 一行三张图，可以根据需要改成 48% (两张) 或 100% (一张) */
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.2s;
}
.image-grid img:hover {
  transform: scale(1.05);
}
/* 手机端适配 */
@media screen and (max-width: 600px) {
  .image-grid img {
    width: 100%;
  }
}
</style>

<div class="image-grid">
  <img src="/images/pku_red.jpg" alt="PKU Campus">
  <img src="/images/xkq_homepage.jpg" alt="My Photo">
  <img src="/images/nus_logo.jpg" alt="NUS">
  </div>