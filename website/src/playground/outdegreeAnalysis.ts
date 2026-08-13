import type { OutdegreeRange } from '../tools/orientAcrossPartition'

export type OutdegreeValueStatus = {
  value: number
  forbidden: boolean
}

export function analyzeOutdegreeRange(
  range: OutdegreeRange,
  forbiddenSet: readonly number[],
): OutdegreeValueStatus[] {
  const forbidden = new Set(forbiddenSet)

  const values: OutdegreeValueStatus[] = []

  for (let value = range.min; value <= range.max; value += 1) {
    values.push({
      value,
      forbidden: forbidden.has(value),
    })
  }

  return values
}

export function rangeAvoidsForbiddenSet(
  range: OutdegreeRange,
  forbiddenSet: readonly number[],
) {
  return analyzeOutdegreeRange(range, forbiddenSet).every(
    ({ forbidden }) => !forbidden,
  )
}