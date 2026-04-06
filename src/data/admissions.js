/**
 * 逐专业招生数据（推荐粒度：学校 + 专业）
 * 维护约束：
 * 1) 每条记录均为“学校 + 专业”粒度，不做按学校聚合推荐。
 * 2) 官方公开缺失的数据必须保留 null，不得推测填充。
 * 3) 分数来源与计划来源分开维护，便于后续按年份替换。
 *
 * 本批次数据说明：
 * - 官方最低分：来自院校官网已公开“分类考试/对口”专业最低分页面。
 * - 官方计划：来自院校官网对口招生计划或广西招生考试院公开计划页。
 * - 若当前仅确认开设但缺少关键字段，dataStatus 标注为 partial 或 missing。
 */

import { DATA_STATUS_ENUM } from './meta.js'

const SOURCES = {
  gxeeaPlan2022: {
    sourceType: 'official_plan',
    organization: '广西招生考试院',
    title: '2022年高职对口（直升）招生计划',
    year: 2022,
    url: 'https://www.gxeea.cn/view/content_619_28082.htm'
  },
  nnvtuPlan2025: {
    sourceType: 'official_plan',
    organization: '南宁职业技术大学招生信息网',
    title: '2025年职教高考招生专业计划',
    year: 2025,
    url: 'https://zs.nnvtu.edu.cn/info/1126/7770.htm'
  },
  nnvtuScore2024: {
    sourceType: 'official_min_score',
    organization: '南宁职业技术大学招生信息网',
    title: '2024年分类考试招生专业录取分数线',
    year: 2024,
    url: 'https://zs.nnvtu.edu.cn/info/1345/7827.htm'
  },
  gxzjyScore2025: {
    sourceType: 'official_min_score',
    organization: '广西职业技术学院招生网',
    title: '历年录取成绩查询（高职对口中职自主招生）',
    year: 2025,
    url: 'https://zsw.gxzjy.edu.cn/index.php?sys=home&module=school_lnlqcj'
  },
  gxjtcScore2024: {
    sourceType: 'official_min_score',
    organization: '广西交通职业技术学院招生网',
    title: '2024年对口招生各专业录取分数线及排位',
    year: 2024,
    url: 'https://www.gxjtc.edu.cn/zjc/info/1056/1542.htm'
  },
  gxgsxyScore2024: {
    sourceType: 'official_min_score',
    organization: '广西工商职业技术学院招生就业网',
    title: '2024年分类考试各专业招生录取最低分及位次情况表',
    year: 2024,
    url: 'https://zjc.gxgsxy.edu.cn/info/1431/7943.htm'
  },
  gxgsxyMajor2026: {
    sourceType: 'official_plan',
    organization: '广西工商职业技术学院招生就业网',
    title: '2026年职教高考招生简章（专业设置）',
    year: 2026,
    url: 'https://zjc.gxgsxy.edu.cn/info/1361/8333.htm'
  },
  pending: {
    sourceType: 'pending',
    organization: '待补充',
    title: '暂无公开数据',
    year: null,
    url: ''
  }
}

function inferStatus(lastYearMinScore, admissionPlan) {
  const hasScore = Number.isFinite(lastYearMinScore)
  const hasPlan = Number.isFinite(admissionPlan)
  if (hasScore && hasPlan) return DATA_STATUS_ENUM.complete
  if (hasScore || hasPlan) return DATA_STATUS_ENUM.partial
  return DATA_STATUS_ENUM.missing
}

function createAdmissionRecord({
  id,
  school,
  major,
  scoreYear = null,
  lastYearMinScore = null,
  planYear = null,
  admissionPlan = null,
  scoreSource = SOURCES.pending,
  planSource = SOURCES.pending,
  note = ''
}) {
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
    scoreSource,
    planSource,
    note,
    dataStatus: inferStatus(lastYearMinScore, admissionPlan),
    isKeyDataMissing: !Number.isFinite(lastYearMinScore)
  }
}

