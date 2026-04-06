<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p>本工具仅供模拟参考，最终请以广西招生考试院及院校官方公布信息为准。</p>
      <p class="author">Powered By Waiting · © {{ currentYear }}</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-line-strong);
  background: #f0f3f7;
}

.app-footer__inner {
  width: min(100%, var(--layout-max-width));
  margin: 0 auto;
  padding: 13px var(--layout-side-gap) 14px;
}

p {
  margin: 0;
  font-size: 0.76rem;
  color: var(--color-subtle);
  line-height: 1.58;
}

.author {
  margin-top: 5px;
  color: var(--color-subtle-strong);
  letter-spacing: 0.02em;
}
</style>
