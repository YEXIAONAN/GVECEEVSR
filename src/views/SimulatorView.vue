<script setup>
import { computed, ref } from 'vue'
import ToolHeader from '../components/ToolHeader.vue'
import DeclarationPanel from '../components/DeclarationPanel.vue'
import SimulatorForm from '../components/SimulatorForm.vue'
import ResultList from '../components/ResultList.vue'
import { ADMISSION_DATASET_META, ADMISSION_RECORDS } from '../data/admissionRecords'
import { CATEGORY_OPTIONS, ADMISSION_TYPE_OPTIONS, TOOL_STATEMENTS, DATA_FIELD_GUIDE } from '../data/options'
import { RANK_MODELS } from '../data/rankModels'
import { predictRank } from '../services/rankPredictor'
import { recommendMajors } from '../services/recommender'

const results = ref([])
const runMeta = ref(null)

const yearOptions = computed(() => {
  const years = new Set(ADMISSION_RECORDS.map((item) => item.admissionYear))
  return [...years].sort((a, b) => b - a)
})

function handleSimulate(query) {
  const model = RANK_MODELS[query.categoryCode]
  const rankResult = predictRank({
    userRank: query.userRank,
    score: query.score,
    model
  })

  results.value = recommendMajors({
    records: ADMISSION_RECORDS,
    query,
    estimatedRank: rankResult.estimatedRank
  })

  runMeta.value = {
    generatedAt: new Date().toISOString(),
    rankResult
  }
}
</script>

<template>
  <main class="page">
    <div class="container">
      <ToolHeader />
      <DeclarationPanel :statements="TOOL_STATEMENTS" :field-guide="DATA_FIELD_GUIDE" />
      <SimulatorForm
        :category-options="CATEGORY_OPTIONS"
        :admission-type-options="ADMISSION_TYPE_OPTIONS"
        :year-options="yearOptions"
        @simulate="handleSimulate"
      />
      <ResultList :results="results" :run-meta="runMeta" :dataset-meta="ADMISSION_DATASET_META" />
    </div>
  </main>
</template>
