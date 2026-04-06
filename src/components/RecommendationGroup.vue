<script setup>
import { computed } from 'vue'
import RecommendationCard from './RecommendationCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  groupType: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  emptyText: {
    type: String,
    default: '当前分组暂无条目。'
  }
})

const schoolNames = computed(() => [...new Set(props.items.map((item) => item.school))])
const schoolCoverageText = computed(() => {
  if (schoolNames.value.length <= 4) return schoolNames.value.join('、')
  return `${schoolNames.value.slice(0, 4).join('、')} 等`
})
</script>

<template>
  <section :class="['group', `group-${groupType}`]">
    <div class="group-head">
      <h3>{{ title }}</h3>
      <span class="count">{{ items.length }} 项</span>
    </div>
    <p class="desc">{{ description }}</p>
    <p v-if="items.length > 0" class="school-coverage">
      覆盖学校：{{ schoolNames.length }} 所（{{ schoolCoverageText }}）
    </p>

    <div v-if="items.length === 0" class="empty">{{ emptyText }}</div>

    <div v-else class="list">
      <RecommendationCard v-for="item in items" :key="item.id" :item="item" :group-type="groupType" />
    </div>
  </section>
</template>

<style scoped>
.group {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 14px;
  background: var(--color-surface);
}

.group-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 1rem;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 26px;
  padding: 0 10px;
  font-size: 0.76rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  color: var(--color-subtle-strong);
  background: var(--color-surface-soft);
}

.desc {
  margin: 6px 0 0;
  color: var(--color-subtle);
  font-size: 0.8rem;
  line-height: 1.56;
}

.school-coverage {
  margin: 6px 0 0;
  color: var(--color-subtle);
  font-size: 0.76rem;
  line-height: 1.5;
}

.empty {
  margin-top: 12px;
  border: 1px dashed var(--color-line);
  border-radius: 10px;
  padding: 12px;
  font-size: 0.82rem;
  color: var(--color-subtle);
  background: var(--color-surface-soft);
}

.list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.group-rush {
  border-top: 4px solid var(--color-rush-line);
}

.group-steady {
  border-top: 4px solid var(--color-steady-line);
}

.group-safe {
  border-top: 4px solid var(--color-safe-line);
}

.group-referenceOnly {
  border-top: 4px solid var(--color-ref-line);
}

@media (min-width: 1200px) {
  .list {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
