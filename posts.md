---
title: Posts
layout: default
---

## Latest Posts

<div>
  {% for post in site.posts %}
    {% if post.draft == false %}
      <div class="post-info">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <p class="post-date">{{ post.date || date_to_string }}</p>
      </div>
    {% endif %}
  {% endfor %}
</div>