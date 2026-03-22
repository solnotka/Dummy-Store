export const LOW_RATING_THRESHOLD = 3.5

export function formatCategoryLabel(category: string): string {
  return category
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function formatRubParts(price: number): [string, string] {
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  const i = formatted.lastIndexOf(',')
  if (i < 0) {
    return [formatted, '']
  }
  return [formatted.slice(0, i), formatted.slice(i)]
}

function stripLeadingZerosIntPart(s: string): string {
  const trimmed = s.replace(/^0+/, '')
  return trimmed === '' ? '0' : trimmed
}

/** Только цифры и одна запятая; после запятой не больше двух цифр; ведущие нули в целой части убираются */
export function normalizePriceInput(raw: string): string {
  const filtered = raw.replace(/[^\d,]/g, '')
  if (filtered === '') return ''
  const commaIdx = filtered.indexOf(',')
  if (commaIdx === -1) {
    return stripLeadingZerosIntPart(filtered.replace(/\D/g, ''))
  }
  const intRaw = filtered.slice(0, commaIdx).replace(/\D/g, '')
  const fracRaw = filtered.slice(commaIdx + 1).replace(/\D/g, '').slice(0, 2)
  const intPart = intRaw === '' ? '0' : stripLeadingZerosIntPart(intRaw)
  return intPart + ',' + fracRaw
}

const ART_SKU_DIGIT_COUNT = 8

export const ART_SKU_PREFIX = 'ART-'

/** Полное значение артикула для формы и API: ART- + ровно 8 цифр */
export const artSkuRegex = /^ART-\d{8}$/

/** Одно поле: пусто или ART- + до 8 цифр (ввод с/без префикса, лишние символы отбрасываются) */
export function normalizeArtSkuInput(raw: string): string {
  const t = raw.trim()
  if (t === '') return ''
  const afterPrefix = t.replace(/^ART-?/i, '')
  const digits = afterPrefix.replace(/\D/g, '').slice(0, ART_SKU_DIGIT_COUNT)
  return `${ART_SKU_PREFIX}${digits}`
}
