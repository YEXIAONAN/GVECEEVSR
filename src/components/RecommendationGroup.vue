<script setup>
import RecommendationCard from './RecommendationCard.vue'

defineProps({
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
  }
})
</script>

<template>
  <section :class="['group', `group-${groupType}`]">
    <div class="group-head">
      <h3>{{ title }}</h3>
      <span>{{ items.length }} 项</span>
    </div>
    <p class="desc">{{ description }}</p>

    <div v-if="items.length === 0" class="empty">当前分组暂无条目。</div>

    <div v-else class="list">
      <RecommendationCard v-for="item in items" :key="item.id" :item="item" :group-type="groupType" />
    </div>
  </section>
</template>

<style scoped>
.group {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  padding: 12px;
  background: var(--color-surface);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.group-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 0.97rem;
}

.group-head span {
  font-size: 0.75rem;
  color: var(--color-subtle);
}

.desc {
  margin: 6px 0 0;
  color: var(--color-subtle);
  font-size: 0.8rem;
  line-height: 1.56;
}

.empty {
  margin-top: 10px;
  border: 1px dashed var(--color-line);
  border-radius: 9px;
  padding: 10px;
  font-size: 0.82rem;
  color: var(--color-subtle);
  background: var(--color-surface-soft);
}

.list {
  margin-top: 11px;
  display: grid;
  gap: 10px;
}

.group-rush {
  border-left: 4px solid var(--color-rush-line);
}

.group-steady {
  border-left: 4px solid var(--color-steady-line);
}

.group-safe {
  border-left: 4px solid var(--color-safe-line);
}

.group-referenceOnly {
  border-left: 4px solid var(--color-ref-line);
}
</style>
