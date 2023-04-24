---
title: Posts
---

## Latest Posts

<div>
  {% for post in site.posts %}
    {% if post.draft == false %}
      <div class="post-info">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <div class="post-tags">{{post.tags | join: ", "}}</div>
        
      </div>
    {% endif %}
  {% endfor %}
</div>