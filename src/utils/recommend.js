/**
 * 志愿推荐核心逻辑（专业维度）
 * 设计原则：
 * 1) 最小单位是“学校 + 专业”
 * 2) 不做按学校去重
 * 3) 逻辑保守且透明，全部基于可解释规则
 * 4) 缺失最低分数据单独归类为参考项
 */

export const DEFAULT_FILTERS = {
  majorCategory: 'electronic_information',
  admissionMode: 'counterpart_skills'
}

export const RECOMMEND_THRESHOLDS = {
  // 分差 = 用户分数 - 专业去年最低分
  rushMin: 0,
  rushMax: 8,
  steadyMin: 9,
  steadyMax: 20,
  safeMinExclusive: 20
}

export const RECOMMEND_REASONS = {
  rush: '分差较小，存在波动风险，建议作为冲档选择。',
  steady: '分差适中，具备一定竞争力，但仍需关注当年热度变化。',
  safe: '分差较大，偏保守，但不代表确定录取。',
  referenceOnly: '暂无公开最低分，仅可作计划参考。'
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isNaN(num) ? null : num
}

function isMatchRecord(record, filters) {
  return (
    record.majorCategory === filters.majorCategory &&
    record.admissionMode === filters.admissionMode
  )
}

function buildCommonItem(record) {
  return {
    id: record.id,
    school: record.school,
    major: record.major,
    majorCategory: record.majorCategory,
    admissionMode: record.admissionMode,
    scoreYear: record.scoreYear,
    lastYearMinScore: record.lastYearMinScore,
    planYear: record.planYear,
    admissionPlan: record.admissionPlan,
    scoreSource: record.scoreSource,
    planSource: record.planSource,
    dataStatus: record.dataStatus,
    note: record.note
  }
}

function classifyByGap(gap, thresholds) {
  if (gap < thresholds.rushMin) return 'highRisk'
  if (gap <= thresholds.rushMax) return 'rush'
  if (gap >= thresholds.steadyMin && gap <= thresholds.steadyMax) return 'steady'
  if (gap > thresholds.safeMinExclusive) return 'safe'
  return 'highRisk'
}

function sortRushList(a, b) {
  // 冲：分差从高到低（优先展示相对更接近可冲稳边界）
  return b.scoreGap - a.scoreGap
}

function sortSteadyList(a, b, center = 14.5) {
  // 稳：按“接近稳妥区间中心值”优先，再按分差从低到高
  const distA = Math.abs(a.scoreGap - center)
  const distB = Math.abs(b.scoreGap - center)
  if (distA !== distB) return distA - distB
  return a.scoreGap - b.scoreGap
}

function sortSafeList(a, b) {
  // 保：分差从低到高（优先更接近保守边界的项）
  return a.scoreGap - b.scoreGap
}

function sortReferenceOnlyList(a, b) {
  // 优先展示有计划数的数据，其次按计划数降序，再按学校名排序
  const aHasPlan = a.admissionPlan !== null && a.admissionPlan !== undefined
  const bHasPlan = b.admissionPlan !== null && b.admissionPlan !== undefined

  if (aHasPlan !== bHasPlan) return aHasPlan ? -1 : 1
  if (aHasPlan && bHasPlan && a.admissionPlan !== b.admissionPlan) {
    return b.admissionPlan - a.admissionPlan
  }
  return String(a.school).localeCompare(String(b.school), 'zh-CN')
}

/**
 * @param {Object} params
 * @param {Array} params.admissions - 逐专业招生数据（学校+专业粒度）
 * @param {number|string} params.score - 用户输入分数
 * @param {string} [params.majorCategory='electronic_information']
 * @param {string} [params.admissionMode='counterpart_skills']
 * @param {Object} [params.thresholds] - 可覆盖默认阈值
 * @param {boolean} [params.includeHighRisk=false] - 是否返回高风险列表（默认不展示）
 */
export function recommendByScore({
  admissions = [],
  score,
  majorCategory = DEFAULT_FILTERS.majorCategory,
  admissionMode = DEFAULT_FILTERS.admissionMode,
  thresholds = RECOMMEND_THRESHOLDS,
  includeHighRisk = false
} = {}) {
  const numericScore = toNumberOrNull(score)
  const filters = { majorCategory, admissionMode }

  const result = {
    rushList: [],
    steadyList: [],
    safeList: [],
    referenceOnlyList: [],
    summary: {
      score: numericScore,
      matchedCount: 0,
      riskDistribution: {
        rush: 0,
        steady: 0,
        safe: 0,
        referenceOnly: 0,
        hiddenHighRisk: 0
      },
      filteredMode: admissionMode,
      filteredCategory: majorCategory
    }
  }

  const highRiskList = []
  const scopedRecords = admissions.filter((record) => isMatchRecord(record, filters))

  if (numericScore === null) {
    const referenceOnly = scopedRecords.map((record) => ({
      ...buildCommonItem(record),
      scoreGap: null,
      recommendType: 'referenceOnly',
      recommendReason: RECOMMEND_REASONS.referenceOnly
    }))

    referenceOnly.sort(sortReferenceOnlyList)
    result.referenceOnlyList = referenceOnly
    result.summary.matchedCount = referenceOnly.length
    result.summary.riskDistribution.referenceOnly = referenceOnly.length
    return result
  }

  for (const record of scopedRecords) {
    const minScore = toNumberOrNull(record.lastYearMinScore)
    const base = buildCommonItem(record)

    if (minScore === null) {
      result.referenceOnlyList.push({
        ...base,
        scoreGap: null,
        recommendType: 'referenceOnly',
        recommendReason: RECOMMEND_REASONS.referenceOnly
      })
      continue
    }

    const scoreGap = numericScore - minScore
    const category = classifyByGap(scoreGap, thresholds)
    const item = {
      ...base,
      scoreGap,
      recommendType: category
    }

    if (category === 'rush') {
      result.rushList.push({ ...item, recommendReason: RECOMMEND_REASONS.rush })
      continue
    }
    if (category === 'steady') {
      result.steadyList.push({ ...item, recommendReason: RECOMMEND_REASONS.steady })
      continue
    }
    if (category === 'safe') {
      result.safeList.push({ ...item, recommendReason: RECOMMEND_REASONS.safe })
      continue
    }

    highRiskList.push(item)
  }

  result.rushList.sort(sortRushList)
  result.steadyList.sort(sortSteadyList)
  result.safeList.sort(sortSafeList)
  result.referenceOnlyList.sort(sortReferenceOnlyList)

  result.summary.riskDistribution.rush = result.rushList.length
  result.summary.riskDistribution.steady = result.steadyList.length
  result.summary.riskDistribution.safe = result.safeList.length
  result.summary.riskDistribution.referenceOnly = result.referenceOnlyList.length
  result.summary.riskDistribution.hiddenHighRisk = highRiskList.length
  result.summary.matchedCount =
    result.rushList.length +
    result.steadyList.length +
    result.safeList.length +
    result.referenceOnlyList.length

  if (includeHighRisk) {
    result.highRiskList = highRiskList.map((item) => ({
      ...item,
      recommendReason: '分差为负，当前属于高风险候选，不建议默认展示。'
    }))
  }

  return result
}

export default recommendByScore
