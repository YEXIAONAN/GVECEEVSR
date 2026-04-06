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

const emit = defineEmits(['recalculate'])
</script>

<template>
  <section class="summary">
    <h2>测算结果摘要</h2>
    <dl class="grid">
      <div>
        <dt>输入分数</dt>
        <dd>{{ query.score }} 分</dd>
      </div>
      <div>
        <dt>录取方式</dt>
        <dd>{{ admissionModeLabel }}</dd>
      </div>
      <div>
        <dt>竞争力参考</dt>
        <dd>{{ rankEstimate.competitiveness }}</dd>
      </div>
      <div>
        <dt>匹配专业条目</dt>
        <dd>{{ summary.matchedCount }} 项</dd>
      </div>
    </dl>

    <div class="rank-box">
      <p class="rank-title">参考位次（低可信）</p>
      <p class="rank-text">{{ rankEstimate.estimatedRankText }}</p>
      <p class="rank-note">{{ rankEstimate.note }}</p>
      <p class="rank-warning">{{ rankEstimate.warning }}</p>
    </div>

    <button class="recalc-btn" type="button" @click="emit('recalculate')">重新测算</button>
  </section>
</template>

<style scoped>
.summary {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  padding: 12px;
  background: var(--color-surface);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

h2 {
  margin: 0;
  font-size: 1rem;
}

.grid {
  margin: 11px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.grid div {
  border: 1px solid var(--color-line);
  border-radius: 9px;
  padding: 8px 9px;
  background: var(--color-surface-soft);
}

dt {
  font-size: 0.75rem;
  color: var(--color-subtle);
}

dd {
  margin: 4px 0 0;
  font-size: 0.89rem;
  color: var(--color-text);
}

.rank-box {
  margin-top: 11px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 10px;
  background: #fff;
}

.rank-title {
  margin: 0;
  font-size: 0.79rem;
  color: var(--color-subtle);
}

.rank-text {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 600;
}

.rank-note,
.rank-warning {
  margin: 6px 0 0;
  font-size: 0.79rem;
  color: var(--color-subtle);
  line-height: 1.5;
}

.rank-warning {
  color: #7d3a2d;
}

.recalc-btn {
  margin-top: 11px;
  width: 100%;
  height: 42px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: #fff;
  font-size: 0.88rem;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recalc-btn:active {
  background: var(--color-surface-soft);
}
</style>
