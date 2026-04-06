const LEVEL_ORDER = {
  stable: 1,
  balanced: 2,
  cautious: 3,
  risky: 4,
  pending: 5
}

const LEVEL_LABEL = {
  stable: '稳妥',
  balanced: '可冲稳',
  cautious: '谨慎冲',
  risky: '高风险',
  pending: '待补数据'
}

function getYearBuffer(targetYear, recordYear) {
  if (!targetYear || targetYear === 'all') {
    return 8
  }

  const diff = Number(targetYear) - Number(recordYear)
  if (diff <= 0) {
    return 10
  }
  if (diff === 1) {
    return 8
  }
  return 6
}

function evaluateScore(score, minScore, buffer) {
  if (minScore === null || minScore === undefined) {
    return null
  }

  const conservativeThreshold = Number(minScore) + buffer
  const gap = Number(score) - conservativeThreshold

  if (gap >= 20) {
    return { level: 'stable', gap, threshold: conservativeThreshold }
  }
  if (gap >= 10) {
    return { level: 'balanced', gap, threshold: conservativeThreshold }
  }
  if (gap >= 0) {
    return { level: 'cautious', gap, threshold: conservativeThreshold }
  }
  return { level: 'risky', gap, threshold: conservativeThreshold }
}

function evaluateRank(estimatedRank, minRank) {
  if (estimatedRank === null || estimatedRank === undefined || minRank === null || minRank === undefined) {
    return null
  }

  const conservativeThreshold = Math.floor(Number(minRank) * 0.9)
  const gap = conservativeThreshold - Number(estimatedRank)

  if (gap >= 300) {
    return { level: 'stable', gap, threshold: conservativeThreshold }
  }
  if (gap >= 100) {
    return { level: 'balanced', gap, threshold: conservativeThreshold }
  }
  if (gap >= 0) {
    return { level: 'cautious', gap, threshold: conservativeThreshold }
  }
  return { level: 'risky', gap, threshold: conservativeThreshold }
}

function pickConservativeLevel(scoreResult, rankResult) {
  if (!scoreResult && !rankResult) {
    return 'pending'
  }
  if (!scoreResult) {
    return rankResult.level
  }
  if (!rankResult) {
    return scoreResult.level
  }
  return LEVEL_ORDER[scoreResult.level] >= LEVEL_ORDER[rankResult.level] ? scoreResult.level : rankResult.level
}

function buildReasons({ scoreResult, rankResult }) {
  const reasons = []

  if (scoreResult) {
    reasons.push(`按分数口径：与保守线差值 ${scoreResult.gap >= 0 ? '+' : ''}${scoreResult.gap.toFixed(0)} 分`)
  } else {
    reasons.push('按分数口径：暂无公开最低分数据')
  }

  if (rankResult) {
    reasons.push(`按位次口径：与保守线差值 ${rankResult.gap >= 0 ? '+' : ''}${rankResult.gap.toLocaleString('zh-CN')} 位`)
  } else {
    reasons.push('按位次口径：暂无公开最低位次或可用位次估算')
  }

  return reasons
}

export function recommendMajors({ records, query, estimatedRank }) {
  const filtered = records.filter((record) => {
    const categoryOk = record.categoryCode === query.categoryCode
    const admissionOk = record.admissionTypeCode === query.admissionTypeCode
    const yearOk = query.targetYear === 'all' || Number(record.admissionYear) === Number(query.targetYear)
    return categoryOk && admissionOk && yearOk
  })

  const evaluated = filtered.map((record) => {
    const buffer = getYearBuffer(query.targetYear, record.admissionYear)
    const scoreResult = evaluateScore(query.score, record.minScore, buffer)
    const rankResult = evaluateRank(estimatedRank, record.minRank)
    const decisionCode = pickConservativeLevel(scoreResult, rankResult)

    return {
      ...record,
      decisionCode,
      decisionLabel: LEVEL_LABEL[decisionCode],
      scoreResult,
      rankResult,
      reasons: buildReasons({ scoreResult, rankResult })
    }
  })

  return evaluated.sort((a, b) => {
    if (LEVEL_ORDER[a.decisionCode] !== LEVEL_ORDER[b.decisionCode]) {
      return LEVEL_ORDER[a.decisionCode] - LEVEL_ORDER[b.decisionCode]
    }
    if (a.schoolName !== b.schoolName) {
      return a.schoolName.localeCompare(b.schoolName, 'zh-CN')
    }
    return a.majorName.localeCompare(b.majorName, 'zh-CN')
  })
}
