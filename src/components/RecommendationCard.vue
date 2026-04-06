<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  groupType: {
    type: String,
    required: true
  }
})

const RISK_LABEL = {
  rush: '冲',
  steady: '稳',
  safe: '保',
  referenceOnly: '仅计划参考'
}

function formatScore(value) {
  if (value === null || value === undefined) return '暂无公开数据'
  return `${value} 分`
}

function formatGap(value) {
  if (value === null || value === undefined) return '不参与常规分差判断'
  if (value > 0) return `+${value} 分`
  if (value < 0) return `${value} 分`
  return '0 分'
}

function sourceText(source) {
  if (!source) return '暂无公开数据'
  const year = source.year ? `${source.year} 年` : ''
  return `${source.organization || ''}${year ? ` · ${year}` : ''} · ${source.title || '来源待补充'}`
}
</script>

<template>
  <article :class="['card', `card-${groupType}`]">
    <div class="head">
      <div>
        <h4>{{ item.school }}</h4>
        <p>{{ item.major }}</p>
      </div>
      <span :class="['risk', `risk-${groupType}`]">{{ RISK_LABEL[groupType] || item.recommendType }}</span>
    </div>

    <dl class="meta">
      <div>
        <dt>去年最低分</dt>
        <dd>{{ formatScore(item.lastYearMinScore) }}</dd>
      </div>
      <div>
        <dt>当前分差</dt>
        <dd>{{ formatGap(item.scoreGap) }}</dd>
      </div>
      <div>
        <dt>计划人数</dt>
        <dd>{{ item.admissionPlan ?? '暂无公开数据' }}</dd>
      </div>
      <div>
        <dt>风险等级</dt>
        <dd>{{ RISK_LABEL[groupType] || '参考' }}</dd>
      </div>
    </dl>

    <p class="reason">{{ item.recommendReason }}</p>
    <p v-if="groupType === 'referenceOnly'" class="reference-hint">暂无公开最低分，仅可作计划参考。</p>
    <p v-if="item.note" class="source">{{ item.note }}</p>

    <p class="source">最低分来源：{{ sourceText(item.scoreSource) }}</p>
    <p v-if="item.scoreSource?.url" class="source-link">
      <a :href="item.scoreSource.url" target="_blank" rel="noopener noreferrer">查看最低分来源页面</a>
    </p>
    <p class="source">计划来源：{{ sourceText(item.planSource) }}</p>
    <p v-if="item.planSource?.url" class="source-link">
      <a :href="item.planSource.url" target="_blank" rel="noopener noreferrer">查看计划来源页面</a>
    </p>
  </article>
</template>

<style scoped>
.card {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 12px;
  background: #fff;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
}

.head p {
  margin: 4px 0 0;
  font-size: 0.84rem;
  color: var(--color-subtle);
}

.risk {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  font-size: 0.74rem;
  color: var(--color-subtle);
  background: var(--color-surface-soft);
}

.meta {
  margin: 10px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.meta div {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-line);
  border-radius: 8px;
  padding: 8px 9px;
}

dt {
  font-size: 0.73rem;
  color: var(--color-subtle);
}

dd {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--color-text);
}

.reason,
.source,
.reference-hint {
  margin: 9px 0 0;
  font-size: 0.8rem;
  color: var(--color-subtle);
  line-height: 1.58;
}

.reference-hint {
  color: #7d3a2d;
}

.source-link {
  margin: 5px 0 0;
  font-size: 0.78rem;
}

.source-link a {
  color: var(--color-primary);
}

.card-rush {
  border-color: var(--color-rush-line);
}

.card-steady {
  border-color: var(--color-steady-line);
}

.card-safe {
  border-color: var(--color-safe-line);
}

.card-referenceOnly {
  border-color: var(--color-ref-line);
}

.risk-rush {
  background: var(--color-rush-bg);
  border-color: var(--color-rush-line);
  color: var(--color-rush-text);
}

.risk-steady {
  background: var(--color-steady-bg);
  border-color: var(--color-steady-line);
  color: var(--color-steady-text);
}

.risk-safe {
  background: var(--color-safe-bg);
  border-color: var(--color-safe-line);
  color: var(--color-safe-text);
}

.risk-referenceOnly {
  background: var(--color-ref-bg);
  border-color: var(--color-ref-line);
  color: var(--color-ref-text);
}
</style>
