/**
 * 项目级元数据与枚举定义
 * 说明：
 * - 该文件只存放“项目说明、范围说明、枚举定义”，不放逐专业招生数据。
 * - 枚举值尽量保持稳定，避免后续频繁重命名导致历史数据难维护。
 */

export const PROJECT_META = {
  projectName: '广西职教高考志愿模拟推荐',
  dataVersion: '2026.04.06-static',
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
    scoreYear: 2025,
    note: '用于 2026 年志愿模拟时的“去年最低分参考年”。'
  },
  {
    planYear: 2026,
    note: '用于 2026 年志愿模拟时的“当年计划参考年”。'
  }
]

export const NO_PUBLIC_DATA_TEXT = '暂无公开数据'
