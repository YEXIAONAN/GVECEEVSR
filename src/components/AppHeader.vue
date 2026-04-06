<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="brand">
        <p class="brand__title">广西职教高考志愿模拟推荐</p>
        <p class="brand__subline">
          电子信息大类 · 对口技能类
          <span class="dot">·</span>
          <span class="brand__author">Powered By Waiting</span>
        </p>
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
  z-index: 40;
  background: rgba(245, 247, 250, 0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--color-line-strong);
}

.app-header__inner {
  width: min(100%, var(--layout-max-width));
  margin: 0 auto;
  padding: 11px var(--layout-side-gap);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.brand {
  min-width: 0;
}

.brand__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.25;
  letter-spacing: 0.01em;
}

.brand__subline {
  margin: 4px 0 0;
  font-size: 0.78rem;
  color: var(--color-subtle);
  line-height: 1.4;
}

.dot {
  margin: 0 4px;
}

.brand__author {
  color: var(--color-subtle-strong);
  letter-spacing: 0.02em;
}

.nav {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  padding-top: 2px;
}

.nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-line);
  color: var(--color-subtle-strong);
  font-size: 0.84rem;
  background: #fff;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.nav a.router-link-exact-active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  font-weight: 600;
}

@media (max-width: 767px) {
  .app-header__inner {
    align-items: center;
    gap: 10px;
  }

  .brand__title {
    font-size: 0.94rem;
  }

  .brand__subline {
    font-size: 0.72rem;
  }

  .dot {
    display: none;
  }

  .brand__author {
    display: block;
    margin-top: 1px;
  }
}
</style>
