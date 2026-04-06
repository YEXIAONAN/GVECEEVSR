<script setup>
defineProps({
  statements: {
    type: Array,
    default: () => []
  },
  fieldGuide: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="panel">
    <h2>使用声明</h2>
    <ul>
      <li v-for="text in statements" :key="text">{{ text }}</li>
    </ul>

    <h3>数据维护约束</h3>
    <ul>
      <li v-for="text in fieldGuide" :key="text">{{ text }}</li>
    </ul>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #fff;
  padding: 14px 14px 12px;
}

h2 {
  margin: 0;
  font-size: 1rem;
}

h3 {
  margin: 12px 0 0;
  font-size: 0.92rem;
}

ul {
  margin: 8px 0 0;
  padding-left: 18px;
  color: var(--text-sub);
  font-size: 0.88rem;
  line-height: 1.6;
}
</style>