export const ADMISSIONS = [
  // ===== 南宁职业技术大学 =====
  createAdmissionRecord({
    id: 'nnvtu-bigdata',
    school: '南宁职业技术大学',
    major: '大数据技术',
    scoreYear: 2024,
    lastYearMinScore: 435,
    planYear: 2025,
    admissionPlan: 50,
    scoreSource: SOURCES.nnvtuScore2024,
    planSource: SOURCES.nnvtuPlan2025,
    note: '对口招生普通批口径。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-animation',
    school: '南宁职业技术大学',
    major: '动漫制作技术',
    scoreYear: 2024,
    lastYearMinScore: 500,
    planYear: 2025,
    admissionPlan: 35,
    scoreSource: SOURCES.nnvtuScore2024,
    planSource: SOURCES.nnvtuPlan2025,
    note: '对口招生普通批口径。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-iot',
    school: '南宁职业技术大学',
    major: '物联网应用技术',
    scoreYear: 2024,
    lastYearMinScore: 400,
    planYear: 2025,
    admissionPlan: 50,
    scoreSource: SOURCES.nnvtuScore2024,
    planSource: SOURCES.nnvtuPlan2025,
    note: '对口招生普通批口径。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-info-security',
    school: '南宁职业技术大学',
    major: '信息安全技术应用',
    scoreYear: 2024,
    lastYearMinScore: 435,
    planYear: 2025,
    admissionPlan: 45,
    scoreSource: SOURCES.nnvtuScore2024,
    planSource: SOURCES.nnvtuPlan2025,
    note: '对口招生普通批口径。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-smart-product',
    school: '南宁职业技术大学',
    major: '智能产品开发与应用',
    scoreYear: 2024,
    lastYearMinScore: 380,
    planYear: 2025,
    admissionPlan: 47,
    scoreSource: SOURCES.nnvtuScore2024,
    planSource: SOURCES.nnvtuPlan2025,
    note: '对口招生普通批口径。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-ai-application',
    school: '南宁职业技术大学',
    major: '人工智能技术应用',
    scoreYear: 2024,
    lastYearMinScore: 370,
    planYear: 2025,
    admissionPlan: 30,
    scoreSource: SOURCES.nnvtuScore2024,
    planSource: SOURCES.nnvtuPlan2025,
    note: '对口招生普通批口径。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-network',
    school: '南宁职业技术大学',
    major: '计算机网络技术',
    scoreYear: null,
    lastYearMinScore: null,
    planYear: 2025,
    admissionPlan: 50,
    scoreSource: SOURCES.pending,
    planSource: SOURCES.nnvtuPlan2025,
    note: '已在官方计划页出现，当前未检索到同口径公开最低分。'
  }),
  createAdmissionRecord({
    id: 'nnvtu-software',
    school: '南宁职业技术大学',
    major: '软件技术',
    scoreYear: null,
    lastYearMinScore: null,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.pending,
    planSource: SOURCES.pending,
    note: '当前版本暂未检索到对口技能类公开最低分与计划。'
  }),

  // ===== 广西职业技术学院 =====
  createAdmissionRecord({
    id: 'gxzjy-computer-app',
    school: '广西职业技术学院',
    major: '计算机应用技术',
    scoreYear: 2025,
    lastYearMinScore: 410,
    planYear: 2022,
    admissionPlan: 40,
    scoreSource: SOURCES.gxzjyScore2025,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自校内历年录取查询；计划数来自广西招生考试院对口计划页。'
  }),
  createAdmissionRecord({
    id: 'gxzjy-network',
    school: '广西职业技术学院',
    major: '计算机网络技术',
    scoreYear: 2025,
    lastYearMinScore: 416,
    planYear: 2022,
    admissionPlan: 10,
    scoreSource: SOURCES.gxzjyScore2025,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自校内历年录取查询；计划数来自广西招生考试院对口计划页。'
  }),

  // ===== 广西交通职业技术学院 =====
  createAdmissionRecord({
    id: 'gxjtc-electronic-info',
    school: '广西交通职业技术学院',
    major: '电子信息工程技术',
    scoreYear: 2024,
    lastYearMinScore: 300,
    planYear: 2022,
    admissionPlan: 20,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自学校官网“2024年对口各专业分数线”图表。'
  }),
  createAdmissionRecord({
    id: 'gxjtc-computer-app',
    school: '广西交通职业技术学院',
    major: '计算机应用技术',
    scoreYear: 2024,
    lastYearMinScore: 365,
    planYear: 2022,
    admissionPlan: 140,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自学校官网“2024年对口各专业分数线”图表。'
  }),
  createAdmissionRecord({
    id: 'gxjtc-network',
    school: '广西交通职业技术学院',
    major: '计算机网络技术',
    scoreYear: 2024,
    lastYearMinScore: 300,
    planYear: 2022,
    admissionPlan: 80,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自学校官网“2024年对口各专业分数线”图表。'
  }),
  createAdmissionRecord({
    id: 'gxjtc-digital-media',
    school: '广西交通职业技术学院',
    major: '数字媒体技术',
    scoreYear: 2024,
    lastYearMinScore: 310,
    planYear: 2022,
    admissionPlan: 80,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自学校官网“2024年对口各专业分数线”图表。'
  }),
  createAdmissionRecord({
    id: 'gxjtc-bigdata',
    school: '广西交通职业技术学院',
    major: '大数据技术',
    scoreYear: 2024,
    lastYearMinScore: 300,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.pending,
    note: '公开最低分可见，当前未检索到同口径公开计划数。'
  }),
  createAdmissionRecord({
    id: 'gxjtc-animation',
    school: '广西交通职业技术学院',
    major: '动漫制作技术',
    scoreYear: 2024,
    lastYearMinScore: 350,
    planYear: 2022,
    admissionPlan: 50,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.gxeeaPlan2022,
    note: '最低分来自学校官网“2024年对口各专业分数线”图表。'
  }),
  createAdmissionRecord({
    id: 'gxjtc-modern-communication',
    school: '广西交通职业技术学院',
    major: '现代通信技术',
    scoreYear: 2024,
    lastYearMinScore: 305,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.gxjtcScore2024,
    planSource: SOURCES.pending,
    note: '公开最低分可见，当前未检索到同口径公开计划数。'
  }),

  // ===== 广西工商职业技术学院 =====
  createAdmissionRecord({
    id: 'gxgsxy-computer-app',
    school: '广西工商职业技术学院',
    major: '计算机应用技术',
    scoreYear: 2024,
    lastYearMinScore: 340,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.gxgsxyScore2024,
    planSource: SOURCES.gxgsxyMajor2026,
    note: '对口最低分来自学校分类考试最低分表；招生简章确认该专业面向对口技能类。'
  }),
  createAdmissionRecord({
    id: 'gxgsxy-network',
    school: '广西工商职业技术学院',
    major: '计算机网络技术',
    scoreYear: 2024,
    lastYearMinScore: 315,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.gxgsxyScore2024,
    planSource: SOURCES.gxgsxyMajor2026,
    note: '对口最低分来自学校分类考试最低分表；招生简章确认该专业面向对口技能类。'
  }),
  createAdmissionRecord({
    id: 'gxgsxy-digital-media',
    school: '广西工商职业技术学院',
    major: '数字媒体技术',
    scoreYear: 2024,
    lastYearMinScore: 370,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.gxgsxyScore2024,
    planSource: SOURCES.gxgsxyMajor2026,
    note: '对口最低分来自学校分类考试最低分表；招生简章确认该专业面向对口技能类。'
  }),
  createAdmissionRecord({
    id: 'gxgsxy-bigdata',
    school: '广西工商职业技术学院',
    major: '大数据技术',
    scoreYear: 2024,
    lastYearMinScore: 250,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.gxgsxyScore2024,
    planSource: SOURCES.gxgsxyMajor2026,
    note: '对口最低分来自学校分类考试最低分表；招生简章确认该专业面向对口技能类。'
  }),
  createAdmissionRecord({
    id: 'gxgsxy-vr',
    school: '广西工商职业技术学院',
    major: '虚拟现实技术应用',
    scoreYear: null,
    lastYearMinScore: null,
    planYear: null,
    admissionPlan: null,
    scoreSource: SOURCES.pending,
    planSource: SOURCES.gxgsxyMajor2026,
    note: '已在学校招生简章确认开设，当前未检索到公开最低分与计划数。'
  }),

  // ===== 广西工业职业技术学院 =====
  createAdmissionRecord({
    id: 'gxgyzyxy-iot',
    school: '广西工业职业技术学院',
    major: '物联网应用技术',
    scoreYear: null,
    lastYearMinScore: null,
    planYear: 2022,
    admissionPlan: 20,
    scoreSource: SOURCES.pending,
    planSource: SOURCES.gxeeaPlan2022,
    note: '官方对口计划可查，公开最低分待补充。'
  }),
  createAdmissionRecord({
    id: 'gxgyzyxy-computer-app',
    school: '广西工业职业技术学院',
    major: '计算机应用技术',
    scoreYear: null,
    lastYearMinScore: null,
    planYear: 2022,
    admissionPlan: 40,
    scoreSource: SOURCES.pending,
    planSource: SOURCES.gxeeaPlan2022,
    note: '官方对口计划可查，公开最低分待补充。'
  }),
  createAdmissionRecord({
    id: 'gxgyzyxy-applied-electronics',
    school: '广西工业职业技术学院',
    major: '应用电子技术',
    scoreYear: null,
    lastYearMinScore: null,
    planYear: 2022,
    admissionPlan: 2,
    scoreSource: SOURCES.pending,
    planSource: SOURCES.gxeeaPlan2022,
    note: '官方对口计划可查，公开最低分待补充。'
  })
]
