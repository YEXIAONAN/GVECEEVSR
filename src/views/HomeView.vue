<script setup>
import { computed, nextTick, ref } from 'vue'
import ScoreForm from '../components/ScoreForm.vue'
import ResultSummary from '../components/ResultSummary.vue'
import SchoolCoverageOverview from '../components/SchoolCoverageOverview.vue'
import SchoolPool from '../components/SchoolPool.vue'
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
const workspaceSection = ref(null)

const currentCategory = computed(() => MAJOR_CATEGORIES.find((item) => item.code === 'electronic_information'))

const modeLabelMap = computed(() =>
  Object.fromEntries(ADMISSION_MODES.map((item) => [item.code, item.name]))
)

const regularGroupEmptyText = computed(() => {
  if (!recommendResult.value) return '当前分组暂无条目。'
  if (!recommendResult.value.summary.hasRegularRecommendation) {
    return '当前分数下暂无常规冲稳保条目，建议先查看“学校概览”和“仅计划参考”。'
  }
  return '当前分组暂无条目。'
})

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
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (!isDesktop) {
      resultSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function jumpToDisclaimer() {
  disclaimerSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function resetSimulation() {
  runQuery.value = null
  recommendResult.value = null
  rankResult.value = null
  workspaceSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-main panel">
        <h1>广西职教高考志愿模拟推荐</h1>
        <p class="hero-intro">
          面向广西职教高考考生的静态志愿辅助工具。当前版本聚焦
          {{ currentCategory?.name || '电子信息大类' }} 与对口技能类录取方式。
        </p>
        <div class="hero-actions">
          <button type="button" class="hero-link" @click="jumpToDisclaimer">查看免责声明与数据口径</button>
          <span class="hero-note">推荐仅供模拟参考，最终以官方公布为准。</span>
        </div>
      </div>
      <aside class="hero-side panel">
        <h2>使用说明</h2>
        <ul>
          <li>按“学校 + 专业”粒度推荐，同校可出现多个专业。</li>
          <li>优先展示有公开最低分的数据，缺失数据会明确标注。</li>
          <li>区位次仅作低可信宽区间估算，不代表官方一分一档。</li>
        </ul>
      </aside>
    </section>

    <section ref="workspaceSection" class="workspace">
      <aside class="left-pane">
        <div class="left-sticky">
          <ScoreForm
            :admission-modes="ADMISSION_MODES"
            :default-admission-mode="ADMISSION_MODES[0]?.code || 'counterpart_skills'"
            :major-category-name="currentCategory?.name || '电子信息大类'"
            :has-result="Boolean(runQuery && recommendResult && rankResult)"
            @submit="runSimulation"
            @reset="resetSimulation"
            @open-disclaimer="jumpToDisclaimer"
          />

          <ResultSummary
            v-if="runQuery && recommendResult && rankResult"
            :query="runQuery"
            :rank-estimate="rankResult"
            :summary="recommendResult.summary"
            :admission-mode-label="modeLabelMap[runQuery.admissionMode] || '对口技能类录取方式'"
          />
        </div>
      </aside>

      <section ref="resultSection" class="right-pane">
        <template v-if="runQuery && recommendResult && rankResult">
          <SchoolCoverageOverview
            :coverage="recommendResult.schoolCoverageSummary"
            :summary="recommendResult.summary"
          />

          <RecommendationGroup
            title="冲档建议"
            description="分差 0-8，波动风险较大，建议少量填报。"
            group-type="rush"
            :items="recommendResult.rushList"
            :empty-text="regularGroupEmptyText"
          />
          <RecommendationGroup
            title="稳妥建议"
            description="分差 9-20，竞争力相对更均衡，仍需关注当年热度变化。"
            group-type="steady"
            :items="recommendResult.steadyList"
            :empty-text="regularGroupEmptyText"
          />
          <RecommendationGroup
            title="保底建议"
            description="分差大于 20，偏保守参考，不代表确定录取。"
            group-type="safe"
            :items="recommendResult.safeList"
            :empty-text="regularGroupEmptyText"
          />
          <RecommendationGroup
            title="仅计划参考"
            description="这些专业已确认开设或有计划信息，但暂无公开最低分，不参与常规分差判断。"
            group-type="referenceOnly"
            :items="recommendResult.referenceOnlyList"
            empty-text="当前暂无仅计划参考项。"
          />

          <SchoolPool :school-pool="recommendResult.schoolCoverageSummary.schoolPool" />
        </template>
        <section v-else class="result-empty panel">
          <h2>等待测算</h2>
          <p>输入分数并点击“开始测算”后，右侧将展示院校覆盖概览、冲稳保分组和学校概览。</p>
          <p>当前工具范围：{{ currentCategory?.name || '电子信息大类' }} · 对口技能类录取方式。</p>
        </section>
      </section>
    </section>

    <section ref="disclaimerSection" class="panel panel-disclaimer">
      <DisclaimerBox />
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: 16px;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-lg);
  padding: 14px;
}

.hero {
  display: grid;
  gap: 12px;
}

.hero-main {
  display: grid;
  gap: 10px;
}

.hero-main h1 {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 0.01em;
  line-height: 1.32;
}

.hero-intro {
  margin: 0;
  color: var(--color-subtle);
  font-size: 0.9rem;
}

.hero-actions {
  display: grid;
  gap: 6px;
  align-items: center;
}

.hero-link {
  width: fit-content;
  border: 1px solid var(--color-line);
  background: #fff;
  color: var(--color-primary);
  border-radius: 8px;
  height: 34px;
  padding: 0 12px;
  font-size: 0.82rem;
  cursor: pointer;
}

.hero-note {
  color: var(--color-subtle);
  font-size: 0.79rem;
}

.hero-side h2 {
  margin: 0;
  font-size: 0.95rem;
}

.hero-side ul {
  margin: 8px 0 0;
  padding-left: 16px;
}

.hero-side li {
  color: var(--color-subtle);
  font-size: 0.82rem;
  line-height: 1.6;
}

.workspace {
  display: grid;
  gap: 14px;
}

.left-pane {
  min-width: 0;
}

.left-sticky {
  display: grid;
  gap: 12px;
}

.right-pane {
  min-width: 0;
  display: grid;
  gap: 12px;
}

.result-empty h2 {
  margin: 0;
  font-size: 1rem;
}

.result-empty p {
  margin: 8px 0 0;
  color: var(--color-subtle);
  font-size: 0.86rem;
}

.panel-disclaimer {
  background: var(--color-surface-soft);
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1.4fr 1fr;
    align-items: stretch;
  }
}

@media (min-width: 1024px) {
  .workspace {
    grid-template-columns: minmax(360px, 4fr) minmax(0, 8fr);
    align-items: start;
    gap: 16px;
  }

  .left-sticky {
    position: sticky;
    top: 86px;
  }

  .hero-main h1 {
    font-size: 1.58rem;
  }
}
</style>
