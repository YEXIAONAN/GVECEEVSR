export function formatNullable(value, fallback = '暂无公开数据') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return String(value)
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '暂无公开数据'
  }
  return Number(value).toLocaleString('zh-CN')
}

export function formatDateTime(isoText) {
  if (!isoText) {
    return ''
  }

  const date = new Date(isoText)
  if (Number.isNaN(date.getTime())) {
    return isoText
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}
