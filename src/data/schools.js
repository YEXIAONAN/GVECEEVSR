/**
 * 学校基础信息
 * 说明：
 * - 本文件仅存放学校维度基础信息，不存放逐专业招生指标。
 * - 后续新增学校时，先补充这里，再在 admissions.js 增加“学校+专业”条目。
 */

export const SCHOOLS = [
  {
    id: 'nnvtu',
    name: '南宁职业技术大学',
    shortName: '南职大',
    city: '广西南宁',
    province: '广西壮族自治区',
    tags: ['电子信息大类', '对口技能类'],
    website: 'https://zs.nnvtu.edu.cn/',
    remark: '已补充对口招生电子信息专业计划与部分公开最低分。'
  },
  {
    id: 'gxzjy',
    name: '广西职业技术学院',
    shortName: '广西职院',
    city: '广西南宁',
    province: '广西壮族自治区',
    tags: ['电子信息大类', '对口技能类'],
    website: 'https://zsw.gxzjy.edu.cn/',
    remark: '已补充校内历年录取查询中的对口口径最低分。'
  },
  {
    id: 'gxjtc',
    name: '广西交通职业技术学院',
    shortName: '广西交职院',
    city: '广西南宁',
    province: '广西壮族自治区',
    tags: ['电子信息大类', '对口技能类'],
    website: 'https://www.gxjtc.edu.cn/zjc/',
    remark: '已补充对口专业最低分，部分计划数来自广西招生考试院历史公开计划。'
  },
  {
    id: 'gxgsxy',
    name: '广西工商职业技术学院',
    shortName: '广西工商职院',
    city: '广西南宁',
    province: '广西壮族自治区',
    tags: ['电子信息大类', '对口技能类'],
    website: 'https://zjc.gxgsxy.edu.cn/',
    remark: '已补充分类考试最低分与专业开设信息；计划数仍待补全。'
  },
  {
    id: 'gxgyzyxy',
    name: '广西工业职业技术学院',
    shortName: '广西工业职院',
    city: '广西南宁',
    province: '广西壮族自治区',
    tags: ['电子信息大类', '对口技能类'],
    website: 'https://www.gxgy.edu.cn/',
    remark: '已补充官方公开对口计划中的电子信息专业，最低分待补充。'
  }
]

export const SCHOOL_INDEX = Object.fromEntries(SCHOOLS.map((item) => [item.id, item]))
