import { RANK_ESTIMATE_RULES } from '../data/rankRules.js'

export const RANK_ESTIMATE_DEFAULTS = {
  majorCategory: 'electronic_information',
  admissionMode: 'counterpart_skills'
}

function toScoreNumber(score) {
  if (score === null || score === undefined || score === '') return null
  const numericScore = Number(score)
  if (Number.isNaN(numericScore)) return null
  return numericScore
}

function pickRule({ majorCategory, admissionMode, year, rules }) {
  const candidates = rules.filter(
    (rule) =>
      rule.enabled &&
      rule.majorCategory === majorCategory &&
      rule.admissionMode === admissionMode
  )

  if (!candidates.length) return null

  if (year !== null && year !== undefined) {
    const exact = candidates.find((rule) => Number(rule.year) === Number(year))
    if (exact) return exact
  }

  // 未传 year 或没有精确 year 时，优先最新年份规则
  return [...candidates].sort((a, b) => Number(b.year) - Number(a.year))[0]
}

function findSegment(rule, score) {
  if (!rule || !Array.isArray(rule.segments)) return null
  return (
    rule.segments.find(
      (segment) => Number(score) >= Number(segment.minScore) && Number(score) <= Number(segment.maxScore)
    ) || null
  )
}

function buildUnknownResult({ score, majorCategory, admissionMode, year, rule }) {
  const warning =
    rule?.disclaimer ||
    '仅基于预设规则估算，不代表官方一分一档，最终请以广西招生考试院及院校官方公布信息为准。'

  return {
    score,
    year: year ?? rule?.year ?? null,
    majorCategory,
    admissionMode,
    confidenceLevel: 'low',
    competitiveness: rule?.fallback?.competitiveness || '中等',
    estimatedRankText: rule?.fallback?.estimatedRankText || '参考位次（低可信）：暂无可用估算区间',
    note:
      rule?.fallback?.note ||
      '当前分数未命中估算区间，建议优先参考院校官方公布的最低分和招生计划。',
    warning,
    segmentLabel: null,
    estimatedRankRange: null,
    ruleId: rule?.id || null
  }
}

/**
 * 低可信位次估算（保守宽区间）
 *
 * @param {Object} params
 * @param {number|string} params.score
 * @param {string} [params.majorCategory='electronic_information']
 * @param {string} [params.admissionMode='counterpart_skills']
 * @param {number} [params.year]
 * @param {Array} [params.rules=RANK_ESTIMATE_RULES]
 * @returns {{
 *   score: number|null,
 *   year: number|null,
 *   majorCategory: string,
 *   admissionMode: string,
 *   confidenceLevel: string,
 *   competitiveness: string,
 *   estimatedRankText: string,
 *   note: string,
 *   warning: string,
 *   segmentLabel: string|null,
 *   estimatedRankRange: [number, number]|null,
 *   ruleId: string|null
 * }}
 */
export function estimateRank({
  score,
  majorCategory = RANK_ESTIMATE_DEFAULTS.majorCategory,
  admissionMode = RANK_ESTIMATE_DEFAULTS.admissionMode,
  year = null,
  rules = RANK_ESTIMATE_RULES
} = {}) {
  const numericScore = toScoreNumber(score)
  const rule = pickRule({ majorCategory, admissionMode, year, rules })

  if (!rule || numericScore === null) {
    return buildUnknownResult({
      score: numericScore,
      majorCategory,
      admissionMode,
      year,
      rule
    })
  }

  const minScore = Number(rule.scoreRange?.min ?? 0)
  const maxScore = Number(rule.scoreRange?.max ?? 500)
  if (numericScore < minScore || numericScore > maxScore) {
    return buildUnknownResult({
      score: numericScore,
      majorCategory,
      admissionMode,
      year,
      rule
    })
  }

  const segment = findSegment(rule, numericScore)
  if (!segment) {
    return buildUnknownResult({
      score: numericScore,
      majorCategory,
      admissionMode,
      year,
      rule
    })
  }

  const [rankStart, rankEnd] = segment.rankRange

  return {
    score: numericScore,
    year: Number(rule.year),
    majorCategory,
    admissionMode,
    confidenceLevel: rule.confidenceLevel || 'low',
    competitiveness: segment.competitiveness,
    estimatedRankText: `参考位次（低可信）：${segment.label}（约 ${rankStart}-${rankEnd}）`,
    note: `基于 ${rule.year} 年预设宽区间规则做保守估算，不提供精确名次。`,
    warning: rule.disclaimer,
    segmentLabel: segment.label,
    estimatedRankRange: [rankStart, rankEnd],
    ruleId: rule.id
  }
}

export default estimateRank
