<script setup>
import { computed, nextTick, ref } from 'vue'
import ScoreForm from '../components/ScoreForm.vue'
import ResultSummary from '../components/ResultSummary.vue'
import RecommendationGroup from '../components/RecommendationGroup.vue'
import DisclaimerBox from '../components/DisclaimerBox.vue'
import { ADMISSIONS } from '../data/admissions.js'
import { ADMISSION_MODES, MAJOR_CATEGORIES } from '../data/meta.js'
import { recommendByScore } from '../utils/recommend.js'
import { estimateRank } from '../utils/rankEstimate.js'

const runQuery = ref(null)
const recommendResult = ref(null)
const rankResult = ref(null)
const resultSection = ref(null)
const disclaimerSection = ref(null)
const formSection = ref(null)

const currentCategory = computed(() => MAJOR_CATEGORIES.find((item) => item.code === 'electronic_information'))

const modeLabelMap = computed(() =>
  Object.fromEntries(ADMISSION_MODES.map((item) => [item.code, item.name]))
)

function runSimulation(payload) {
  const score = Number(payload.score)
  const admissionMode = payload.admissionMode
  const majorCategory = 'electronic_information'

  runQuery.value = {
    score,
    admissionMode,
    majorCategory
  }

  recommendResult.value = recommendByScore({
    admissions: ADMISSIONS,
    score,
    majorCategory,
    admissionMode
  })

  rankResult.value = estimateRank({
    score,
    majorCategory,
    admissionMode,
    year: 2026
  })

  nextTick(() => {
    resultSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function jumpToDisclaimer() {
  disclaimerSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function resetSimulation() {
  runQuery.value = null
  recommendResult.value = null
  rankResult.value = null
  formSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="home-page">
    <section class="hero panel">
      <h1>广西职教高考志愿模拟推荐</h1>
      <p>面向广西职教高考考生的志愿辅助模拟工具，当前版本聚焦电子信息大类与对口技能类录取方式。</p>
      <p class="powered">Powered By Waiting</p>
    </section>

    <section ref="formSection" class="panel">
      <ScoreForm
        :admission-modes="ADMISSION_MODES"
        :default-admission-mode="ADMISSION_MODES[0]?.code || 'counterpart_skills'"
        :major-category-name="currentCategory?.name || '电子信息大类'"
        @submit="runSimulation"
        @open-disclaimer="jumpToDisclaimer"
      />
    </section>

    <section v-if="runQuery && recommendResult && rankResult" ref="resultSection" class="result-area">
      <ResultSummary
        :query="runQuery"
        :rank-estimate="rankResult"
        :summary="recommendResult.summary"
        :admission-mode-label="modeLabelMap[runQuery.admissionMode] || '对口技能类录取方式'"
        @recalculate="resetSimulation"
      />

      <RecommendationGroup
        title="冲档建议"
        description="分差 0-8，波动风险较大，建议少量填报。"
        group-type="rush"
        :items="recommendResult.rushList"
      />
      <RecommendationGroup
        title="稳妥建议"
        description="分差 9-20，竞争力相对更均衡，仍需关注当年热度变化。"
        group-type="steady"
        :items="recommendResult.steadyList"
      />
      <RecommendationGroup
        title="保底建议"
        description="分差大于 20，偏保守参考，不代表确定录取。"
        group-type="safe"
        :items="recommendResult.safeList"
      />
      <RecommendationGroup
        title="仅计划参考"
        description="暂无公开最低分，不能参与常规分差判断。"
        group-type="referenceOnly"
        :items="recommendResult.referenceOnlyList"
      />
    </section>

    <section ref="disclaimerSection" class="panel">
      <DisclaimerBox />
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: 13px;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.hero h1 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.hero p {
  margin: 7px 0 0;
  color: var(--color-subtle);
  font-size: 0.85rem;
  line-height: 1.62;
}

.powered {
  display: inline-flex;
  margin-top: 10px;
  padding: 4px 10px 5px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: var(--color-surface-soft);
  font-size: 0.73rem;
  color: var(--color-subtle);
  letter-spacing: 0.03em;
}

.result-area {
  display: grid;
  gap: 13px;
}
</style>
