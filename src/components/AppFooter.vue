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
  background: var(--color-surface);
}

.app-footer__inner {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 11px 12px 12px;
}

p {
  margin: 0;
  font-size: 0.73rem;
  color: var(--color-subtle);
  line-height: 1.58;
}

.author {
  margin-top: 4px;
  letter-spacing: 0.02em;
}
</style>
