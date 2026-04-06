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

function createSchoolPool(records) {
  const poolMap = new Map()
  for (const record of records) {
    if (!poolMap.has(record.school)) {
      poolMap.set(record.school, {
        school: record.school,
        totalMajors: 0,
        calculableMajors: 0,
        referenceOnlyMajors: 0,
        majors: []
      })
    }
    const bucket = poolMap.get(record.school)
    const hasScore = Number.isFinite(toNumberOrNull(record.lastYearMinScore))

    bucket.totalMajors += 1
    if (hasScore) bucket.calculableMajors += 1
    if (!hasScore) bucket.referenceOnlyMajors += 1
    bucket.majors.push({
      id: record.id,
      major: record.major,
      lastYearMinScore: record.lastYearMinScore,
      admissionPlan: record.admissionPlan,
      scoreYear: record.scoreYear,
      planYear: record.planYear,
      dataStatus: record.dataStatus,
      note: record.note
    })
  }

  return [...poolMap.values()]
    .map((item) => ({
      ...item,
      majors: [...item.majors].sort((a, b) => String(a.major).localeCompare(String(b.major), 'zh-CN'))
    }))
    .sort((a, b) => {
      if (a.calculableMajors !== b.calculableMajors) return b.calculableMajors - a.calculableMajors
      if (a.totalMajors !== b.totalMajors) return b.totalMajors - a.totalMajors
      return String(a.school).localeCompare(String(b.school), 'zh-CN')
    })
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
    schoolCoverageSummary: {
      totalSchoolCount: 0,
      totalMajorCount: 0,
      calculableMajorCount: 0,
      referenceOnlyMajorCount: 0,
      matchedSchoolCount: 0,
      schoolPool: []
    },
    summary: {
      score: numericScore,
      matchedCount: 0,
      regularRecommendedCount: 0,
      hasRegularRecommendation: false,
      fallbackMessage: '',
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
  const schoolPool = createSchoolPool(scopedRecords)
  const calculableCount = scopedRecords.filter((record) =>
    Number.isFinite(toNumberOrNull(record.lastYearMinScore))
  ).length

  result.schoolCoverageSummary = {
    totalSchoolCount: new Set(scopedRecords.map((item) => item.school)).size,
    totalMajorCount: scopedRecords.length,
    calculableMajorCount: calculableCount,
    referenceOnlyMajorCount: scopedRecords.length - calculableCount,
    matchedSchoolCount: 0,
    schoolPool
  }

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
    result.summary.fallbackMessage = '未输入有效分数时，仅展示院校与专业池及公开计划信息。'
    result.summary.hasRegularRecommendation = false
    result.summary.regularRecommendedCount = 0
    result.schoolCoverageSummary.matchedSchoolCount = new Set(
      referenceOnly.map((item) => item.school)
    ).size
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
  result.summary.regularRecommendedCount =
    result.rushList.length + result.steadyList.length + result.safeList.length
  result.summary.hasRegularRecommendation = result.summary.regularRecommendedCount > 0
  result.summary.matchedCount =
    result.rushList.length +
    result.steadyList.length +
    result.safeList.length +
    result.referenceOnlyList.length
  result.schoolCoverageSummary.matchedSchoolCount = new Set(
    [
      ...result.rushList.map((item) => item.school),
      ...result.steadyList.map((item) => item.school),
      ...result.safeList.map((item) => item.school),
      ...result.referenceOnlyList.map((item) => item.school)
    ].filter(Boolean)
  ).size

  if (!result.summary.hasRegularRecommendation) {
    if (result.schoolCoverageSummary.calculableMajorCount === 0) {
      result.summary.fallbackMessage =
        '当前命中院校已有专业池，但多数专业暂无公开最低分，暂无法形成常规冲稳保推荐。请先参考“仅计划参考”和“学校概览”模块。'
    } else if (highRiskList.length > 0) {
      result.summary.fallbackMessage =
        '当前分数低于已公开最低分区间，常规冲稳保暂为空。建议优先查看学校概览与仅计划参考项，保守填报。'
    } else {
      result.summary.fallbackMessage =
        '当前条件下常规冲稳保项较少，请结合学校概览与官方最新公告综合判断。'
    }
  }

  if (includeHighRisk) {
    result.highRiskList = highRiskList.map((item) => ({
      ...item,
      recommendReason: '分差为负，当前属于高风险候选，不建议默认展示。'
    }))
  }

  return result
}

export default recommendByScore
