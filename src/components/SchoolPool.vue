<script setup>
function formatScore(value) {
  if (value === null || value === undefined) return '暂无公开最低分'
  return `${value} 分`
}

function formatPlan(value) {
  if (value === null || value === undefined) return '暂无公开计划'
  return `${value} 人`
}

defineProps({
  schoolPool: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="school-pool">
    <div class="head">
      <h2>学校概览</h2>
      <p>按院校查看当前已录入的电子信息专业，可展开查看每校专业池。</p>
    </div>

    <div v-if="schoolPool.length === 0" class="empty">当前筛选条件下暂无学校数据。</div>

    <div v-else class="list">
      <details v-for="school in schoolPool" :key="school.school" class="school-item">
        <summary>
          <span class="name">{{ school.school }}</span>
          <span class="meta">
            已录入 {{ school.totalMajors }} 专业 · 有最低分 {{ school.calculableMajors }} 项
          </span>
        </summary>

        <ul class="major-list">
          <li v-for="major in school.majors" :key="major.id">
            <p class="major-name">{{ major.major }}</p>
            <p class="major-meta">
              最低分：{{ formatScore(major.lastYearMinScore) }} · 计划：{{ formatPlan(major.admissionPlan) }}
            </p>
            <p v-if="major.note" class="major-note">{{ major.note }}</p>
          </li>
        </ul>
      </details>
    </div>
  </section>
</template>

<style scoped>
.school-pool {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 14px;
  background: var(--color-surface);
}

.head h2 {
  margin: 0;
  font-size: 1.02rem;
}

.head p {
  margin: 7px 0 0;
  font-size: 0.82rem;
  color: var(--color-subtle);
}

.empty {
  margin-top: 10px;
  border: 1px dashed var(--color-line);
  border-radius: 8px;
  padding: 9px;
  background: var(--color-surface-soft);
  color: var(--color-subtle);
  font-size: 0.8rem;
}

.list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.school-item {
  border: 1px solid var(--color-line);
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

summary {
  list-style: none;
  cursor: pointer;
  padding: 11px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

summary::-webkit-details-marker {
  display: none;
}

.name {
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 600;
}

.meta {
  font-size: 0.76rem;
  color: var(--color-subtle);
  text-align: right;
}

.major-list {
  margin: 0;
  padding: 0 12px 12px;
  list-style: none;
  display: grid;
  gap: 7px;
}

.major-list li {
  border: 1px solid var(--color-line);
  border-radius: 9px;
  background: var(--color-surface-soft);
  padding: 8px 9px;
}

.major-name {
  margin: 0;
  font-size: 0.84rem;
  color: var(--color-text);
}

.major-meta,
.major-note {
  margin: 4px 0 0;
  font-size: 0.76rem;
  color: var(--color-subtle);
  line-height: 1.5;
}

@media (max-width: 680px) {
  summary {
    display: grid;
    gap: 3px;
    align-items: start;
  }

  .meta {
    text-align: left;
  }
}
</style>
