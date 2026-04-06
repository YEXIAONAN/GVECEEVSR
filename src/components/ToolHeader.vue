<template>
  <header class="tool-header">
    <div>
      <h1>广西职教高考志愿模拟推荐</h1>
      <p>电子信息大类 · 对口技能类录取方式 · 静态前端版</p>
    </div>
    <div class="author-mark">Powered By Waiting</div>
  </header>
</template>

<style scoped>
.tool-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-main);
}

p {
  margin: 8px 0 0;
  font-size: 0.88rem;
  color: var(--text-sub);
}

.author-mark {
  padding: 6px 10px;
  font-size: 0.75rem;
  color: var(--text-sub);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface-secondary);
}
</style>
