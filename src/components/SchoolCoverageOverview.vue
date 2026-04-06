<script setup>
defineProps({
  coverage: {
    type: Object,
    required: true
  },
  summary: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <section class="coverage">
    <h2>院校覆盖概览</h2>
    <p class="intro">先看当前数据覆盖范围，再看冲稳保推荐。这样即使常规推荐较少，也不会误判为“系统无数据”。</p>

    <dl class="stats">
      <div>
        <dt>已收录学校</dt>
        <dd>{{ coverage.totalSchoolCount }} 所</dd>
      </div>
      <div>
        <dt>已收录专业</dt>
        <dd>{{ coverage.totalMajorCount }} 项</dd>
      </div>
      <div>
        <dt>可分差推荐</dt>
        <dd>{{ coverage.calculableMajorCount }} 项</dd>
      </div>
      <div>
        <dt>仅计划参考</dt>
        <dd>{{ coverage.referenceOnlyMajorCount }} 项</dd>
      </div>
    </dl>

    <p v-if="summary.fallbackMessage" class="fallback">
      {{ summary.fallbackMessage }}
    </p>
  </section>
</template>

<style scoped>
.coverage {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  padding: 12px;
  background: var(--color-surface);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

h2 {
  margin: 0;
  font-size: 0.98rem;
}

.intro {
  margin: 6px 0 0;
  font-size: 0.8rem;
  line-height: 1.56;
  color: var(--color-subtle);
}

.stats {
  margin: 10px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stats div {
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: var(--color-surface-soft);
  padding: 8px 9px;
}

dt {
  font-size: 0.75rem;
  color: var(--color-subtle);
}

dd {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

.fallback {
  margin: 10px 0 0;
  border: 1px solid #e7d7be;
  border-radius: 8px;
  background: #fef8ef;
  color: #7a4b23;
  font-size: 0.8rem;
  line-height: 1.56;
  padding: 8px 9px;
}
</style>
