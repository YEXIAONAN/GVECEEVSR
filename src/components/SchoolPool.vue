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
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  padding: 12px;
  background: var(--color-surface);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.head h2 {
  margin: 0;
  font-size: 0.98rem;
}

.head p {
  margin: 6px 0 0;
  font-size: 0.8rem;
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
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.school-item {
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

summary {
  list-style: none;
  cursor: pointer;
  padding: 10px;
  display: grid;
  gap: 4px;
}

summary::-webkit-details-marker {
  display: none;
}

.name {
  font-size: 0.88rem;
  color: var(--color-text);
  font-weight: 600;
}

.meta {
  font-size: 0.78rem;
  color: var(--color-subtle);
}

.major-list {
  margin: 0;
  padding: 0 10px 10px;
  list-style: none;
  display: grid;
  gap: 7px;
}

.major-list li {
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: var(--color-surface-soft);
  padding: 8px;
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
</style>
