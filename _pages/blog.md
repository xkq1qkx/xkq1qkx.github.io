---
layout: default
title: "Blog"
permalink: /blog/
author_profile: true
---

# 📝 Blog Posts

Here I will share some papers, technical notes, or random thoughts.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <br>
      <small>{{ post.date | date: "%Y-%m-%d" }}</small>
      <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
    </li>
  {% endfor %}
</ul>
