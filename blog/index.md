---
layout: page
title: Blog
permalink: /blog/
---

<h2>Latest Posts</h2>

<ul>
  {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.date | date: "%B %d, %Y" }}</p>
      <p>{{ post.excerpt }}</p>
      <a href="{{ post.url }}">Read more...</a>
    </li>
  {% endfor %}
</ul>