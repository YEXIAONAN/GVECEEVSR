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
  },
  hasResult: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'reset', 'open-disclaimer'])

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
    <h2>测算设置</h2>
    <p class="intro">当前版本主做 {{ majorCategoryName }}，推荐最小单位为“学校 + 专业”。</p>

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
    <p class="minor">技能类满分 500 分，建议输入估分或最近一次模拟分。</p>

    <div class="actions">
      <button type="button" class="btn btn-primary" @click="handleSubmit">开始测算</button>
      <button v-if="hasResult" type="button" class="btn btn-muted" @click="emit('reset')">重新测算</button>
      <button type="button" class="btn btn-plain" @click="emit('open-disclaimer')">查看免责声明</button>
    </div>
  </section>
</template>

<style scoped>
.score-form {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  padding: 16px;
  background: var(--color-surface);
}

h2 {
  margin: 0;
  font-size: 1.06rem;
  letter-spacing: 0.01em;
}

.intro {
  margin: 8px 0 0;
  font-size: 0.84rem;
  color: var(--color-subtle);
  line-height: 1.58;
}

.field {
  display: grid;
  gap: 6px;
  margin-top: 14px;
}

.field span {
  font-size: 0.8rem;
  color: var(--color-subtle-strong);
}

select,
input {
  width: 100%;
  height: 46px;
  border: 1px solid #ccd6e1;
  border-radius: var(--radius-sm);
  padding: 0 13px;
  font-size: 0.95rem;
  color: var(--color-text);
  background: #fff;
}

select:focus,
input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(79, 109, 138, 0.14);
}

.minor {
  margin: 10px 0 0;
  font-size: 0.77rem;
  color: var(--color-subtle);
}

.actions {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.btn {
  height: 45px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-line);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.btn-primary {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.btn-muted {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: #c7d5e4;
}

.btn-plain {
  background: #fff;
  color: var(--color-subtle-strong);
}

.btn-primary:active {
  background: var(--color-primary-press);
}

.btn-plain:active {
  background: var(--color-surface-soft);
}
</style>
