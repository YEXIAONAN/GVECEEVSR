<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  categoryOptions: {
    type: Array,
    default: () => []
  },
  admissionTypeOptions: {
    type: Array,
    default: () => []
  },
  yearOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['simulate'])

const formState = reactive({
  categoryCode: props.categoryOptions[0]?.code ?? '',
  admissionTypeCode: props.admissionTypeOptions[0]?.code ?? '',
  score: '',
  userRank: '',
  targetYear: props.yearOptions[0] ?? 'all'
})

watch(
  () => props.yearOptions,
  (value) => {
    if (!value.includes(formState.targetYear)) {
      formState.targetYear = value[0] ?? 'all'
    }
  },
  { deep: true }
)

function onSubmit() {
  emit('simulate', {
    categoryCode: formState.categoryCode,
    admissionTypeCode: formState.admissionTypeCode,
    score: formState.score === '' ? null : Number(formState.score),
    userRank: formState.userRank === '' ? null : Number(formState.userRank),
    targetYear: formState.targetYear
  })
}
</script>

<template>
  <section class="panel">
    <h2>模拟参数</h2>
    <form class="form-grid" @submit.prevent="onSubmit">
      <label>
        <span>报考大类</span>
        <select v-model="formState.categoryCode" required>
          <option v-for="item in categoryOptions" :key="item.code" :value="item.code">
            {{ item.label }}
          </option>
        </select>
      </label>

      <label>
        <span>录取方式</span>
        <select v-model="formState.admissionTypeCode" required>
          <option v-for="item in admissionTypeOptions" :key="item.code" :value="item.code">
            {{ item.label }}
          </option>
        </select>
      </label>

      <label>
        <span>参考年份</span>
        <select v-model="formState.targetYear">
          <option value="all">全部年份</option>
          <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
      </label>

      <label>
        <span>考试分数（必填）</span>
        <input v-model.number="formState.score" type="number" min="0" step="1" required />
      </label>

      <label>
        <span>考生位次（选填）</span>
        <input v-model.number="formState.userRank" type="number" min="1" step="1" />
      </label>

      <div class="actions">
        <button type="submit">生成保守模拟结果</button>
      </div>
    </form>
    <p class="hint">
      未填写位次时，将尝试使用本地模型估算；模型缺失则仅按公开最低分/最低位次字段进行判断。
    </p>
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 12px;
}

label {
  display: grid;
  gap: 6px;
}

span {
  font-size: 0.86rem;
  color: var(--text-sub);
}

input,
select {
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0 10px;
  font-size: 0.92rem;
  color: var(--text-main);
  background: #fff;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 2px var(--brand-soft);
}

.actions {
  margin-top: 2px;
}

button {
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font-size: 0.94rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: var(--brand-strong);
}

.hint {
  margin: 12px 0 0;
  color: var(--text-sub);
  font-size: 0.82rem;
  line-height: 1.5;
}

@media (min-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .actions {
    grid-column: 1 / -1;
  }
}
</style>
