/**
 * 逐专业招生数据（推荐粒度：学校 + 专业）
 * 说明：
 * 1. 每一条记录必须是“学校 + 专业 + 年份”唯一组合。
 * 2. 同一学校可以出现多个专业，严禁“每校只保留一个专业”。
 * 3. 缺失值保持 null，不得伪造。
 * 4. source 字段注明官方口径类型：
 *    - official_min_score: 官方最低分来源
 *    - official_plan: 官方招生计划来源
 *    - pending: 仍待补充
 */

import { DATA_STATUS_ENUM } from './meta.js'

const OFFICIAL_SCORE_SOURCE_2025 = {
  sourceType: 'official_min_score',
  organization: '广西招生考试院',
  title: '2025 年广西高职分类考试招生录取最低分公开信息（电子信息大类 / 对口技能类）',
  year: 2025,
  url: '',
  status: 'pending'
}

const OFFICIAL_PLAN_SOURCE_2026 = {
  sourceType: 'official_plan',
  organization: '南宁职业技术大学招生信息网',
  title: '2026 年高职分类考试招生专业计划（电子信息相关专业）',
  year: 2026,
  url: '',
  status: 'pending'
}

function createAdmissionRecord({
  id,
  school,
  major,
  scoreYear,
  planYear,
  lastYearMinScore = null,
  admissionPlan = null,
  note = '最低分与计划数据待补充'
}) {
  const hasScore = lastYearMinScore !== null
  const hasPlan = admissionPlan !== null

  let dataStatus = DATA_STATUS_ENUM.missing
  if (hasScore && hasPlan) dataStatus = DATA_STATUS_ENUM.complete
  if ((hasScore && !hasPlan) || (!hasScore && hasPlan)) dataStatus = DATA_STATUS_ENUM.partial

  return {
    id,
    school,
    major,
    majorCategory: 'electronic_information',
    admissionMode: 'counterpart_skills',
    scoreYear,
    lastYearMinScore,
    planYear,
    admissionPlan,
    scoreSource: { ...OFFICIAL_SCORE_SOURCE_2025 },
    planSource: { ...OFFICIAL_PLAN_SOURCE_2026 },
    note,
    dataStatus,
    isKeyDataMissing: !hasScore
  }
}

export const ADMISSIONS = [
  // ===== 南宁职业技术大学（电子信息大类 / 对口技能类）=====
  createAdmissionRecord({
    id: 'nntvu-software-tech-2025',
    school: '南宁职业技术大学',
    major: '软件技术',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),
  createAdmissionRecord({
    id: 'nntvu-big-data-tech-2025',
    school: '南宁职业技术大学',
    major: '大数据技术',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),
  createAdmissionRecord({
    id: 'nntvu-iot-tech-2025',
    school: '南宁职业技术大学',
    major: '物联网应用技术',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),
  createAdmissionRecord({
    id: 'nntvu-info-security-2025',
    school: '南宁职业技术大学',
    major: '信息安全技术应用',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),
  createAdmissionRecord({
    id: 'nntvu-network-tech-2025',
    school: '南宁职业技术大学',
    major: '计算机网络技术',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),
  createAdmissionRecord({
    id: 'nntvu-animation-production-2025',
    school: '南宁职业技术大学',
    major: '动漫制作技术',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),
  createAdmissionRecord({
    id: 'nntvu-smart-product-2025',
    school: '南宁职业技术大学',
    major: '智能产品开发与应用',
    scoreYear: 2025,
    planYear: 2026,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '官方最低分与官方计划暂未录入。'
  }),

  // 历史年份占位：用于后续逐年扩展（当前仍保持空值，不做臆填）
  createAdmissionRecord({
    id: 'nntvu-software-tech-2024',
    school: '南宁职业技术大学',
    major: '软件技术',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  }),
  createAdmissionRecord({
    id: 'nntvu-big-data-tech-2024',
    school: '南宁职业技术大学',
    major: '大数据技术',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  }),
  createAdmissionRecord({
    id: 'nntvu-iot-tech-2024',
    school: '南宁职业技术大学',
    major: '物联网应用技术',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  }),
  createAdmissionRecord({
    id: 'nntvu-info-security-2024',
    school: '南宁职业技术大学',
    major: '信息安全技术应用',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  }),
  createAdmissionRecord({
    id: 'nntvu-network-tech-2024',
    school: '南宁职业技术大学',
    major: '计算机网络技术',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  }),
  createAdmissionRecord({
    id: 'nntvu-animation-production-2024',
    school: '南宁职业技术大学',
    major: '动漫制作技术',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  }),
  createAdmissionRecord({
    id: 'nntvu-smart-product-2024',
    school: '南宁职业技术大学',
    major: '智能产品开发与应用',
    scoreYear: 2024,
    planYear: 2025,
    lastYearMinScore: null,
    admissionPlan: null,
    note: '历史年数据待补录。'
  })
]
