<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  admissionModes: {
    type: Array,
    default: () => []
  },
  defaultAdmissionMode: {
    type: String,
    default: 'counterpart_skills'
  },
  majorCategoryName: {
    type: String,
    default: '电子信息大类'
  }
})

const emit = defineEmits(['submit', 'open-disclaimer'])

const formState = reactive({
  admissionMode: props.defaultAdmissionMode,
  score: ''
})

const currentModeName = computed(() => {
  const item = props.admissionModes.find((mode) => mode.code === formState.admissionMode)
  return item?.name || '对口技能类录取方式'
})

function handleSubmit() {
  if (formState.score === '' || formState.score === null || formState.score === undefined) return
  emit('submit', {
    score: Number(formState.score),
    admissionMode: formState.admissionMode,
    majorCategory: 'electronic_information'
  })
}
</script>

<template>
  <section class="score-form">
    <h2>开始测算</h2>
    <p class="intro">当前版本主做 {{ majorCategoryName }}，推荐以学校 + 专业为最小单位。</p>

    <label class="field">
      <span>录取方式</span>
      <select v-model="formState.admissionMode">
        <option v-for="mode in admissionModes" :key="mode.code" :value="mode.code">
          {{ mode.name }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>预估分数（0-500）</span>
      <input v-model.number="formState.score" type="number" min="0" max="500" placeholder="请输入分数" />
    </label>

    <p class="minor">当前选择：{{ currentModeName }}</p>

    <div class="actions">
      <button type="button" class="btn btn-primary" @click="handleSubmit">开始测算</button>
      <button type="button" class="btn btn-plain" @click="$emit('open-disclaimer')">查看免责声明</button>
    </div>
  </section>
</template>

<style scoped>
.score-form {
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-lg);
  padding: 14px;
  background: var(--color-surface);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

h2 {
  margin: 0;
  font-size: 1.02rem;
  letter-spacing: 0.01em;
}

.intro {
  margin: 7px 0 0;
  font-size: 0.84rem;
  color: var(--color-subtle);
  line-height: 1.62;
}

.field {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}

.field span {
  font-size: 0.83rem;
  color: var(--color-subtle);
}

select,
input {
  width: 100%;
  height: 44px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  font-size: 0.93rem;
  color: var(--color-text);
  background: #fff;
}

select:focus,
input:focus {
  outline: none;
  border-color: #8ea3b7;
  box-shadow: 0 0 0 3px rgba(43, 79, 112, 0.12);
}

.minor {
  margin: 10px 0 0;
  font-size: 0.78rem;
  color: var(--color-subtle);
}

.actions {
  margin-top: 13px;
  display: grid;
  gap: 8px;
}

.btn {
  height: 44px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-line);
  font-size: 0.93rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.btn-primary {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.btn-plain {
  background: #fff;
  color: var(--color-subtle);
}

.btn-primary:active {
  background: var(--color-primary-press);
}

.btn-plain:active {
  background: var(--color-surface-soft);
}
</style>
