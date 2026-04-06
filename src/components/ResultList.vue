<script setup>
import { formatDateTime, formatNullable, formatNumber } from '../utils/format'

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  },
  runMeta: {
    type: Object,
    default: null
  },
  datasetMeta: {
    type: Object,
    default: null
  }
})

function levelClass(decisionCode) {
  if (decisionCode === 'stable') return 'level-stable'
  if (decisionCode === 'balanced') return 'level-balanced'
  if (decisionCode === 'cautious') return 'level-cautious'
  if (decisionCode === 'risky') return 'level-risky'
  return 'level-pending'
}
</script>

<template>
  <section class="panel">
    <h2>模拟结果（学校 + 专业）</h2>

    <div v-if="!runMeta" class="empty">输入分数后生成结果。</div>

    <template v-else>
      <div class="meta">
        <p>生成时间：{{ formatDateTime(runMeta.generatedAt) }}</p>
        <p>
          位次处理：
          {{
            runMeta.rankResult.estimatedRank
              ? `约第 ${formatNumber(runMeta.rankResult.estimatedRank)} 位（${runMeta.rankResult.note}）`
              : runMeta.rankResult.note
          }}
        </p>
        <p>数据版本：{{ datasetMeta?.version }}（更新于 {{ datasetMeta?.lastUpdated }}）</p>
      </div>

      <div v-if="results.length === 0" class="empty">当前筛选范围内没有可展示条目。</div>

      <article v-for="item in results" :key="item.id" class="result-card">
        <div class="result-title">
          <div>
            <h3>{{ item.schoolName }}</h3>
            <p>{{ item.majorName }}</p>
          </div>
          <span class="level-tag" :class="levelClass(item.decisionCode)">{{ item.decisionLabel }}</span>
        </div>

        <dl class="metrics">
          <div>
            <dt>录取年份</dt>
            <dd>{{ item.admissionYear }}</dd>
          </div>
          <div>
            <dt>最低分</dt>
            <dd>{{ formatNullable(item.minScore) }}</dd>
          </div>
          <div>
            <dt>最低位次</dt>
            <dd>{{ item.minRank ? `第 ${formatNumber(item.minRank)} 位` : '暂无公开数据' }}</dd>
          </div>
          <div>
            <dt>计划人数</dt>
            <dd>{{ formatNullable(item.planCount) }}</dd>
          </div>
        </dl>

        <ul class="reasons">
          <li v-for="reason in item.reasons" :key="reason">{{ reason }}</li>
        </ul>

        <p class="source">
          来源：{{ formatNullable(item.sourceLabel) }}（{{ formatNullable(item.sourceYear) }}）
          <template v-if="item.sourceUrl">
            · <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer">链接</a>
          </template>
        </p>
        <p class="remark">备注：{{ formatNullable(item.remark) }}</p>
      </article>
    </template>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #fff;
  padding: 14px;
}

h2 {
  margin: 0;
  font-size: 1rem;
}

.meta {
  margin-top: 12px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface-secondary);
}

.meta p {
  margin: 0;
  font-size: 0.83rem;
  color: var(--text-sub);
  line-height: 1.55;
}

.meta p + p {
  margin-top: 4px;
}

.empty {
  margin-top: 12px;
  padding: 12px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-sub);
  font-size: 0.9rem;
}

.result-card {
  margin-top: 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
}

.result-title {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-main);
}

.result-title p {
  margin: 4px 0 0;
  font-size: 0.88rem;
  color: var(--text-sub);
}

.level-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  white-space: nowrap;
}

.level-stable {
  color: #0f5630;
  background: #e8f5ed;
}

.level-balanced {
  color: #125180;
  background: #e6f2fb;
}

.level-cautious {
  color: #7b5511;
  background: #fef4de;
}

.level-risky {
  color: #7f1d1d;
  background: #fdebec;
}

.level-pending {
  color: #4b5563;
  background: #edf1f4;
}

.metrics {
  margin: 10px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metrics div {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px;
}

dt {
  font-size: 0.75rem;
  color: var(--text-sub);
}

dd {
  margin: 4px 0 0;
  font-size: 0.88rem;
  color: var(--text-main);
}

.reasons {
  margin: 10px 0 0;
  padding-left: 18px;
  font-size: 0.84rem;
  color: var(--text-sub);
  line-height: 1.5;
}

.source,
.remark {
  margin: 8px 0 0;
  font-size: 0.82rem;
  color: var(--text-sub);
  line-height: 1.5;
}

a {
  color: var(--brand-strong);
}

@media (min-width: 900px) {
  .metrics {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
