export type GraphPart = 'L' | 'R'

export type OutdegreeSet = number[]

export type PartOutdegreePossibilities = {
  L: OutdegreeSet
  R: OutdegreeSet
}

export function integerRange(
  min: number,
  max: number,
): OutdegreeSet {
  const values: number[] = []

  for (let value = min; value <= max; value += 1) {
    values.push(value)
  }

  return values
}

export function allOutdegrees(
  degree: number,
): OutdegreeSet {
  return integerRange(0, degree)
}

export function uniqueSorted(
  values: number[],
): OutdegreeSet {
  return Array.from(new Set(values)).sort(
    (a, b) => a - b,
  )
}