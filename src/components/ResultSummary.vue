<script setup>
const props = defineProps({
  query: {
    type: Object,
    required: true
  },
  rankEstimate: {
    type: Object,
    required: true
  },
  summary: {
    type: Object,
    required: true
  },
  admissionModeLabel: {
    type: String,
    default: '对口技能类录取方式'
  }
})
</script>

<template>
  <section class="summary">
    <h2>当前测算摘要</h2>
    <p class="mode">{{ admissionModeLabel }}</p>

    <div class="score-line">
      <p class="score-value">{{ query.score }}<span>分</span></p>
      <div class="score-meta">
        <p>竞争力参考：{{ rankEstimate.competitiveness }}</p>
        <p>常规冲稳保：{{ summary.regularRecommendedCount }} 项</p>
        <p>已命中专业：{{ summary.matchedCount }} 项</p>
      </div>
    </div>

    <section class="rank-box">
      <p class="rank-title">参考位次（低可信）</p>
      <p class="rank-text">{{ rankEstimate.estimatedRankText }}</p>
      <p class="rank-note">{{ rankEstimate.note }}</p>
      <p class="rank-warning">{{ rankEstimate.warning }}</p>
    </section>
  </section>
</template>

<style scoped>
.summary {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 16px;
  background: var(--color-surface);
}

h2 {
  margin: 0;
  font-size: 1.02rem;
}

.mode {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: var(--color-subtle);
}

.score-line {
  margin-top: 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--color-line);
  border-radius: 10px;
  padding: 10px;
  background: var(--color-surface-soft);
}

.score-value {
  margin: 0;
  font-size: 2rem;
  line-height: 1;
  color: var(--color-primary);
  font-weight: 700;
}

.score-value span {
  margin-left: 3px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-subtle-strong);
}

.score-meta {
  display: grid;
  gap: 3px;
}

.score-meta p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-subtle-strong);
}

.rank-box {
  margin-top: 10px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 10px 11px;
  background: #fff;
}

.rank-title {
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-subtle);
}

.rank-text {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--color-text);
  font-weight: 600;
  line-height: 1.45;
}

.rank-note,
.rank-warning {
  margin: 6px 0 0;
  font-size: 0.76rem;
  color: var(--color-subtle);
  line-height: 1.5;
}

.rank-warning {
  color: #7f4b37;
}

@media (max-width: 560px) {
  .score-line {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .score-value {
    font-size: 1.8rem;
  }
}
</style>
