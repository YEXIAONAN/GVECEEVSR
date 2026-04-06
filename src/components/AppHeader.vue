<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="brand">
        <p class="brand__tag">广西职教高考志愿模拟推荐</p>
        <p class="brand__author">Powered By Waiting</p>
      </div>
      <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-line-strong);
}

.app-header__inner {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.brand {
  min-width: 0;
}

.brand__tag {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.35;
}

.brand__author {
  margin: 3px 0 0;
  font-size: 0.72rem;
  color: var(--color-subtle);
  letter-spacing: 0.03em;
}

.nav {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 30px;
  padding: 0 9px;
  border-radius: 8px;
  border: 1px solid var(--color-line);
  color: var(--color-subtle);
  font-size: 0.8rem;
  background: #fff;
}

.nav a.router-link-exact-active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  font-weight: 600;
}

@media (min-width: 768px) {
  .app-header__inner {
    padding-top: 11px;
    padding-bottom: 11px;
  }
}
</style>
