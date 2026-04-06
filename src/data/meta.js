/**
 * 项目级元数据与枚举定义
 * 说明：
 * - 该文件只存放“项目说明、范围说明、枚举定义”，不放逐专业招生数据。
 * - 枚举值尽量保持稳定，避免后续频繁重命名导致历史数据难维护。
 */

export const PROJECT_META = {
  projectName: '广西职教高考志愿模拟推荐',
  dataVersion: '2026.04.06-r2',
  lastUpdated: '2026-04-06',
  maintainer: 'Waiting',
  disclaimer:
    '本工具仅供志愿模拟参考，不是官方志愿填报系统，最终请以广西招生考试院及院校官方公布信息为准。'
}

export const MAJOR_CATEGORIES = [
  {
    code: 'electronic_information',
    name: '电子信息大类',
    enabled: true,
    note: '当前版本主范围'
  }
]

export const ADMISSION_MODES = [
  {
    code: 'counterpart_skills',
    name: '对口技能类录取方式',
    enabled: true,
    note: '当前版本主范围'
  }
]

export const DATA_STATUS_ENUM = {
  complete: 'complete', // 最低分与计划数均有明确公开数据
  partial: 'partial', // 最低分或计划数仅有其一
  missing: 'missing' // 最低分与计划数均缺失
}

export const YEAR_NOTES = [
  {
    scoreYear: 2024,
    note: '当前已补充的主要最低分参考年。'
  },
  {
    scoreYear: 2025,
    note: '部分院校提供了 2025 年对口录取最低分。'
  },
  {
    planYear: 2025,
    note: '部分院校已补充到 2025 年对口招生计划。'
  },
  {
    planYear: 2022,
    note: '历史公开对口计划用于补充院校覆盖，不代表当年即时计划。'
  }
]

export const NO_PUBLIC_DATA_TEXT = '暂无公开数据'
