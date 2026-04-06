function interpolateRank(points, score) {
  const sorted = [...points].sort((a, b) => b.score - a.score)

  if (score >= sorted[0].score) {
    return sorted[0].rank
  }

  if (score <= sorted[sorted.length - 1].score) {
    return sorted[sorted.length - 1].rank
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index]
    const next = sorted[index + 1]

    if (score <= current.score && score >= next.score) {
      const ratio = (score - next.score) / (current.score - next.score)
      return Math.round(next.rank + ratio * (current.rank - next.rank))
    }
  }

  return null
}

export function predictRank({ userRank, score, model }) {
  if (userRank !== null && userRank !== undefined && userRank !== '') {
    return {
      estimatedRank: Number(userRank),
      confidence: 'medium',
      method: 'manual',
      note: '使用你输入的位次，置信度高于自动估算。'
    }
  }

  if (!model || !Array.isArray(model.points) || model.points.length < 2) {
    return {
      estimatedRank: null,
      confidence: 'low',
      method: 'unavailable',
      note: '暂无可用的一分一档模型，未填写位次时无法估算。'
    }
  }

  if (score === null || score === undefined || score === '') {
    return {
      estimatedRank: null,
      confidence: 'low',
      method: 'unavailable',
      note: '分数为空，无法估算位次。'
    }
  }

  const rawRank = interpolateRank(model.points, Number(score))
  if (rawRank === null) {
    return {
      estimatedRank: null,
      confidence: 'low',
      method: 'unavailable',
      note: '估算失败，请手工输入位次。'
    }
  }

  return {
    estimatedRank: Math.round(rawRank * 1.08),
    confidence: 'low',
    method: 'model',
    note: '位次为保守估算值（已加保守偏移），仅供参考。'
  }
}
