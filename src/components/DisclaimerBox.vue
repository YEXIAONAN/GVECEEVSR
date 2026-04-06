<template>
  <section class="disclaimer-box">
    <h3>免责声明与数据说明</h3>
    <ul>
      <li>本页面为志愿模拟参考工具，不是官方志愿填报系统。</li>
      <li>参考位次（低可信）仅基于预设规则估算，不代表官方一分一档。</li>
      <li>推荐结果不构成录取承诺，最终请以广西招生考试院及院校官方公布信息为准。</li>
      <li>缺失字段将显示“暂无公开数据”，不做推测性补填。</li>
    </ul>
  </section>
</template>

<style scoped>
.disclaimer-box {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  padding: 12px;
  background: var(--color-surface-soft);
}

h3 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
}

ul {
  margin: 9px 0 0;
  padding-left: 16px;
}

li {
  font-size: 0.83rem;
  color: var(--color-subtle);
  line-height: 1.62;
}
</style>
