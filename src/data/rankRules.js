/**
 * 全区排名估算规则（低可信 / 保守宽区间）
 * 重要声明：
 * - 本规则仅用于模拟参考，不代表官方一分一档结果。
 * - 规则为人工维护的宽区间映射，不提供精确位次。
 * - 后续可按 majorCategory / admissionMode / year 持续扩展。
 */

export const RANK_ESTIMATE_RULES = [
  {
    id: 'gx-2026-ei-counterpart-low-confidence-v1',
    year: 2026,
    majorCategory: 'electronic_information',
    admissionMode: 'counterpart_skills',
    enabled: true,
    confidenceLevel: 'low',
    scoreRange: {
      min: 0,
      max: 500
    },
    disclaimer:
      '仅基于预设规则估算，不代表官方一分一档，最终请以广西招生考试院及院校官方公布信息为准。',
    note: '区间故意放宽，避免制造“精准预测”错觉。',
    segments: [
      {
        label: '约前段',
        minScore: 465,
        maxScore: 500,
        competitiveness: '很强',
        rankRange: [80, 260]
      },
      {
        label: '约中上前段',
        minScore: 440,
        maxScore: 464,
        competitiveness: '较强',
        rankRange: [240, 560]
      },
      {
        label: '约中上段',
        minScore: 410,
        maxScore: 439,
        competitiveness: '中上',
        rankRange: [520, 980]
      },
      {
        label: '约中段',
        minScore: 375,
        maxScore: 409,
        competitiveness: '中等',
        rankRange: [920, 1500]
      },
      {
        label: '约中后段',
        minScore: 0,
        maxScore: 374,
        competitiveness: '偏弱',
        rankRange: [1450, 2300]
      }
    ],
    fallback: {
      competitiveness: '中等',
      estimatedRankText: '参考位次（低可信）：暂无可用估算区间',
      note: '当前分数未命中有效区间，建议直接参考院校专业近年分数与计划信息。'
    }
  }
]

// 兼容旧命名，避免已有引用直接报错
export const RANK_RULES = RANK_ESTIMATE_RULES
