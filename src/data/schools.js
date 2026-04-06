/**
 * 学校基础信息
 * 说明：
 * - 本文件仅存放学校维度基础信息，不存放逐专业招生指标。
 * - 后续新增学校时，先补充这里，再在 admissions.js 增加“学校+专业”条目。
 */

export const SCHOOLS = [
  {
    id: 'nntvu',
    name: '南宁职业技术大学',
    shortName: '南职大',
    city: '广西南宁',
    province: '广西壮族自治区',
    tags: ['电子信息大类重点维护学校'],
    website: '',
    remark: '当前版本先维护该校电子信息大类专业。'
  }
]

export const SCHOOL_INDEX = Object.fromEntries(SCHOOLS.map((item) => [item.id, item]))
